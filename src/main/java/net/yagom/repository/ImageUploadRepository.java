package net.yagom.repository;

import net.yagom.domain.pojo.ImageItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageUploadRepository extends JpaRepository<ImageItem, Long> {
    List<ImageItem> findByUserId(Long userId);
    void delete(Long id);
    ImageItem findById(Long id);
}
