package com.cyber2048.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyber2048.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
