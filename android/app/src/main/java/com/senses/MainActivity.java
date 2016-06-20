package com.senses;

import com.facebook.react.ReactActivity;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
    private ReactInstanceManager mReactInstanceManager;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "senseS";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }


    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new ReactVideoPackage(),
                new ReactMaterialKitPackage(),
                new RCTSplashScreenPackage(this),
//                new SensesVideoViewPackage(this),
                new ShimmerReactPackage(this)
        );
    }
}
