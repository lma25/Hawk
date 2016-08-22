package com.example.email;

import java.io.*;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;

/**
 * Created by Li on 2016/7/19.
 */
public class MailSender {
    private String host;
    private int port;
    private String user;
    private String password;
    private Properties props;

    public MailSender(String host, int port, String user, String password) throws Exception{
        this.host = host;
        this.user = user;
        this.port = port;
        this.password = password;
        this.props = new Properties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.host", host);
        props.put("mail.from","aaa@gmail.com");
        props.put("mail.smtp.port", "" + port);
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
    }

    public void send(String sendTo, String subject, String content) throws Exception{
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user, password);
            }
        });
        Message msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(user));
        msg.setRecipient(Message.RecipientType.TO, new InternetAddress(sendTo));
        msg.setSubject(subject);
        msg.setText(content);
        Transport.send(msg);
    }
    public static void main(String[] args){
        try {
            MailSender li = new MailSender("smtp.gmail.com", 587, "jatenma2416@gmail.com", "mali2416");
            li.send("lma25@hawk.iit.edu", "Hello World", "Hello Li!");
        }catch(Exception e){
            e.printStackTrace();
        }
        System.out.println("Finished.");
    }
}
