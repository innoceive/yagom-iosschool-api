package net.yagom.service;

import net.yagom.domain.pojo.ImageItem;

import java.util.List;

public interface ImageUploadService {
    List<ImageItem> findByUserId(Long userId);
    Long deleteById(Long imageId);
    ImageItem saveAndFlush(ImageItem imageItem);
    ImageItem findById(Long imageId);
}
