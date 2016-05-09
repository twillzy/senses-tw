package com.senses.reactmodules;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.senses.services.ShimmerService;

import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private ShimmerService mShimmerService;
    private Intent mShimmerIntent = null;

    private ServiceConnection mShimmerConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mShimmerService = ((ShimmerService.LocalBinder) service).getService();
            System.out.println("============BOUND");
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mShimmerService.stopService(mShimmerIntent);
            mShimmerService = null;
            Log.d("[DEBUG]", "Stopped Shimmer Service");

        }
    };

    public ConnectToHardwareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
        doBindService(reactContext);
    }

    public void doBindService(ReactApplicationContext reactContext) {
        mShimmerIntent = new Intent(reactContext, ShimmerService.class);
        reactContext.bindService(mShimmerIntent, mShimmerConnection, Context.BIND_AUTO_CREATE);
        reactContext.startService(mShimmerIntent);
    }

    @Override
    public String getName() {
        return "ConnectToHardwareModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void connectToShimmer() {
        Log.d("[DEBUG]", "Connecting to Shimmer3 now");
        mShimmerService.connectShimmer("00:06:06:74:54:B5", "Shimmer3");
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        mShimmerService.stopService(mShimmerIntent);
        Log.d("[DEBUG]", "Service stopped");
    }
}
