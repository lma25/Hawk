package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;

/**
 * Created by Li on 2016/6/10.
 */

@Controller
public class DemoMVCController {

    @RequestMapping(
            value = "/map"
    )
    public String map(HttpSession session){
        if(session.getAttribute("userName") == null){
            return "redirect:signin";
        }else{
            return "map";
        }
        //return "map";
    }

    @RequestMapping(
            value = "/iframe/{title}",
            method = RequestMethod.GET
    )
    public String iframe(@PathVariable String title, Model model){
        int index = title.length() - 1;
        while(index >= 0 && title.charAt(index) != '_'){
            --index;
        }
        model.addAttribute("src", "/videos/" + title.substring(0, index) + "/" + title.substring(index + 1, title.length()) + ".mp4");
        return "iframe";
    }

    @RequestMapping(
            value = "/reportCoordinate"
    )
    public String reportCoordinate(){
        return "reportcoordinate";
    }

    @RequestMapping(
            value = "/bmap",
            method = RequestMethod.GET
    )
    public String bmap(){
        return "bmap";
    }
}