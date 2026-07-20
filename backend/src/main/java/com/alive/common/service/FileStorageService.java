package com.alive.common.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * 이미지 파일을 로컬 디스크(uploadDir)에 저장/삭제하는 서비스. 확장자·컨텐츠 타입을 검증한다.
 */
@Service
public class FileStorageService {

    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png", "webp", "gif");
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * 파일 저장
     */
    public String storeFile(MultipartFile file, String subDir) {
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase(Locale.ROOT)
                    : "";

            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new IllegalArgumentException("허용되지 않는 파일 확장자입니다: ." + extension);
            }
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
                throw new IllegalArgumentException("허용되지 않는 파일 형식입니다: " + contentType);
            }

            // 파일명 생성 (UUID + 원본 확장자)
            String fileName = UUID.randomUUID() + "." + extension;

            // 저장 경로 생성
            Path uploadPath = Paths.get(uploadDir, subDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 저장
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 저장된 파일 URL 반환
            return "/" + subDir + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 파일 삭제
     */
    public void deleteFile(String fileUrl) {
        try {
            Path filePath = Paths.get(uploadDir + fileUrl);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제 실패: " + e.getMessage(), e);
        }
    }
}