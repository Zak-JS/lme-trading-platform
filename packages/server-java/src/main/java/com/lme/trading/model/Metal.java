package com.lme.trading.model;

import lombok.Getter;

@Getter
public enum Metal {
    CU("Copper", 8500.0),
    AL("Aluminium", 2300.0),
    ZN("Zinc", 2800.0),
    PB("Lead", 2100.0),
    NI("Nickel", 16000.0),
    SN("Tin", 25000.0);

    private final String name;
    private final double basePrice;

    Metal(String name, double basePrice) {
        this.name = name;
        this.basePrice = basePrice;
    }
}
