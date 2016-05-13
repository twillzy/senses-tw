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

import java.io.FileNotFoundException;
import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Scanner;

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
        Toast.makeText(this, "My Service Stopped", Toast.LENGTH_LONG).show();
        Log.d(TAG, "onDestroy");
        super.onDestroy();
    }

    public void disconnectAllDevices() {
        shimmer.stop();
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

    public void onStop() {
        if (shimmer == null) {
            return;
        }
        Toast.makeText(this, "My Service Stopped", Toast.LENGTH_LONG).show();
        Log.d(TAG, "onDestroy");
        shimmer.stop();
    }

    public boolean isLoggingEnabled() {
        return mEnableLogging;
    }

    public void setEnableLogging(boolean enableLogging) {
        mEnableLogging = enableLogging;
        Log.d("Shimmer", "Logging :" + Boolean.toString(mEnableLogging));
    }

    public long getEnabledSensors() {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            return shimmer.getEnabledSensors();
        }
        return 0L;
    }

    public void setEnabledSensors(long enabledSensors) {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            shimmer.writeEnabledSensors(enabledSensors);
        }
    }

    public void writeGSRRange(int gsrRange) {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            shimmer.writeGSRRange(gsrRange);
        }
    }

    public double getSamplingRate() {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            return shimmer.getSamplingRate();
        }
        return -1D;
    }

    public int getAccelRange() {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            return shimmer.getAccelRange();
        }
        return -1;
    }

    public int getShimmerState() {
        int status = -1;
        if (shimmer != null) {
            status = shimmer.getShimmerState();
            Log.d("ShimmerState", Integer.toString(status));
        }
        return status;
    }

    public void startStreamingGSRData() {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            Log.d("Shimmer", "Enabled sensors: " + shimmer.getListofEnabledSensors());
            shimmer.startStreaming();
        }
    }

    public List<String> getListofEnabledSensors() {
        List<String> listofSensors = null;

        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            listofSensors = shimmer.getListofEnabledSensors();
        }
        return listofSensors;
    }

    public void stopStreaming() {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            shimmer.stopStreaming();
        }
    }


    public void disconnectShimmer() {
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            shimmer.stop();
        }
    }

    public boolean isDeviceConnected() {
        boolean deviceConnected = false;
        if (shimmer != null && shimmer.getShimmerState() == Shimmer.STATE_CONNECTED) {
            deviceConnected = true;
        }
        return deviceConnected;
    }

    public boolean deviceIsStreaming() {
        boolean deviceStreaming = false;
        if (shimmer != null && shimmer.getStreamingStatus()) {
            deviceStreaming = true;
        }
        return deviceStreaming;
    }

    public void closeAndRemoveFile() {
        if (mEnableLogging) {
            shimmerLog.closeFile();
            try {
                Scanner sc = new Scanner(shimmerLog.getOutputFile());
                while (sc.hasNextLine()) {
                    Log.d("SHIMMERLOGFILE", sc.nextLine());
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }
    }

    public int getShimmerVersion() {
        int version = 0;
        if (shimmer != null) {
            version = shimmer.getShimmerVersion();
        }
        return version;
    }

    public Shimmer getShimmer() {
        return shimmer;
    }

    public Logging getShimmerLog() {
        return shimmerLog;
    }

    public void setShimmerLog(Logging logging) {
        this.shimmerLog = logging;
    }

    public void test() {
        Log.d("ShimmerTest", "Test");
    }

    private void logData(ObjectCluster objectCluster) {
        shimmerLog.logData(objectCluster);
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
            Intent intent = new Intent("com.senses.services.ShimmerService");

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
                            Log.d("Shimmer", ((ObjectCluster) msg.obj).mBluetoothAddress + "  " + ((ObjectCluster) msg.obj).mMyName);
                            intent.putExtra("ShimmerBluetoothAddress", ((ObjectCluster) msg.obj).mBluetoothAddress);
                            intent.putExtra("ShimmerDeviceName", ((ObjectCluster) msg.obj).mMyName);
                            intent.putExtra("ShimmerState", DeviceStatus.CONNECTED);
                            Log.d("Shimmer", "Connected!");
                            sendBroadcast(intent);
                            break;

                        case Shimmer.STATE_CONNECTING:
                            intent.putExtra("ShimmerBluetoothAddress", ((ObjectCluster) msg.obj).mBluetoothAddress);
                            intent.putExtra("ShimmerDeviceName", ((ObjectCluster) msg.obj).mMyName);
                            intent.putExtra("ShimmerState", DeviceStatus.CONNECTING);
                            Log.d("Shimmer", "Connecting!");
                            sendBroadcast(intent);
                            break;

                        case Shimmer.STATE_NONE:
                            intent.putExtra("ShimmerBluetoothAddress", ((ObjectCluster) msg.obj).mBluetoothAddress);
                            intent.putExtra("ShimmerDeviceName", ((ObjectCluster) msg.obj).mMyName);
                            intent.putExtra("ShimmerState", DeviceStatus.DISCONNECTED);
                            sendBroadcast(intent);
                            break;

                        case Shimmer.MSG_STATE_FULLY_INITIALIZED:
                            intent.putExtra("ShimmerBluetoothAddress", ((ObjectCluster) msg.obj).mBluetoothAddress);
                            intent.putExtra("ShimmerDeviceName", ((ObjectCluster) msg.obj).mMyName);
                            intent.putExtra("ShimmerState", DeviceStatus.READY_TO_STREAM);
                            sendBroadcast(intent);
                            break;

                        case Shimmer.MSG_STATE_STOP_STREAMING:
                            intent.putExtra("ShimmerBluetoothAddress", ((ObjectCluster) msg.obj).mBluetoothAddress);
                            intent.putExtra("ShimmerDeviceName", ((ObjectCluster) msg.obj).mMyName);
                            intent.putExtra("ShimmerState", DeviceStatus.STREAMING_STOPPED);
                            sendBroadcast(intent);
                    }

            }
        }

    }

}
