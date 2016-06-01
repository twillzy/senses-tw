package com.senses.reactmodules;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.senses.services.btdevice.DeviceStatus;
import com.senses.services.btdevice.ShimmerService;
import com.senses.video.VideoCapture;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule implements LifecycleEventListener, ActivityEventListener {

    public static final String VALUE_OK = "OK";
    public static final String VALUE_CANCEL = "CANCEL";
    private static final int REQUEST_ENABLE_BT = 1;
    private static final String PARAM_RESULT_CODE = "connectedToBluetooth";
    final ReactApplicationContext reactContext;
    private final VideoCapture videoCapture;
    private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private ShimmerService mShimmerService;
    private Intent mShimmerIntent = null;
    private Promise promise;
    private ServiceConnection mShimmerConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mShimmerService = ((ShimmerService.LocalBinder) service).getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            doUnbindService();
        }
    };

    public ConnectToHardwareModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addLifecycleEventListener(this);
        this.reactContext.addActivityEventListener(this);
        this.videoCapture = new VideoCapture(activity);
        doBindService();
        doBindBroadcastReceiver();
    }

    @ReactMethod
    public void enableBluetooth(Promise promise) {
        this.promise = promise;
        if (mBluetoothAdapter.isEnabled()) {
            resolvePromiseWithArgument(PARAM_RESULT_CODE, VALUE_OK);
            return;
        }
        try {
            if (isBlueToothSupported()) {
                if (!mBluetoothAdapter.isEnabled()) {
                    Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                    reactContext.startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT, null);
                }
            }
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void connectToShimmer(Promise promise) {
        this.promise = promise;
        try {
            mShimmerService.connectShimmer("00:06:66:74:54:B5", "Shimmer3");
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void stopShimmerStreaming(Promise promise) {
        this.promise = promise;
        try {
            mShimmerService.stopStreaming();
            Log.d("SHIMMER", "Stop Streaming");
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getGSRData(Promise promise) {
        this.promise = promise;
        try {
            if (mShimmerService == null) {
                return;
            }
            Map<Integer, Integer> timeOffsetGSRPairs = mShimmerService.getTimeOffsetsAndGSRValuePairs();
            WritableMap writablePairs = Arguments.createMap();
            for (Integer timeOffset : timeOffsetGSRPairs.keySet()) {
                writablePairs.putInt(String.valueOf(timeOffset), timeOffsetGSRPairs.get(timeOffset));
            }
            WritableMap map = Arguments.createMap();
            map.putMap("gsrVals", writablePairs);
            promise.resolve(map);
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        } catch (IOException e) {
            e.printStackTrace();
        }
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

    @Override
    public void onHostResume() {
        doBindService();
        Log.d("PAUSE", "Restarting service now");

    }

    @Override
    public void onHostPause() {
        Log.d("PAUSE", "Stopping service now");
        doUnbindService();
    }

    @Override
    public void onHostDestroy() {
        doUnbindService();
        Log.d("PAUSE", "Service stopped");
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_OK) {
            resolvePromiseWithArgument(PARAM_RESULT_CODE, VALUE_OK);
        } else {
            resolvePromiseWithArgument(PARAM_RESULT_CODE, VALUE_CANCEL);
        }
    }

    private boolean isBlueToothSupported() {
        return mBluetoothAdapter != null;
    }

    private void doBindService() {
        mShimmerIntent = new Intent(getReactApplicationContext(), ShimmerService.class);
        reactContext.bindService(mShimmerIntent, mShimmerConnection, Context.BIND_AUTO_CREATE);
        reactContext.startService(mShimmerIntent);
    }

    private void doUnbindService() {
        mShimmerService.disconnectShimmer();
        mShimmerService.stopService(mShimmerIntent);
    }

    private void doBindBroadcastReceiver() {
        IntentFilter intentFilter = new IntentFilter("com.senses.services.btdevice.ShimmerService");
        reactContext.registerReceiver(new ShimmerReceiver(), intentFilter);
    }

    private void resolvePromiseWithArgument(String key, String value) {
        if (this.promise == null) {
            return;
        }
        WritableMap map = Arguments.createMap();
        map.putString(key, value);
        this.promise.resolve(map);
    }

    private class ShimmerReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            DeviceStatus status = (DeviceStatus) intent.getSerializableExtra("ShimmerState");
            switch (status) {
                case CONNECTED:
                    Toast.makeText(getReactApplicationContext(), "Connected to Shimmer", Toast.LENGTH_LONG).show();
                    break;
                case CONNECTING:
                    Log.d("Shimmer", "Connecting to Shimmer now");
                    break;
                case DISCONNECTED:
                    Toast.makeText(getReactApplicationContext(), "Lost Connection to Shimmer", Toast.LENGTH_LONG).show();
                    break;
                case READY_TO_STREAM:
                    mShimmerService.setEnableLogging(true);
                    mShimmerService.startStreamingGSRData();

                    resolvePromiseWithArgument("streamingOn", "OK");
                    break;
                case STREAMING_STOPPED:
                    try {
                        mShimmerService.stopWritingToLog();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
            }
        }
    }
}
