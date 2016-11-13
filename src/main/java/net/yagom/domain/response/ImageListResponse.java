package net.yagom.domain.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.yagom.domain.pojo.ImageItem;

import java.util.List;

public class ImageListResponse {


    @JsonProperty("user_id")
    protected Long userId;
    protected List<ImageItem> list;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<ImageItem> getList() {
        return list;
    }

    public void setList(List<ImageItem> list) {
        this.list = list;
    }
}
