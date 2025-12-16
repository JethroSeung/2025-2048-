package com.cyber2048.controller;

import com.cyber2048.common.Result;
import com.cyber2048.dto.ScoreSubmitDTO;
import com.cyber2048.service.ScoreService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public Result<?> submit(@RequestBody ScoreSubmitDTO dto) {
        scoreService.submitScore(dto);
        return Result.success();
    }


    @GetMapping("/my/best/{layoutId}")
    public Result<Integer> getMyBestScore(@PathVariable Integer layoutId) {
        return Result.success(scoreService.getMyBestScore(layoutId));
    }

    @GetMapping("/my/best/all")
    public Result<?> getMyBestScoreAll() {
        return Result.success(scoreService.getMyBestScoreAll());
    }

    @GetMapping("/rank/{layoutId}")
    public Result<?> getTop10(@PathVariable Integer layoutId) {
        return Result.success(scoreService.getTop10ByLayout(layoutId));
    }

}
