package com.senses.reactmodules;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Camera;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.provider.MediaStore;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

public class VideoCaptureModule extends ReactContextBaseJavaModule implements LifecycleEventListener, ActivityEventListener {

    static final int REQUEST_VIDEO_CAPTURE = 2;
    private final ReactApplicationContext reactContext;
    private Promise promise;
    private Activity activity;

    public VideoCaptureModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addLifecycleEventListener(this);
        this.reactContext.addActivityEventListener(this);
        this.activity = activity;
    }

    @ReactMethod
    public void captureVideo(Promise promise) {
        this.promise = promise;
        try {
            Intent takeVideoIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
            if (takeVideoIntent.resolveActivity(reactContext.getPackageManager()) != null) {
                reactContext.startActivityForResult(takeVideoIntent, REQUEST_VIDEO_CAPTURE, null);
            }
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == REQUEST_VIDEO_CAPTURE && resultCode == Activity.RESULT_OK) {
            String videoUri = intent.getData().getPath();
            WritableMap map = Arguments.createMap();
            map.putString("streamUrl", videoUri);
            this.promise.resolve(map);
        } else {
            WritableMap map = Arguments.createMap();
            map.putString("streamUrl", "blah");
            this.promise.resolve(map);
        }
    }

    @Override
    public String getName() {
        return "VideoCaptureModule";
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }
}
