package com.example.alert_management.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "excel_rows")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExcelRow {

    @Id
    @Column(name = "id", nullable = false, length = 100)
    private String id; // You can generate this from 'Subject' or 'From' if needed

    @Column(name = "from_field") // 'from' is a reserved keyword in SQL
    private String from;

    @Column(name = "subject")
    private String subject;

    @Column(name = "date_received")
    private String dateReceived;

    @Column(name = "folder")
    private String folder;

    @Column(name = "application")
    private String application;

    @Column(name = "shift")
    private String shift;
}
