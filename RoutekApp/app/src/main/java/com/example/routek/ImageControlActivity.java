package com.example.routek;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.NonNull;
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

public class ImageControlActivity extends AppCompatActivity {
    private static final String TAG = ImageControlActivity.class.getSimpleName();
    private static final int REQUEST_LOCATION_PERMISSION = 99;
    private ApplicationMy applicationMy;
    FusedLocationProviderClient fusedLocationProviderClient;
    LocationCallback locationCallback;
    boolean trackingLocation = false;
    ImageView imageView;
    RequestQueue requestQueue;
    String signsURL = "http://192.168.137.78:3001/signs";
    JsonObjectRequest objectRequest;
    private Gson gson = new GsonBuilder().setPrettyPrinting().create();
    Sign signsJSON = new Sign();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_image_control);

        imageView = (ImageView) findViewById(R.id.imageView);

        applicationMy = (ApplicationMy) getApplication();
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (trackingLocation) {
                    applicationMy.setLatitude(locationResult.getLastLocation().getLatitude());
                    applicationMy.setLongitude(locationResult.getLastLocation().getLongitude());
                    setJSONobject();
                    Log.d(TAG, "LOCATION: " + locationResult.getLastLocation().getLongitude() + ", " + locationResult.getLastLocation().getLatitude());
                }
            }
        };

        loadImage();
        getLocation();

        requestQueue = Volley.newRequestQueue(this);
        objectRequest = null;
    }

    private void loadImage() {
        if (applicationMy.getImage() == null) return;

        imageView.setImageBitmap(applicationMy.getImage());
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
        locationRequest.setInterval(10000);
        locationRequest.setFastestInterval(5000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        return locationRequest;
    }

    public void onPostButtonClick(View view) {
        try {
            objectRequest = new JsonObjectRequest(
                    Request.Method.POST,
                    signsURL,
                    getJSON(),
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response){
                            Log.d("Rest response: {}", response.toString());
                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error){
                            Log.d("Rest error response: {}", error.toString());
                        }
                    }
            );
        } catch (ParseException | JSONException e) {
            e.printStackTrace();
        }

        requestQueue.add(objectRequest);
    }

    public JSONObject getJSON() throws ParseException, JSONException {
        String jsonString = gson.toJson(signsJSON);
        Log.d(TAG, jsonString);
        return new JSONObject(jsonString);
    }

    private void setJSONobject(){
        signsJSON.file = applicationMy.image;
        signsJSON.latitude = applicationMy.latitude;
        signsJSON.longtitude = applicationMy.longitude;
    }
}
