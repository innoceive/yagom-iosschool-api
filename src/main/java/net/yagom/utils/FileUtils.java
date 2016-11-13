package net.yagom.utils;

import org.apache.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class FileUtils {
    private static final Logger logger = Logger.getLogger(FileUtils.class);

    public static File convertMultiplartToFile(MultipartFile multipartFile) {
        File result = new File(multipartFile.getOriginalFilename());
        try {
            result.createNewFile();
            FileOutputStream fos = null;
            fos = new FileOutputStream(result);
            fos.close();
        } catch (FileNotFoundException e) {
            logger.error(e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            logger.error(e.getMessage());
            e.printStackTrace();
        }

        return result;
    }
}
