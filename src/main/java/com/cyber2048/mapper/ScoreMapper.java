package com.cyber2048.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cyber2048.dto.ScoreRankVO;
import com.cyber2048.entity.Score;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface ScoreMapper extends BaseMapper<Score> {

    // ① 单 layout 的最高分（你原来的，保留）
    @Select("""
        SELECT MAX(score)
        FROM scores
        WHERE user_id = #{userId}
          AND layout_id = #{layoutId}
    """)
    Integer selectBestScore(
            @Param("userId") Long userId,
            @Param("layoutId") Integer layoutId
    );

    // ② 所有 layout 的最高分（新增）
    @Select("""
        SELECT layout_id AS layout_id, MAX(score) AS bestScore
        FROM scores
        WHERE user_id = #{userId}
        GROUP BY layout_id
    """)
    List<Map<String, Object>> selectMyBestScoreAll(
            @Param("userId") Long userId
    );


    @Select("""
    SELECT u.username AS username, s.score AS score
    FROM scores s
    JOIN users u ON s.user_id = u.id
    WHERE s.layout_id = #{layoutId}
    ORDER BY s.score DESC
    LIMIT 10
""")
    List<ScoreRankVO> selectTop10ByLayout(Integer layoutId);


}
