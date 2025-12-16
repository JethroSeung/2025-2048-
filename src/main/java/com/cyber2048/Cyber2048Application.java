package com.cyber2048;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.cyber2048.mapper")
public class Cyber2048Application {

	public static void main(String[] args) {
		SpringApplication.run(Cyber2048Application.class, args);
	}

}
