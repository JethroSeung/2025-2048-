package com.cyber2048.service;

import com.cyber2048.dto.ScoreRankVO;
import com.cyber2048.dto.ScoreSubmitDTO;

import java.util.List;
import java.util.Map;

public interface ScoreService {
    /** 提交一次对局分数 */
    void submitScore(ScoreSubmitDTO dto);

    /** 查询当前用户在某布局下的最高分 */
    Integer getMyBestScore(Integer layoutId);

    Map<Integer, Integer> getMyBestScoreAll();

    List<ScoreRankVO> getTop10ByLayout(Integer layoutId);
}
