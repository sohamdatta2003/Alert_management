package com.example.alert_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.File;

@EnableScheduling
@SpringBootApplication
public class AlertManagementApplication {

	public static void main(String[] args) {


		SpringApplication.run(AlertManagementApplication.class, args);
	}

}
