package com.senses.reactmodules;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.senses.services.ShimmerService;

import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule implements LifecycleEventListener, ActivityEventListener {

    private static final int REQUEST_ENABLE_BT = 1;
    public static final String VALUE_OK = "OK";
    private static final String PARAM_RESULT_CODE = "resultCode";
    public static final String VALUE_CANCEL = "CANCEL";
    final ReactApplicationContext reactContext;
    private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private WritableArray mNewDevicesArrayAdapter = Arguments.createArray();
    private ShimmerService mShimmerService;
    private Intent mShimmerIntent = null;
    private Promise promise;

    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                mNewDevicesArrayAdapter.pushString(device.getName() + "\n" + device.getAddress());
            }
        }
    };

    private ServiceConnection mShimmerConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
            mShimmerService = ((ShimmerService.LocalBinder) service).getService();
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
        this.reactContext = reactContext;
        this.reactContext.addLifecycleEventListener(this);
        this.reactContext.addActivityEventListener(this);
        doBindService(reactContext);
    }

    public Boolean isBlueToothSupported() {
        if (mBluetoothAdapter == null) {
            return false;
        }
        return true;
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
    public void enableBluetooth(Promise promise) {
        this.promise = promise;
        if (mBluetoothAdapter.isEnabled()) {
            resolvePromiseWithArgument(PARAM_RESULT_CODE, "OK");
            return;
        }
        try {
            if(isBlueToothSupported()) {
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
        try {
            boolean result = mShimmerService.connectShimmer("00:06:06:74:54:B5", "Shimmer3");
            WritableMap map = Arguments.createMap();
            map.putBoolean("resultCode", result);
            promise.resolve(map);
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    private void resolvePromiseWithArgument(String key, String value) {
        WritableMap map = Arguments.createMap();
        map.putString(key, value);
        this.promise.resolve(map);
    }

    @Override
    public void onHostDestroy() {
        mShimmerService.stopService(mShimmerIntent);
        Log.d("[DEBUG]", "Service stopped");
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == Activity.RESULT_OK) {
            resolvePromiseWithArgument(PARAM_RESULT_CODE, VALUE_OK);
        } else {
            resolvePromiseWithArgument(PARAM_RESULT_CODE, VALUE_CANCEL);
        }
    }
}
