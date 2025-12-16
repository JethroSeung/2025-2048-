package com.cyber2048.service;

import com.cyber2048.dto.LoginRequest;
import com.cyber2048.dto.RegisterRequest;
import com.cyber2048.util.UserContext;
import org.springframework.http.converter.json.GsonBuilderUtils;

public interface UserService {


    void register(RegisterRequest request);

    String login(LoginRequest request);



}
