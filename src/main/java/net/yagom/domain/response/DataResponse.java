package net.yagom.domain.response;

public class DataResponse<T> extends BaseResponse {

    public DataResponse(String mid) {
        super(mid);
    }

    private T data;

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
