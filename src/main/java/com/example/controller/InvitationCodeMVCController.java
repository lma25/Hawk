package com.example.controller;

import com.example.email.MailSender;
import com.example.model.InvitationCode;
import com.example.repository.InvitationCodeRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;
import java.util.*;

/**
 * Created by Li on 2016/7/19.
 */

@Controller
public class InvitationCodeMVCController {
    @Autowired
    private InvitationCodeRepository invitationCodeRepository;
    @Autowired
    private UserRepository userRepository;

    @RequestMapping(
            value = "/icm"
    )
    public String icm(HttpSession session, Model model){
        if(session.getAttribute("userName") == null){
            return "redirect:signin";
        }else if(userRepository.findByUserName((String)session.getAttribute("userName")).getLevel() != 99){
            return "index";
        }
        return "icm";
    }

    @RequestMapping(
            value = {"/GetInvitationCode"},
            method = RequestMethod.POST
    )
    public String getInvitationCode(@ModelAttribute("codeNumber") String codeNumber, HttpSession session, Model model){
        Collection<InvitationCode> codes = new LinkedList<>();
        Collection<InvitationCode> allCodes = invitationCodeRepository.findByLevel(-1);
        Iterator<InvitationCode> i = allCodes.iterator();
        int count = Integer.parseInt(codeNumber);
        while(i.hasNext() && count > 0){
            --count;
            codes.add(i.next());
        }
        model.addAttribute("codes", codes);
        session.setAttribute("codes", codes);
        return "icm";
    }

    @RequestMapping(
            value = {"/SetInvitationCodeLevel"},
            method = RequestMethod.POST
    )
    public String setInvitationCodeLevel(@ModelAttribute("codeLevel") String codeLevel, HttpSession session, Model model){
        Collection<InvitationCode> codes = (Collection<InvitationCode>)session.getAttribute("codes");
        for(InvitationCode code : codes){
            invitationCodeRepository.setCode(code.getId(), Integer.parseInt(codeLevel));
        }
        model.addAttribute("codes", codes);
        model.addAttribute("feedback", "Codes' levels are set to " + codeLevel + ".");
        return "icm";
    }

    @RequestMapping(
            value = "/SendInvitationCode"
    )
    public String sendInvitationCode(@ModelAttribute("destinations") String destinationsString, HttpSession session, Model model){
        String[] destinations = destinationsString.split("[;\n ]+");
        Collection<InvitationCode> codes = (Collection<InvitationCode>)session.getAttribute("codes");
        String content = "Please use the invitation code to register via the below link:\n\nLink : http://192.41.245.236/signup\n\n Invitation Code : ";
        if(destinations.length != codes.size()){
            model.addAttribute("errorMessage", "The number of invitation codes and destinations are not same.");
            return "icm";
        }
        try{
            MailSender sender = new MailSender("smtp.gmail.com", 587, "jatenma2416@gmail.com", "mali2416");
            int i = 0;
            Iterator<InvitationCode> iterator = codes.iterator();
            while(iterator.hasNext() && i < destinations.length){
                sender.send(destinations[i], "Welcome to VideoAnalytica Demo. You Are Invited!", content + iterator.next().getCode() + "\n\nThank you very much!\n\n Best,\n\nVideoAnalytica");
                ++i;
            }
            session.removeAttribute("codes");
            model.addAttribute("errorMessage", "All invitation codes are sent successfully.");
            return "icm";

        }catch(Exception e){
            model.addAttribute("errorMessage", "System error. Please try again later.");
            return "icm";
        }

    }
}