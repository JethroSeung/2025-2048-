package com.cyber2048.common;

import lombok.Data;

@Data
public class Result<T> {

    private int code;      // 0 成功，其他失败
    private String msg;    // 提示信息
    private T data;        // 实际数据

    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.setCode(0);
        r.setMsg("success");
        r.setData(data);
        return r;
    }

    public static Result<?> success() {
        return success(null);
    }

    public static Result<?> error(String msg) {
        Result<Object> r = new Result<>();
        r.setCode(1);
        r.setMsg(msg);
        return r;
    }
}
