package com.senses.services;

public enum ShimmerStatus {
    DISCONNECTED(-1),
    CONNECTING(0),
    CONNECTED(1),
    READY_TO_STREAM(2),
    STREAMING(3);

    private final int value;

    ShimmerStatus(int value) {
        this.value = value;
    }
}
