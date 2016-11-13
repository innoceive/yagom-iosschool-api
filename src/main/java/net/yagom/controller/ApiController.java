package net.yagom.controller;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import net.coobird.thumbnailator.resizers.configurations.ScalingMode;
import net.yagom.component.AWSComponent;
import net.yagom.domain.pojo.ImageItem;
import net.yagom.domain.response.BaseResponse;
import net.yagom.domain.response.DataResponse;
import net.yagom.domain.response.ImageListResponse;
import net.yagom.service.ImageUploadService;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final String THUMBNAIL_SUFFIX = "_thumbnail";
    private final Logger logger = Logger.getLogger(ApiController.class);

    @Autowired
    AWSComponent awsComponent;

    @Autowired
    ImageUploadService imageUploadService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ImageListResponse getImageList(
//            @RequestHeader(value="X-ACCESS-USER") Long userId
            @RequestParam(name = "user_id") Long userId
    ) {
        final String mid = "get_image_list";
        ImageListResponse result = new ImageListResponse();
        result.setUserId(userId);
        List<ImageItem> imageItems = imageUploadService.findByUserId(userId);
        result.setList(imageItems);
        return result;
    }

// TODO update 작업
//    @RequestMapping(value = "/image", method = RequestMethod.UPDATE)
//    public DataResponse<String> deleteImage(
//            @RequestParam(name = "image_data") MultipartFile imageData,
//            @RequestParam(name="image_id") Long id,
//            @RequestParam(name="user_id") Long userId,
//            @RequestParam(name = "title") String title
//    ) {
//
//    }


    @RequestMapping(value = "/image", method = RequestMethod.DELETE)
    public DataResponse<String> deleteImage(
            @RequestParam(name="image_id") Long id,
            @RequestParam(name="user_id") Long userId
    ) {
        final String mid = "DELETE_IMAGE";
        DataResponse response = new DataResponse(mid);
        try {
            Long deletedItemId = imageUploadService.deleteByIdAndUserId(id, userId);
            if(deletedItemId != null) {
                response.setData(String.valueOf(deletedItemId));
                response.setResult(BaseResponse.SUCCESS);
            } else {
                response.setResult(BaseResponse.UNAUTHORIZED);
            }
        } catch(Exception e) {
            response.setResult(BaseResponse.FAILURE);
        }

        return response;
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public DataResponse<String> uploadThumbnail(
            @RequestParam(name = "image_data") MultipartFile imageData,
            @RequestParam(name = "title") String title,
            @RequestParam(name = "user_id") Long userId
//            @RequestHeader(value="X-ACCESS-USER") Long userId
    ) {
        final String mid = "IMAGE_UPLOAD";
        DataResponse response = new DataResponse(mid);
        logger.info("userId: "+ String.valueOf(userId));
        try {
            String[] exploded = imageData.getOriginalFilename().split("\\.");
            final String ext = exploded[exploded.length-1];
            title = title+ "." + ext;
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            InputStream thumbnailInputStream = IOUtils.toBufferedInputStream(imageData.getInputStream());
            Thumbnails.of(thumbnailInputStream).crop(Positions.CENTER).size(100,100).outputFormat(ext).toOutputStream(outputStream);
            thumbnailInputStream = new ByteArrayInputStream(outputStream.toByteArray());

            final String uuid = UUID.randomUUID().toString();
            final String imageUrl = awsComponent.upload(uuid + "." + ext, imageData.getInputStream());
            final String thumbnailImageUrl = awsComponent.upload(uuid + THUMBNAIL_SUFFIX + "." + ext, thumbnailInputStream);

            ImageItem imageItem = new ImageItem();
            imageItem.setImageUrl(imageUrl);
            imageItem.setThumbnailUrl(thumbnailImageUrl);
            imageItem.setTitle(title);
            imageItem.setUserId(userId);
            imageItem = imageUploadService.saveAndFlush(imageItem);
            response.setData(imageItem.getImageUrl());
            response.setResult(BaseResponse.SUCCESS);
        } catch(Exception e) {
            response.setResult(BaseResponse.FAILURE);
            logger.info(e.getMessage());
        }
        return response;
    }

}
