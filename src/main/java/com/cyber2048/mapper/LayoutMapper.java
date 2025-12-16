package com.cyber2048.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyber2048.entity.Layout;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface LayoutMapper extends BaseMapper<Layout> {
    @Select("SELECT id FROM layouts")
    List<Integer> selectAllLayoutIds();

}
