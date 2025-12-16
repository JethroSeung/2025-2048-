package com.cyber2048.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("layouts")
public class Layout {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String code;

    private String name;

    private String description;

    @TableField("created_at")
    private LocalDateTime createdAt;



}
