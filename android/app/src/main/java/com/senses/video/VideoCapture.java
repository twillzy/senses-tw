package com.senses.video;

import android.app.Activity;
import android.content.Intent;
import android.provider.MediaStore;

public class VideoCapture {
    private static final int REQUEST_VIDEO_CAPTURE = 2;
    private final Activity activity;

    public VideoCapture(Activity activity) {
        this.activity = activity;
    }

    public void startVideoCapture() {
        Intent takeVideoIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
        if (takeVideoIntent.resolveActivity(activity.getPackageManager()) != null) {
            activity.startActivityForResult(takeVideoIntent, REQUEST_VIDEO_CAPTURE, null);
        }
    }

}
