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
    public Long deleteById(Long imageId) {
        ImageItem imageItem = imageUploadRepository.findById(imageId);
        if(imageItem != null) {
            imageUploadRepository.delete(imageId);
        }
        return imageItem.getId();
    }

    @Override
    public ImageItem saveAndFlush(ImageItem imageItem) {
        return imageUploadRepository.saveAndFlush(imageItem);
    }

    @Override
    public ImageItem findById(Long imageId) {
        return imageUploadRepository.findById(imageId);
    }
}
