package com.senses;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.senses.reactmodules.VideoCaptureModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SensesVideoViewPackage implements ReactPackage {

    private Activity mActivity;

    public SensesVideoViewPackage(Activity activity) {
        super();
        mActivity = activity;
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new VideoCaptureModule(reactContext, mActivity));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
