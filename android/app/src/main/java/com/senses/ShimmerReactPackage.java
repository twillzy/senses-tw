package com.senses;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.senses.reactmodules.ConnectToHardwareModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class ShimmerReactPackage implements ReactPackage {

    private final Activity activity;

    public ShimmerReactPackage(Activity activity) {
        super();
        this.activity = activity;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ConnectToHardwareModule(reactContext, activity));
        return modules;
    }
}
