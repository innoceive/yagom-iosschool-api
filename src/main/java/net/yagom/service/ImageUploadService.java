package net.yagom.service;

import net.yagom.domain.pojo.ImageItem;

import java.util.List;

public interface ImageUploadService {
    List<ImageItem> findByUserId(Long userId);
    Long deleteByIdAndUserId(Long imageId, Long userId);
    ImageItem saveAndFlush(ImageItem imageItem);

}
