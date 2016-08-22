package com.example.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * Created by Li on 2016/7/14.
 */

@Entity
@Table(name = "invitation")
public class InvitationCode {
    @Id
    @GeneratedValue
    private Integer id;

    @NotNull
    @Size(min = 7, max = 8)
    @Pattern(regexp = "[a-zA-Z2-7]*", message = "Last name should only include [a-zA-Z2-7] and have 8 characters.")
    private String code;

    @NotNull
    private int used;

    @NotNull
    private int level;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getUsed() {
        return used;
    }

    public void setUsed(int used) {
        this.used = used;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
