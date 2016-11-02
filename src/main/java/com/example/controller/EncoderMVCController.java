package com.example.controller;


import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

/**
 * Created by Li on 2016/8/26.
 */

@Controller
public class EncoderMVCController {
    @RequestMapping(
            value = "/encoder",
            method = RequestMethod.GET
    )
    public String encoder(){
        return "encoder";
    }
    @RequestMapping(
            value = "/encoder",
            method = RequestMethod.POST
    )
    public String showUsers(@ModelAttribute("password") String password,
                            @ModelAttribute("cpuCost") int cpuCost,
                            @ModelAttribute("memoryCost") int memoryCost,
                            @ModelAttribute("parallelization") int parallelization,
                            @ModelAttribute("keyLength") int keyLength,
                            @ModelAttribute("saltLength") int saltLength,
                                BindingResult bindingResult, HttpSession session, Model model){
        if(bindingResult.hasErrors()){
            return "encoder";
        }
        String errorMessage = "";
        if(cpuCost <= 1 || cpuCost >= 65536 || ((cpuCost - 1) & cpuCost) != 0){
            errorMessage += "CPU cost of the algorithm (as defined in scrypt this is N). must be power of 2 greater than 1 and smaller than 65536.\n";
        }
        if(memoryCost < 1){
            errorMessage += "Memory cost must be not less than 1.\n";
        }
        if(keyLength < 1 || keyLength > 2147483647){
            errorMessage += "Key length must be >= 1 and <= 2147483647.\n";
        }
        if(saltLength < 1 || saltLength > 2147483647){
            errorMessage += "Salt length must be >= 1 and <= 2147483647.\n";
        }
        if(errorMessage.length() > 0){
            model.addAttribute("errorMessage", errorMessage);
            return "encoder";
        }

        SCryptPasswordEncoder sCryptPasswordEncoder = new SCryptPasswordEncoder(cpuCost, memoryCost, parallelization, keyLength, saltLength);
        String result = sCryptPasswordEncoder.encode(password);
        errorMessage += result + "\n";
        model.addAttribute("errorMessage", errorMessage);
        return "encoder";
    }
}
