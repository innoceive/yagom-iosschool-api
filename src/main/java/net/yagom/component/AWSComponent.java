package net.yagom.component;


import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.*;
import org.apache.log4j.Logger;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;

@Component
public class AWSComponent {
    private static final Logger logger = Logger.getLogger(AWSComponent.class);

    @Autowired
    AmazonS3Client amazonS3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;
    @Value("${aws.s3.dir.image}")
    private String dir;
    @Value("${aws.s3.host}")
    private String host;

    private PutObjectResult upload(InputStream inputStream, String uploadKey) throws IOException {
        // content length를 계산하기 위해 InputStream 객체를 clone.
        ByteArrayOutputStream copier = new ByteArrayOutputStream();

        byte[] buffer = new byte[1024];
        int len;
        while ((len = inputStream.read(buffer)) > -1 ) {
            copier.write(buffer, 0, len);
        }
        copier.flush();

        InputStream is1 = new ByteArrayInputStream(copier.toByteArray());   // AWS 전달용
        InputStream is2 = new ByteArrayInputStream(copier.toByteArray());   // Content length 계산용

        // 메타데이터 구성
        ObjectMetadata metadata = new ObjectMetadata();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        int b;
        while ((b = is2.read()) != -1) {
            os.write(b);
        }

        final int contentLength = os.size();
        if(contentLength < 1) {
            throw new IOException("Invalid request: No file to upload.");
        }

        metadata.setContentLength(contentLength);
        logger.info("Content-Length: "+ String.valueOf(os.size()));

        // S3 업로드 요청 객체 생성
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, uploadKey, is1, new ObjectMetadata());
        AccessControlList accessControlList = new AccessControlList();
        accessControlList.grantPermission(GroupGrantee.AllUsers, Permission.Read);
        putObjectRequest.withMetadata(metadata);
        putObjectRequest.setAccessControlList(accessControlList);
        PutObjectResult putObjectResult = amazonS3Client.putObject(putObjectRequest);

        IOUtils.closeQuietly(is1);

        return putObjectResult;
    }
//
//    public String uploadMultipartFile(String fileName, MultipartFile multipartFile) throws IOException {
//        PutObjectResult putObjectResult = upload(multipartFile.getInputStream(), dir+"/"+fileName);
//        return host+"/"+bucket+"/"+dir+"/"+fileName;
//    }

    public String upload(String fileName, InputStream inputStream) throws IOException {
        PutObjectResult putObjectResult = upload(inputStream, dir+"/"+fileName);
        return host+"/"+bucket+"/"+dir+"/"+fileName;
    }

    public List<S3ObjectSummary> list() {
        ObjectListing objectListing = amazonS3Client.listObjects(new ListObjectsRequest().withBucketName(bucket));

        List<S3ObjectSummary> s3ObjectSummaries = objectListing.getObjectSummaries();

        return s3ObjectSummaries;
    }
}