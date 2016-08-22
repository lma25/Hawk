package com.example.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * Created by Li on 2016/6/8.
 */

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    private Integer userId;

    @NotNull
    @Column(name = "user_name", unique = true)
    @Size(min = 4, max = 40, message = "User name size is between 4 to 40.")
    @Pattern(regexp = "[a-zA-Z]+[0-9a-zA-Z_]*", message = "User name should start with [a-zA-Z] and only include [0-9a-zA-Z].")
    private String userName;

    @NotNull
    @Column(name = "email", unique = true)
    @Size(min = 4, max = 40, message = "Email size is between 4 to 40.")
    @Pattern(regexp = "[0-9a-zA-Z.]*@([0-9a-zA-Z]+.)+[0-9a-zA-Z]+", message = "Email format is not correct.")
    private String email;

    @NotNull
    @Size(min = 4, max = 40, message = "Password size is between 4 to 40.")
    @Pattern(regexp = "[0-9a-zA-Z_!]*", message = "Password should only include [0-9a-zA-Z_!]")
    private String password;

    @Size(min = 0, max = 40)
    @Pattern(regexp = "[a-zA-Z]*", message = "First name should only include [a-zA-Z]")
    private String firstName;

    @Size(min = 0, max = 40)
    @Pattern(regexp = "[a-zA-Z]*", message = "Last name should only include [a-zA-Z]")
    private String lastName;

    @Size(min = 0, max = 40)
    @Pattern(regexp = "[a-zA-Z2-7]*", message = "Invitation code should only include [a-zA-Z2-7]")
    private String invitationCode;

    private int level;

    private int port;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getInvitationCode() {
        return invitationCode;
    }

    public void setInvitationCode(String invatationCode) {
        this.invitationCode = invatationCode;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
