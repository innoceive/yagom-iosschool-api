package net.yagom.domain.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse {
    public static final String SUCCESS = "success";
    public static final String FAILURE = "failure";
    public static final String UNAUTHORIZED = "unauthorized";

    public BaseResponse(String mid) {
        this.mid = mid;
    }

    protected String result;
    protected String mid;
    protected String message;

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getMid() {
        return mid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
