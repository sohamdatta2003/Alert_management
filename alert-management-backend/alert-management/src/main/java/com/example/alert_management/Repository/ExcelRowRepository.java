package com.example.alert_management.Repository;

import com.example.alert_management.Entity.ExcelRow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExcelRowRepository extends JpaRepository<ExcelRow, String> {
}
