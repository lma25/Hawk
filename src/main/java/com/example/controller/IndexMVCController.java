package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Li on 2016/6/9.
 */

@Controller
public class IndexMVCController {
    @RequestMapping(
            value = {"/", "/index"}
    )
    public String index(Model model){
        return "index";
    }

}
