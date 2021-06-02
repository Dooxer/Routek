package com.example.routek;

import android.app.Application;
import android.graphics.Bitmap;
import android.location.Location;

public class ApplicationMy extends Application {
    Bitmap image;
    Location location;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public Bitmap getImage() {
        return image;
    }

    public Location getLocation() {
        return location;
    }

    public void setImage(Bitmap image) {
        this.image = image;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
