package com.senses.reactmodules;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.senses.services.ShimmerService;

import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule {

    private ShimmerService mShimmerService;
    private Intent mShimmerIntent = null;

    private ServiceConnection mConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mShimmerService = ((ShimmerService.LocalBinder) service).getService();
            System.out.println("============BOUND");
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mShimmerService.stopService(mShimmerIntent);
            mShimmerService = null;
            Log.d("[DEBUG]", "Connecting to Shimmer now");

        }
    };

    public ConnectToHardwareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        doBindService(reactContext);
    }

    public void doBindService(ReactApplicationContext reactContext) {
        mShimmerIntent = new Intent(reactContext, ShimmerService.class);
        reactContext.bindService(mShimmerIntent, mConnection, Context.BIND_AUTO_CREATE);
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
        Log.d("[DEBUG]", "Connecting to Shimmer now");
        mShimmerService.connectShimmer("00:06:66:66:96:86", "Shimmer3");
    }
}
