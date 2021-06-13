package com.example.routek;

import android.Manifest;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.ParseException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@RequiresApi(api = Build.VERSION_CODES.O)
public class RoadQualityRecognitionActivity extends AppCompatActivity {
    private static final String TAG = RoadQualityRecognitionActivity.class.getSimpleName();
    private ApplicationMy applicationMy;
    Road previousRoad = new Road();
    Road currentRoad = new Road();
    TextView xValue;
    TextView yValue;
    int counter = 0;

    long duration = TimeUnit.SECONDS.toMillis(5);
    private CountDownTimer countDownTimer;

    private SensorManager sensorManager;
    private Sensor gyroscope;
    private SensorEventListener gyroscopeEventListener;
    float gyroXvalue;
    float gyroYvalue;
    float gyroZvalue;
    Boolean recording = false;
    List<GyroValue> gyroValues;

    private static final int REQUEST_LOCATION_PERMISSION = 99;
    boolean trackingLocation = false;
    FusedLocationProviderClient fusedLocationProviderClient;
    LocationCallback locationCallback;

    private Gson gson = new GsonBuilder().setPrettyPrinting().create();
    RequestQueue requestQueue;
    String signsURL = "http://192.168.1.7:3001/roads/list";
    JsonObjectRequest objectRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_road_quality_detector);
        initCountDownTimer();

        xValue = (TextView) findViewById(R.id.xValueTextView);
        yValue = (TextView) findViewById(R.id.yValueTextView);
        gyroValues = new ArrayList<>();
        applicationMy = (ApplicationMy) getApplication();
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (trackingLocation) {
                    applicationMy.setLatitude(locationResult.getLastLocation().getLatitude());
                    applicationMy.setLongitude(locationResult.getLastLocation().getLongitude());
                    Log.d(TAG, "LOCATION: " + locationResult.getLastLocation().getLongitude() + ", " + locationResult.getLastLocation().getLatitude());
                }
            }
        };
        getLocation();

        requestQueue = Volley.newRequestQueue(this);
        objectRequest = null;
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);

        if (gyroscope == null) {
            Log.d(TAG, "Could not load gyroscope!");
        }

        gyroscopeEventListener = new SensorEventListener() {
            @Override
            public void onSensorChanged(SensorEvent event) {
                gyroXvalue = event.values[0];
                gyroYvalue = event.values[1];
                gyroZvalue = event.values[2];

                //Log.d(TAG, "X: " + gyroXvalue + " Y:" + gyroYvalue + " Z: " + gyroZvalue);

                xValue.setText(String.format("%.02f", event.values[0]));
                yValue.setText(String.format("%.02f", event.values[1]));
                //Log.d(TAG, "X: " + Float.valueOf(String.format("%.02f", event.values[0]).replace(",", ".")) + " Y:" + Float.valueOf(String.format("%.02f", event.values[1]).replace(",", ".")));
            }

            @Override
            public void onAccuracyChanged(Sensor sensor, int accuracy) {

            }
        };

        Log.d(TAG, "tle sm");
    }

    private void initCountDownTimer() {
        countDownTimer = new CountDownTimer(duration, 200) {
            @Override
            public void onTick(long millisUntilFinished) {
                gyroValues.add(new GyroValue(Float.valueOf(String.format("%.02f", gyroXvalue).replace(",", ".")), Float.valueOf(String.format("%.02f", gyroYvalue).replace(",", "."))));
                //Log.d(TAG, "Added road!!!!");
            }

            @RequiresApi(api = Build.VERSION_CODES.O)
            @Override
            public void onFinish() {
                Log.d(TAG, "NEW LINE!!!!!!!!!!!!!!!!!!!!!!!!!");
                saveRoad();
                xValue.setText("");
                yValue.setText("");
                gyroValues.clear();
                if (recording) {
                    countDownTimer.start();
                }
            }
        };
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_LOCATION_PERMISSION:
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    getLocation();
                } else {
                    Log.d(TAG, "Permission for location denied");
                }
                break;
        }
    }

    public void onMainMenuClick(View view) {
        trackingLocation = false;
        fusedLocationProviderClient.removeLocationUpdates(locationCallback);
        finish();
    }

    public void onPostClick(View view) throws ParseException, JSONException {
        if (applicationMy.roadsJSON.getRoads().isEmpty()) {
            Log.d(TAG, "Record some roads first!");
            return;
        }

        for (int i = 0; i < applicationMy.roadsJSON.getRoads().size(); ) {
            if (applicationMy.roadsJSON.getRoads().get(i).latitude == null || applicationMy.roadsJSON.getRoads().get(i).longtitude == null) {
                applicationMy.roadsJSON.getRoads().remove(i);
            } else i++;
        }

        try {
            objectRequest = new JsonObjectRequest(
                    Request.Method.POST,
                    signsURL,
                    getJSON(),
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.d("Rest response: {}", response.toString());
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            Log.d("Rest error response: {}", error.toString());
                        }
                    }
            );
            Log.d(TAG, "new roooad!");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        applicationMy.clearFile();

        requestQueue.add(objectRequest);
    }

    public void startRecordingRoadQuality(View view) {
        recording = true;
        sensorManager.registerListener(gyroscopeEventListener, gyroscope, SensorManager.SENSOR_DELAY_FASTEST);
        countDownTimer.start();
    }

    public void stopRecordingRoadQuality(View view) {
        recording = false;
        sensorManager.unregisterListener(gyroscopeEventListener);
        countDownTimer.cancel();
        applicationMy.saveToFile();
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private void saveRoad() {
        //set road quality
        currentRoad = new Road();
        Log.d(TAG, currentRoad.date);
        for (GyroValue gyroValue : gyroValues) {
            Log.d(TAG, "X: " + gyroValue.x + " Y: " + gyroValue.y);
            if (((gyroValue.x < 0.4 && gyroValue.x > -0.4) && (gyroValue.y < 0.4 && gyroValue.y > -0.4)) && currentRoad.quality < 2) {
                currentRoad.quality = 1;
                Log.d(TAG, "EXCEEELEENTT!!!!!!");
            } else if ((((gyroValue.x < 1 && gyroValue.x > 0.4) || (gyroValue.x > -1 && gyroValue.x < -0.4))
                    && ((gyroValue.y < 1 && gyroValue.y > 0.4) || (gyroValue.y > -1 && gyroValue.y < -0.4) || (gyroValue.y < 0.4 && gyroValue.y > -0.4)))
                    && currentRoad.quality <= 2) {
                currentRoad.quality = 2;
                Log.d(TAG, "GOOOOOD!!!!!!");
            } else if ((gyroValue.x > 1 || gyroValue.x < -1 || gyroValue.y > 1 || gyroValue.y < -1) && currentRoad.quality < 3) {
                {
                    currentRoad.quality = 3;
                    Log.d(TAG, "BAAAAAD!!!!!!");
                }
            }
        }

        if (previousRoad.quality != currentRoad.quality) {

            currentRoad.pathID = UUID.randomUUID().toString().replace("-", "");
            currentRoad.latitude = applicationMy.latitude;
            currentRoad.longtitude = applicationMy.longitude;

            Road tempRoad = new Road();
            tempRoad.pathID = currentRoad.pathID;
            tempRoad.latitude = previousRoad.latitude;
            tempRoad.longtitude = previousRoad.longtitude;
            tempRoad.quality = currentRoad.quality;

            Road timeSwitch = new Road();
            timeSwitch.date = currentRoad.date;
            currentRoad.date = tempRoad.date;
            tempRoad.date = timeSwitch.date;

            applicationMy.roadsJSON.AddRoad(tempRoad);

            //set previousRoad for next recording
            previousRoad.pathID = currentRoad.pathID;
            previousRoad.latitude = currentRoad.latitude;
            previousRoad.longtitude = currentRoad.longtitude;
            previousRoad.quality = currentRoad.quality;
        } else {
            currentRoad.pathID = previousRoad.pathID;
            currentRoad.latitude = applicationMy.latitude;
            currentRoad.longtitude = applicationMy.longitude;

            //set previousRoad for next recording
            previousRoad.pathID = currentRoad.pathID;
            previousRoad.latitude = currentRoad.latitude;
            previousRoad.longtitude = currentRoad.longtitude;
            previousRoad.quality = currentRoad.quality;
        }

        counter++;
//        Log.d(TAG, "quality: " + currentRoad.quality + "   uuid: " + currentRoad.pathID + "     count: " + counter);
        applicationMy.roadsJSON.AddRoad(currentRoad);
        Log.d(TAG, "road count: " + applicationMy.roadsJSON.getRoads().size());
//        for(int i = 0; i < applicationMy.roadsJSON.getRoads().size(); i++){
//            Log.d(TAG, "path ID: " + applicationMy.roadsJSON.getRoads().get(i).pathID + " latitude: " + applicationMy.roadsJSON.getRoads().get(i).latitude + " longitude: " + applicationMy.roadsJSON.getRoads().get(i).longtitude + " quality: " + applicationMy.roadsJSON.getRoads().get(i).quality);
//        }
    }

    private void getLocation() {
        trackingLocation = true;
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]
                            {Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_LOCATION_PERMISSION);
        } else {
            fusedLocationProviderClient.requestLocationUpdates
                    (getLocationRequest(), locationCallback,
                            null /* Looper */);
        }
    }

    private LocationRequest getLocationRequest() {
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setInterval(2000);
        locationRequest.setFastestInterval(1000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        return locationRequest;
    }

    public JSONObject getJSON() throws ParseException, JSONException {
        String jsonString = gson.toJson(applicationMy.roadsJSON);
        Log.d(TAG, jsonString);
        return new JSONObject(jsonString);
    }
}
