package com.senses.SensesVideoView;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.widget.VideoView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SensesVideoViewManager extends SimpleViewManager<VideoView> {
    private static final String REACT_CLASS = "SensesVideoView";
    private Activity mActivity = null;
    private ThemedReactContext mContext = null;

    public SensesVideoViewManager(Activity activity) {
        mActivity = activity;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public VideoView createViewInstance(ThemedReactContext context) {
        mContext = context;
        return new VideoView(context);
    }

    @ReactProp(name = "streamUrl")
    public void setStreamUrl(VideoView view, @Nullable String streamUrl) {
        view.setVideoPath(streamUrl);
    }
}
