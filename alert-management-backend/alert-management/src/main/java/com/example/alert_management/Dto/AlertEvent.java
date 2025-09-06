package com.example.alert_management.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor(staticName = "of")
public class AlertEvent {
    private String type;
    private String id;
    private Map<String, Object> payload;
}
