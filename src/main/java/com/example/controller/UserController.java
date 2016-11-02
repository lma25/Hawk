package com.example.controller;

import com.example.model.User;
import com.example.repository.TripRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.LinkedList;

/**
 * Created by Li on 2016/6/8.
 */

@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @RequestMapping("/getUsers")
    public Collection<User> getUsers(){
        return this.userRepository.findAll();
    }

    @RequestMapping("/getUser/{userId}")
    public User getUser(@PathVariable String userId){
        return this.userRepository.findByUserId(userId);
    }

    @RequestMapping("/getUserPort/{userName}")
    public String getUserPort(@PathVariable String userName){
        return Integer.toString(this.userRepository.findByUserName(userName).getPort());
    }

    @RequestMapping("/GetUserIds")
    public Collection<String> getUserIds(){
        Collection<String> userIds = new LinkedList<>();
        Collection<User> users = this.userRepository.findAll();
        for(User u : users){
            userIds.add(u.getUserName());
        }
        return userIds;
    }

    @RequestMapping("/GetUserIdsAndMostRecentTripIds")
    public Collection<String> getUserIdsAndMostRecentTripIds(){
        Collection<String> userIds = new LinkedList<>();
        Collection<User> users = this.userRepository.findAll();
        for(User u : users){
            String temp = u.getUserName() + "-";
            String tripId = tripRepository.findMostRecentTripId(u.getUserName());
            if(tripId == null){
                temp = temp + "0";
            }else{
                temp = temp + tripId;
            }
            userIds.add(temp);
        }
        return userIds;
    }

    @RequestMapping(
            value = "/GetUserNameByActivity",
            method = RequestMethod.GET
    )
    public Collection<String> getUserNameByActivity(){
        return tripRepository.find15MostActivityUserName();
    }

}
