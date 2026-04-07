package com.lme.trading;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LmeApplication {

    public static void main(String[] args) {
        SpringApplication.run(LmeApplication.class, args);
    }
}
