package com.cyber2048.controller;

import com.cyber2048.entity.Layout;
import com.cyber2048.service.LayoutService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LayoutController {

    private final LayoutService layoutService;

    public LayoutController(LayoutService layoutService) {
        this.layoutService = layoutService;
    }

    @GetMapping("/api/layouts")
    public List<Layout> getAllLayouts() {
        return layoutService.listAllLayouts();
    }
}
