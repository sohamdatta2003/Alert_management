package com.example.alert_management.Service;

import com.example.alert_management.Dto.AlertEvent;
import com.example.alert_management.Entity.ExcelRow;
import com.example.alert_management.Repository.ExcelRowRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExcelIngestService {

    private final ExcelRowRepository repo;
    private final AlertService alerts;

    @Transactional
    public void ingest(File excelFile) {
        System.out.println("[IngestService] Ingesting file: " + excelFile.getAbsolutePath());
        try (FileInputStream fis = new FileInputStream(excelFile);
             Workbook wb = WorkbookFactory.create(fis)) {

            Sheet sheet = wb.getSheetAt(0);
            if (sheet == null) return;

            Row header = sheet.getRow(sheet.getFirstRowNum());
            Map<String, Integer> idx = headerIndex(header);

            System.out.println("[IngestService] Header mapping: " + idx);

            for (int r = sheet.getFirstRowNum() + 1; r <= sheet.getLastRowNum(); r++) {
                Row row = sheet.getRow(r);
                if (row == null) continue;

                String id = cell(row, idx.get("id"));
                String from = cell(row, idx.get("from"));
                String subject = cell(row, idx.get("subject"));
                String dateReceived = cell(row, idx.get("date received"));
                String folder = cell(row, idx.get("folder"));
                String application = cell(row, idx.get("application"));
                String shift = cell(row, idx.get("shift"));

                if (id == null || id.isBlank()) continue;

                Map<String, Object> payload = Map.of(
                        "from", from,
                        "subject", subject,
                        "dateReceived", dateReceived,
                        "application", application,
                        "shift", shift
                );

                Optional<ExcelRow> existing = repo.findById(id);
                if (existing.isEmpty()) {
                    ExcelRow created = ExcelRow.builder()
                            .id(id)
                            .from(from)
                            .subject(subject)
                            .dateReceived(dateReceived)
                            .folder(folder)
                            .application(application)
                            .shift(shift)
                            .build();
                    repo.save(created);

                    alerts.broadcast(AlertEvent.of("NEW", id, payload));
                    sendFolderAlert(folder, id, payload);

                } else {
                    ExcelRow entity = existing.get();
                    boolean changed = notEq(entity.getFrom(), from)
                            || notEq(entity.getSubject(), subject)
                            || notEq(entity.getDateReceived(), dateReceived)
                            || notEq(entity.getApplication(), application)
                            || notEq(entity.getShift(), shift)
                            || notEq(entity.getFolder(), folder);

                    if (changed) {
                        entity.setFrom(from);
                        entity.setSubject(subject);
                        entity.setDateReceived(dateReceived);
                        entity.setApplication(application);
                        entity.setShift(shift);
                        entity.setFolder(folder);
                        repo.save(entity);

                        alerts.broadcast(AlertEvent.of("UPDATED", id, payload));
                        sendFolderAlert(folder, id, payload);
                    }
                }
            }
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private void sendFolderAlert(String folder, String id, Map<String, Object> payload) {
        if (folder == null) return;
        String folderType = folder.trim().toLowerCase();
        switch (folderType) {
            case "actionable" -> alerts.broadcast(AlertEvent.of("PENDING", id, payload));
            case "non-actionable" -> alerts.broadcast(AlertEvent.of("NON_ACTIONABLE", id, payload));
            case "change related" -> alerts.broadcast(AlertEvent.of("CHANGE_RELATED", id, payload));
            default -> {}
        }
    }

    private static Map<String, Integer> headerIndex(Row header) {
        Map<String, Integer> map = new HashMap<>();
        if (header == null) return map;
        for (int c = header.getFirstCellNum(); c < header.getLastCellNum(); c++) {
            Cell cell = header.getCell(c, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
            if (cell == null) continue;
            cell.setCellType(CellType.STRING);
            String raw = cell.getStringCellValue().trim().toLowerCase();

            switch (raw) {
                case "from_field" -> raw = "from";
                case "date_received" -> raw = "date received";
            }
            map.put(raw, c);
        }
        return map;
    }

    private static String cell(Row row, Integer c) {
        if (c == null) return null;
        Cell cell = row.getCell(c, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null) return null;
        cell.setCellType(CellType.STRING);
        String v = cell.getStringCellValue();
        return v == null ? null : v.trim();
    }

    private static boolean notEq(String a, String b) {
        return (a == null && b != null) || (a != null && !a.equals(b));
    }
}
