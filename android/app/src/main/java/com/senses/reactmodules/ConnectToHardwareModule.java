package com.senses.reactmodules;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.senses.services.ShimmerService;

import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule {

    private ShimmerService mShimmerService;

    private ServiceConnection mConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mShimmerService = ((ShimmerService.LocalBinder) service).getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mShimmerService = null;
        }
    };

    public ConnectToHardwareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mShimmerService.bindService(new Intent(getReactApplicationContext(),
                ShimmerService.class), mConnection, Context.BIND_AUTO_CREATE);
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
        mShimmerService.connectShimmer("00:06:66:66:96:86", "Shimmer3");
    }
}
