package com.cyber2048.service.impl;

import com.cyber2048.dto.ScoreRankVO;
import com.cyber2048.dto.ScoreSubmitDTO;
import com.cyber2048.entity.Score;
import com.cyber2048.mapper.LayoutMapper;
import com.cyber2048.mapper.ScoreMapper;
import com.cyber2048.service.ScoreService;
import com.cyber2048.util.UserContext;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScoreServiceImpl implements ScoreService {

    private final ScoreMapper scoreMapper;
    private final LayoutMapper layoutMapper;

    public ScoreServiceImpl(ScoreMapper scoreMapper, LayoutMapper layoutMapper) {
        this.scoreMapper = scoreMapper;
        this.layoutMapper = layoutMapper;
    }

    @Override
    public void submitScore(ScoreSubmitDTO dto) {
        Long userId = UserContext.getUserId();

        if (userId == null) {
            throw new RuntimeException("未登录");
        }

        Score score = new Score();
        score.setUserId(userId);
        score.setLayoutId(dto.getLayoutId());
        score.setScore(dto.getScore());
        score.setCreatedAt(LocalDateTime.now());

        scoreMapper.insert(score);
    }

    @Override
    public Integer getMyBestScore(Integer layoutId) {
        Long userId = UserContext.getUserId();

        if (userId == null) {
            throw new RuntimeException("未登录");
        }

        Integer best = scoreMapper.selectBestScore(userId, layoutId);
        return best == null ? 0 : best;
    }


    @Override
    public Map<Integer, Integer> getMyBestScoreAll() {
        // 保留旧版本核心：登录校验（必选业务逻辑）
        Long userId = UserContext.getUserId();
        if (userId == null) {
            throw new RuntimeException("未登录");
        }

        // 适配字段名：沿用bestScore，layout_id按mapper实际返回值（若旧版本是layoutId则同步改）
        List<Map<String, Object>> rawList = scoreMapper.selectMyBestScoreAll(userId);
        Map<Integer, Integer> bestMap = new HashMap<>();
        for (Map<String, Object> row : rawList) {
            // 冲突字段score → 沿用旧版本的bestScore
            bestMap.put(((Number) row.get("layout_id")).intValue(),
                    ((Number) row.get("bestScore")).intValue());
        }

        // 保留新版本功能增强：返回所有布局ID（无分数填0）+ LinkedHashMap保证顺序
        List<Integer> allLayoutIds = layoutMapper.selectAllLayoutIds();
        Map<Integer, Integer> result = new LinkedHashMap<>();
        for (Integer id : allLayoutIds) {
            result.put(id, bestMap.getOrDefault(id, 0));
        }

        return result;
    }

    @Override
    public List<ScoreRankVO> getTop10ByLayout(Integer layoutId) {
        return scoreMapper.selectTop10ByLayout(layoutId);
    }


}
