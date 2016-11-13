package net.yagom.domain.response;

public class BaseResponse {
    public static final String SUCCESS = "success";
    public static final String FAILURE = "failure";
    public static final String UNAUTHORIZED = "unauthorized";

    public BaseResponse(String mid) {
        this.mid = mid;
    }

    protected String result;
    protected String mid;

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getMid() {
        return mid;
    }
}
