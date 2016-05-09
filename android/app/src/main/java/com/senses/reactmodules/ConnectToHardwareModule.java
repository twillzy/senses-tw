package com.senses.reactmodules;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener{

    private static final int REQUEST_ENABLE_BT = 1;
    final ReactApplicationContext reactContext;
    private BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    private WritableArray mNewDevicesArrayAdapter = Arguments.createArray();
    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                mNewDevicesArrayAdapter.pushString(device.getName() + "\n" + device.getAddress());
            }
        }
    };

    public ConnectToHardwareModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    public Boolean isBlueToothSupported() {
        if (mBluetoothAdapter == null) {
            return false;
        }
        return true;
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
        try {
            if(isBlueToothSupported() == true) {
                if (!mBluetoothAdapter.isEnabled()) {
                    Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                    reactContext.startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT, null);
                    promise.resolve(true);
                }
            }
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void startDiscovery(Promise promise) {
        try {
            IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
            reactContext.registerReceiver(mReceiver, filter);
            mBluetoothAdapter.startDiscovery();
            promise.resolve(true);
        } catch (IllegalViewOperationException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getDevices(Promise promise) {
        try {
            WritableArray array = Arguments.createArray();
            if (mBluetoothAdapter.isDiscovering()) {
                for (int i = 0; i < mNewDevicesArrayAdapter.size(); i++) {
                    array.pushString(mNewDevicesArrayAdapter.getString(i));
                }
            }
            promise.resolve(array);
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

    @Override
    public void onHostDestroy() {

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

    }
}
