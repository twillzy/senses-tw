package com.senses.reactmodules;

import android.bluetooth.BluetoothAdapter;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import java.util.HashMap;
import java.util.Map;

public class ConnectToHardwareModule extends ReactContextBaseJavaModule {

    private BluetoothAdapter mBluetoothAdapter;

    public ConnectToHardwareModule(ReactApplicationContext reactContext) {
        super(reactContext);
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
}
