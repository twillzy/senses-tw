package com.senses.services;

//v0.2 -  8 January 2013

/*
 * Copyright (c) 2010, Shimmer Research, Ltd.
 * All rights reserved
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:

 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 *       copyright notice, this list of conditions and the following
 *       disclaimer in the documentation and/or other materials provided
 *       with the distribution.
 *     * Neither the name of Shimmer Research, Ltd. nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.

 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author Jong Chern Lim
 * @date   October, 2013
 */

//Future updates needed
//- the handler should be converted to static

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.shimmerresearch.android.Shimmer;
import com.shimmerresearch.driver.ObjectCluster;
import com.shimmerresearch.tools.Logging;

import java.io.FileReader;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

import au.com.bytecode.opencsv.CSVReader;

public class ShimmerService extends Service {
    private static final String TAG = "ShimmerService";
    public final Handler mHandler = new ShimmerHandler(this);
    private final IBinder mBinder = new LocalBinder();
    Shimmer shimmer = null;
    private boolean mEnableLogging = false;
    private Logging shimmerLog = null;

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate");
    }

    @Override
    public void onDestroy() {
        Log.d("PAUSE", "onDestroy");
        disconnectShimmer();
        super.onDestroy();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("LocalService", "Received start id " + startId + ": " + intent);
        // We want this service to continue running until it is explicitly
        // stopped, so return sticky.
        return START_STICKY;
    }

    @Override
    public void onStart(Intent intent, int startid) {
        Toast.makeText(this, "My Service Started", Toast.LENGTH_LONG).show();

        Log.d(TAG, "onStart");

    }

    public void connectShimmer(String bluetoothAddress, String selectedDevice) {
        shimmer = new Shimmer(this, mHandler, selectedDevice, 51.2, 0, 4, Shimmer.SENSOR_GSR, false);
        shimmer.connect(bluetoothAddress, "default");
    }

    public boolean isLoggingEnabled() {
        return mEnableLogging;
    }

    public void setEnableLogging(boolean enableLogging) {
        mEnableLogging = enableLogging;
        Log.d("Shimmer", "Logging :" + Boolean.toString(mEnableLogging));
    }

    public void startStreamingGSRData() {
        if (isShimmerConnected()) {
            Log.d("Shimmer", "Enabled sensors: " + shimmer.getListofEnabledSensors());
            shimmer.startStreaming();
        }
    }

    public void stopStreaming() {
        if (isShimmerConnected()) {
            shimmer.stopStreaming();
        }
    }


    public void disconnectShimmer() {
        if (isShimmerConnected()) {
            shimmer.stop();
        }
    }

    public void stopWritingToLog() throws IOException {
        if (mEnableLogging) {
            shimmerLog.closeFile();
        }
    }

    private boolean isShimmerConnected() {
        return shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED;
    }

    private Logging getShimmerLog() {
        return shimmerLog;
    }

    public void setShimmerLog(Logging logging) {
        this.shimmerLog = logging;
    }

    private void logData(ObjectCluster objectCluster) {
        shimmerLog.logData(objectCluster);
    }

    public List<Integer> getGSRDataFromFile() throws IOException {
        List<Integer> gsrValues = new ArrayList<>();
        if (shimmerLog.getOutputFile() == null) {
            return gsrValues;
        }
        CSVReader reader = new CSVReader(new FileReader(shimmerLog.getOutputFile()));
        List<String[]> logEntries = reader.readAll();
        for (int i = 20; i < logEntries.size(); i += 20) {
            Integer gsrValue = Math.round(Float.parseFloat(logEntries.get(i)[0]
                    .split("\t")[0]));
            gsrValues.add(gsrValue);
        }
        return gsrValues;
    }

    public class LocalBinder extends Binder {
        public ShimmerService getService() {
            // Return this instance of LocalService so clients can call public methods
            return ShimmerService.this;
        }
    }

    private class ShimmerHandler extends Handler { //TODO make static
        private final WeakReference<ShimmerService> shimmerService;
        public ShimmerHandler(ShimmerService service) {
            shimmerService = new WeakReference<>(service);
        }

        @Override
        public void handleMessage(Message msg) {

            switch (msg.what) { // handlers have a what identifier which is used to identify the type of msg

                case Shimmer.MESSAGE_READ:
                    if ((msg.obj instanceof ObjectCluster)) {    // within each msg an object can be include, objectclusters are used to represent the data structure of the shimmer device
                        ObjectCluster objectCluster = (ObjectCluster) msg.obj;
                        if (shimmerService.get().isLoggingEnabled()) {
                            if (shimmerService.get().getShimmerLog() != null) {
                                shimmerService.get().logData(objectCluster);

                            } else {
                                char[] bA = objectCluster.mBluetoothAddress.toCharArray();
                                shimmerService.get().setShimmerLog(new Logging(Long.toString(System.currentTimeMillis()) + " Device" + bA[12] + bA[13] + bA[15] + bA[16], "\t"));
                            }
                        }
                    }
                    break;

                case Shimmer.MESSAGE_TOAST:
                    Log.d("toast", msg.getData().getString(Shimmer.TOAST));
                    Toast.makeText(getApplicationContext(), msg.getData().getString(Shimmer.TOAST), Toast.LENGTH_LONG).show();
                    break;

                case Shimmer.MESSAGE_STATE_CHANGE:
                    switch (msg.arg1) {
                        case Shimmer.STATE_CONNECTED:
                            createAndBroadcastIntent((ObjectCluster) msg.obj, DeviceStatus.CONNECTED);
                            break;

                        case Shimmer.STATE_CONNECTING:
                            createAndBroadcastIntent((ObjectCluster) msg.obj, DeviceStatus.CONNECTING);
                            break;

                        case Shimmer.STATE_NONE:
                            createAndBroadcastIntent((ObjectCluster) msg.obj, DeviceStatus.DISCONNECTED);
                            break;

                        case Shimmer.MSG_STATE_FULLY_INITIALIZED:
                            createAndBroadcastIntent((ObjectCluster) msg.obj, DeviceStatus.READY_TO_STREAM);
                            break;

                        case Shimmer.MSG_STATE_STOP_STREAMING:
                            createAndBroadcastIntent((ObjectCluster) msg.obj, DeviceStatus.STREAMING_STOPPED);
                            break;
                    }

            }
        }

        private void createAndBroadcastIntent(ObjectCluster objectCluster, DeviceStatus status) {
            Intent intent = new Intent("com.senses.services.ShimmerService");
            Log.d("Shimmer", objectCluster.mBluetoothAddress + "  " + objectCluster.mMyName);
            intent.putExtra("ShimmerBluetoothAddress", objectCluster.mBluetoothAddress);
            intent.putExtra("ShimmerDeviceName", objectCluster.mMyName);
            intent.putExtra("ShimmerState", status);
            sendBroadcast(intent);
        }
    }
}
