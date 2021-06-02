package com.example.routek;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;

public class ImageControlActivity extends AppCompatActivity {
    private static final String TAG = ImageControlActivity.class.getSimpleName();
    private static final int REQUEST_LOCATION_PERMISSION = 99;
    private ApplicationMy applicationMy;
    FusedLocationProviderClient fusedLocationProviderClient;
    LocationCallback locationCallback;
    boolean trackingLocation = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_image_control);

        applicationMy = (ApplicationMy) getApplication();
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if(trackingLocation){
                    Log.d(TAG, "LOCATION: " + locationResult.getLastLocation().getLongitude() + ", " + locationResult.getLastLocation().getLatitude());
                }
            }
        };

        getLocation();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_LOCATION_PERMISSION:
                // If the permission is granted, get the location,
                // otherwise, show a Toast
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
//                    getLastLocation().addOnSuccessListener(
//                new OnSuccessListener<Location>() {
//                    @Override
//                    public void onSuccess(Location location) {
//                        if (location != null) {
//                            Log.i(TAG, "Location: " + location.getLatitude() + ", " + location.getLongitude());
//                        }
//                    }
//                });
        }
    }

    private LocationRequest getLocationRequest() {
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setInterval(10000);
        locationRequest.setFastestInterval(5000);
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        return locationRequest;
    }
}
