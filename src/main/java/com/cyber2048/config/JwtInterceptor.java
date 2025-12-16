package com.cyber2048.config;

import com.cyber2048.util.JwtUtil;
import com.cyber2048.util.UserContext;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class JwtInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {

        String authHeader = request.getHeader("Authorization");

        // 1. 没有 token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        // 2. 取出 token
        String token = authHeader.substring(7);

        try {
            // 3. 校验 token
            Claims claims = JwtUtil.parseToken(token);
            Long userId = claims.get("userId", Long.class);
            UserContext.setUserId(userId);
            // 如果你后面要用 userId，这里先不管
            return true;

        } catch (Exception e) {
            // token 无效 / 过期
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
    }


    @Override
    public void afterCompletion(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler,
            Exception ex
    ) {
        UserContext.clear();
    }

}
