package com.reloop.organization.model;

public class OrgAlert {
    private String id;
    private String severity; // CRITICAL, WARNING, RESOLVED, INFO
    private String title;
    private String description;
    private String timestamp;
    private boolean isRead;

    public OrgAlert(String id, String severity, String title, String description, String timestamp, boolean isRead) {
        this.id = id;
        this.severity = severity;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
        this.isRead = isRead;
    }

    public String getId() { return id; }
    public String getSeverity() { return severity; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getTimestamp() { return timestamp; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}
