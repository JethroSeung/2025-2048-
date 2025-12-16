package com.cyber2048.service.impl;

import com.cyber2048.entity.Layout;
import com.cyber2048.mapper.LayoutMapper;
import com.cyber2048.service.LayoutService;
import com.cyber2048.util.UserContext;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LayoutServiceImpl implements LayoutService {

    private final LayoutMapper layoutMapper;

    public LayoutServiceImpl(LayoutMapper layoutMapper) {
        this.layoutMapper = layoutMapper;
    }

    @Override
    public List<Layout> listAllLayouts() {
        Long userId = UserContext.getUserId();
        System.out.println("当前用户ID：" + userId);

        return layoutMapper.selectList(null);
    }


}
