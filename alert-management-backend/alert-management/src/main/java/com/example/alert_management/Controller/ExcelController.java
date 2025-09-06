package com.example.alert_management.Controller;

import com.example.alert_management.Service.ExcelIngestService;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class ExcelController {
    private final ExcelIngestService ingestService;

    // Optional manual trigger: POST /excel/ingest?path=/abs/file.xlsx
    @PostMapping("/ingest")
    public ResponseEntity<Void> ingest(@RequestParam("path") String path) {
        ingestService.ingest(new File(path));
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadExcel(@RequestParam("file") MultipartFile file) {
        // Your file handling logic here
        return ResponseEntity.ok("File uploaded successfully");
    }

}
