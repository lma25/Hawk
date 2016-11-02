package com.example.controller;


import com.example.model.InvitationCode;
import com.example.model.PasswordChecker;
import com.example.model.User;
import com.example.repository.InvitationCodeRepository;
import com.example.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

/**
 * Created by Li on 2016/6/9.
 */


@Controller
public class UserMVCController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InvitationCodeRepository invitationCodeRepository;

    private PasswordChecker sCryptPasswordEncoder = new PasswordChecker();

    @RequestMapping(
            value = "/showUsers",
            method = RequestMethod.GET
    )
    public String showUsers(Model model){
        model.addAttribute("users", this.userRepository.findAll());
        return "showUsers";
    }

    @RequestMapping(
            value = "/signin",
            method = RequestMethod.GET
    )
    public String signinForm(){
        return "signin";
    }

    @RequestMapping(
            value = "/signin",
            method = RequestMethod.POST
    )
    public String signin(@ModelAttribute("userName") String userName, @ModelAttribute("password") String password, HttpSession session, Model model){
        if(userRepository.findByUserName(userName) == null){
            model.addAttribute("errorMessage", "Cannot find user name.");
            return "signin";
        }else if(!sCryptPasswordEncoder.matches(password, userRepository.findByUserName(userName).getPassword())){
            model.addAttribute("errorMessage", "Password is not correct.");
            return "signin";
        }
        session.setAttribute("userName", userName);
        return "redirect:index";
    }

    @RequestMapping(
            value = "/signup",
            method = RequestMethod.GET
    )
    public String signupForm(User user){
        return "signup";
    }

    @RequestMapping(
            value = "/signup",
            method = RequestMethod.POST
    )
    public String signup(@Valid User user, BindingResult bindingResult, HttpSession session, Model model){
        if(bindingResult.hasErrors()){
            return "signup";
        }
        // If userName or email has been used, report this error.
        String errorMessage = "";
        if(userRepository.findByUserName(user.getUserName()) != null){
            errorMessage += "User name has been used.";
        }
        if(userRepository.findByEmail(user.getEmail()) != null){
            errorMessage += "User email has been used.";
        }
        user.setInvitationCode(user.getInvitationCode().toUpperCase());
        InvitationCode invitationCode = invitationCodeRepository.findByCode(user.getInvitationCode());
        if(invitationCode == null
                || invitationCode.getUsed() == 1){
            errorMessage += "Invitation code does not exist or has been used.";
        }
        if(!errorMessage.equals("")){
            model.addAttribute("errorMessage", errorMessage);
            return "signup";
        }
        invitationCodeRepository.useCode(user.getInvitationCode());
        user.setLevel(invitationCode.getLevel());
        // Scrypt the password.
        user.setPassword(sCryptPasswordEncoder.encode(user.getPassword()));
        // If user passes all the checks, it can be stored in database.
        userRepository.save(user);

        session.setAttribute("userName", user.getUserName());
        return "redirect:index";
    }

    @RequestMapping(
            value = "/logout"
    )
    public String logout(HttpSession session){
        if(session.getAttribute("userName") != null){
            session.removeAttribute("userName");
        }
        return "redirect:index";
    }
}
