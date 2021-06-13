package com.example.routek;

import android.os.Build;

import androidx.annotation.RequiresApi;

import java.time.LocalDateTime;

public class Road {
    public String pathID;
    public Double longtitude;
    public Double latitude;
    public Integer quality = 0;
    public String date;

    @RequiresApi(api = Build.VERSION_CODES.O)
    public Road(){
        date = LocalDateTime.now().toString();
    }
}
