package com.cyber2048.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    @TableField("password_hash")
    private String passwordHash;
    @TableField("created_at")
    private LocalDateTime createdAt;
}




