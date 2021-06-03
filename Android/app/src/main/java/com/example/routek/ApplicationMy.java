package com.example.routek;

import android.app.Application;
import android.graphics.Bitmap;
import android.location.Location;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.util.Base64;

public class ApplicationMy extends Application {
    public String image;
    public Double longitude;
    public Double latitude;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public Bitmap getImage() {
        ImageConverter imageConverter = new ImageConverter();
        return imageConverter.convert(this.image);
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public void setImage(Bitmap image) {
        ImageConverter imageConverter = new ImageConverter();
        this.image = imageConverter.convert(image);
    }
}
