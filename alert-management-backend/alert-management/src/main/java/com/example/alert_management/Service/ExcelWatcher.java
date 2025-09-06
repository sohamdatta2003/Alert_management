package com.example.alert_management.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
@RequiredArgsConstructor
public class ExcelWatcher {

    private final ExcelIngestService ingestService;

    @Value("${excel.file.path}")
    private String excelPath;

    @Value("${excel.watch.interval-ms:5000}")
    private long intervalMs;

    private volatile long lastModified = 0;

    @Scheduled(fixedDelayString = "${excel.watch.interval-ms:5000}")
    public void checkForUpdates() {
        System.out.println("[Watcher] checkForUpdates triggered");
        System.out.println("[Watcher] Looking for: " + excelPath);
        try {
            Path path = Path.of(excelPath);
            if (!Files.exists(path)) {
                System.out.println("[Watcher] File not found at: " + excelPath);
                return;
            }

            long modified = Files.getLastModifiedTime(path).toMillis();
            if (true) {
                lastModified = modified;
                System.out.println("[Watcher] File modified. Triggering ingest...");
                ingestService.ingest(new File(excelPath));
            }
        } catch (Exception e) {
            System.out.println("[Watcher] Error while checking file: " + e.getMessage());
        }
    }

}
