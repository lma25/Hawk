package com.example.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * Created by Li on 2016/8/29.
 */
public class PasswordChecker {
    public String encode(String password){
        String result = "";
        try{
            String command = "/home/server/webapps/scrypt_gen " + password;
            String line = "";
            Process p = Runtime.getRuntime().exec(command);
            LogFile.write(command);
            BufferedReader input = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while((line = input.readLine()) != null){
                LogFile.write(line);
                result += line;
            }
        } catch (Exception e){
            e.printStackTrace();
        }
        return result;
    }
    public boolean matches(String rawPassword, String encodedPassword){
        String result = "";
        try{
            String command = "/home/server/webapps/scrypt_check " + rawPassword + " " + encodedPassword;
            LogFile.write(command);
            String line = "";
            Process p = Runtime.getRuntime().exec(command);
            BufferedReader input = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while((line = input.readLine()) != null){
                LogFile.write(line);
                result += line;
            }
        } catch (Exception e){
            e.printStackTrace();
        }
        return result.equals("Correct");
    }

}
