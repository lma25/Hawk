package com.example.controller;

import com.example.model.HVConfig;
import com.example.repository.HVConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Collection;
import java.util.Iterator;

/**
 * Created by Li on 2016/9/28.
 */

@RestController
public class HVConfigController {
    @Autowired
    private HVConfigRepository configRepository;

    @RequestMapping(
            value = "/UpdateHVConfig",
            method = RequestMethod.POST
    )
    public String updateHVConfig(HttpSession session,
                                   @ModelAttribute("location") String location,
                                   @ModelAttribute("src") String src
    ){
        String userName = session.getAttribute("userName").toString();
        Collection<HVConfig> result = configRepository.findByUserNameAndLocation(userName, Integer.parseInt(location));
        Iterator<HVConfig> it = result.iterator();
        if(!it.hasNext()) {
            HVConfig config = new HVConfig();
            config.setUserName(userName);
            config.setLocation(Integer.parseInt(location));
            config.setSrc(src);
            configRepository.save(config);
        }else{
            configRepository.updateConfig(userName, Integer.parseInt(location), src);
        }
        return "OK";
    }

    @RequestMapping(
            value = "/GetHVConfig/{userName}",
            method = RequestMethod.GET
    )
    public Collection<HVConfig> getHVConfig(@PathVariable("userName") String userName){
        return configRepository.findByUserName(userName);
    }

    @RequestMapping(
            value = "/GetHVConfig",
            method = RequestMethod.GET
    )
    public Collection<HVConfig> getHVConfig(HttpSession session){
        return configRepository.findByUserName(session.getAttribute("userName").toString());
    }
}
