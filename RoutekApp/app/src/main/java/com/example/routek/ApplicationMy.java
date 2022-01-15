package com.example.routek;

import android.app.Application;
import android.graphics.Bitmap;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class ApplicationMy extends Application {
    private static final String TAG = ApplicationMy.class.getSimpleName();

    public String image;
    public Double longitude;
    public Double latitude;
    public RoadsJSON roadsJSON;

    private static final String MY_FILE_NAME = "podatki.json";
    private Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private File file;

    @Override
    public void onCreate() {
        super.onCreate();
        roadsJSON = new RoadsJSON();
        readFromFile();
    }

    public void readFromFile() {
        try {
            if (getFile().length() != 0) {
                roadsJSON = new RoadsJSON(getGSON().fromJson(FileUtils.readFileToString(getFile()), RoadsJSON.class));
            }
        } catch (IOException ex) {
            Log.i(TAG, "Error: " + ex);
        }
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

    public void saveToFile() {
        try {
            if (!roadsJSON.getRoads().isEmpty()) {
                FileUtils.writeStringToFile(getFile(), getGSON().toJson(roadsJSON));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void clearFile() {
        try {
            roadsJSON.ClearRoads();
            FileUtils.writeStringToFile(getFile(), getGSON().toJson(roadsJSON));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Gson getGSON() {
        if (gson == null)
            gson = new GsonBuilder().setPrettyPrinting().create();
        return gson;
    }

    private File getFile() {
        if (file == null) {
            File filesDir = getFilesDir();
            file = new File(filesDir, MY_FILE_NAME);
        }

        return file;
    }
}
