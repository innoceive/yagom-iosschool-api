package net.yagom.domain.response;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
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
