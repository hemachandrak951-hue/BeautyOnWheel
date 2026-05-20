package com.beautyonwheel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.beautyonwheel")
public class BeautyOnWheelApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeautyOnWheelApplication.class, args);
    }
}
