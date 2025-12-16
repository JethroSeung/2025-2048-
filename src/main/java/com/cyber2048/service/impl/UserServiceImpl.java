package com.cyber2048.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cyber2048.dto.LoginRequest;
import com.cyber2048.dto.RegisterRequest;
import com.cyber2048.entity.User;
import com.cyber2048.mapper.UserMapper;
import com.cyber2048.service.UserService;
import com.cyber2048.util.JwtUtil;
import com.cyber2048.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Override
    public void register(RegisterRequest request) {
        // 1. 查重
        QueryWrapper<User> qw = new QueryWrapper<>();
        qw.eq("username", request.getUsername());
        if (userMapper.selectOne(qw) != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 2. 加密密码
        String hash = PasswordUtil.encode(request.getPassword());

        // 3. 保存用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(hash);
        userMapper.insert(user);
    }

    @Override
    public String login(LoginRequest request) {
        QueryWrapper<User> qw = new QueryWrapper<>();
        qw.eq("username", request.getUsername());
        User user = userMapper.selectOne(qw);

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (!PasswordUtil.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("密码错误");
        }

        // 生成 JWT
        return JwtUtil.generateToken(user.getId(), user.getUsername());
    }
}
