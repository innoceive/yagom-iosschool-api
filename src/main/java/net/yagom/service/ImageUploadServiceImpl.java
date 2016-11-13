package net.yagom.service;

import net.yagom.domain.pojo.ImageItem;
import net.yagom.repository.ImageUploadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageUploadServiceImpl implements ImageUploadService {
    @Autowired
    ImageUploadRepository imageUploadRepository;

    @Override
    public List<ImageItem> findByUserId(Long userId) {
        return imageUploadRepository.findByUserId(userId);
    }

    @Override
    public Long deleteByIdAndUserId(Long imageId, Long userId) {
        ImageItem item = imageUploadRepository.findByIdAndUserId(imageId, userId);
        if(item != null && item.getUserId() == userId) {
            imageUploadRepository.delete(imageId);
            return imageId;
        } else {
            return null;
        }
    }

    @Override
    public ImageItem saveAndFlush(ImageItem imageItem) {
        return imageUploadRepository.saveAndFlush(imageItem);
    }
}
