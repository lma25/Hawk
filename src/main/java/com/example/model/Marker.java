package com.example.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by Li on 2016/6/20.
 */
@Entity
@Table(name = "markers")
public class Marker {
    @Id
    @GeneratedValue
    private Integer id;

    @NotNull
    @Column(name = "user_name")
    private String userName;

    @NotNull
    @Column(name = "record_file")
    private Integer recordFile;

    @NotNull
    @Column(name = "latitude")
    private String latitude;

    @NotNull
    @Column(name = "longitude")
    private String longitude;

    @NotNull
    @Column(name = "icon_file")
    private String iconFile;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "record_time")
    private Date recordTime;

    @NotNull
    @Column(name = "trip_id")
    private String tripId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getRecordFile() {
        return recordFile;
    }

    public void setRecordFile(Integer recordFile) {
        this.recordFile = recordFile;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getIconFile() {
        return iconFile;
    }

    public void setIconFile(String iconFile) {
        this.iconFile = iconFile;
    }

    public Date getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(Date recordTime) {
        this.recordTime = recordTime;
    }

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }
}
