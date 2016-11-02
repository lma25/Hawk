package com.example.controller;

import com.example.model.Trip;
import com.example.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Date;

/**
 * Created by Li on 2016/6/10.
 */

@RestController
public class TripController {
    @Autowired
    private TripRepository tripRepository;



    @RequestMapping(
            value = "/ReportCoordinate",
            method = RequestMethod.POST
    )
    // To do list:
    // 1. after test, change "userId" to "userName".
    // 2. Add code to deal with "tripId".
    public String reportCoordinate(@ModelAttribute("userId") String userId,
                                   @ModelAttribute("recordTime") String recordTime,
                                   @ModelAttribute("latitude") String latitude,
                                   @ModelAttribute("longitude") String longitude,
                                   @ModelAttribute("altitude") String altitude,
                                   @ModelAttribute("tripId") String tripId
    ){
        Trip trip = new Trip();
        trip.setTripId(tripId);
        trip.setUserName(userId);
        trip.setRecordTime(new Date());
        trip.setAltitude(altitude);
        trip.setLatitude(latitude);
        trip.setLongitude(longitude);
        tripRepository.save(trip);
        return "OK";
    }

    @RequestMapping(
            value = "/GetRoute/{userName}",
            method = RequestMethod.GET
    )
    // To do list:
    // 1. Add code to deal with "tripId".
    public Collection<Trip> getRoute(@PathVariable String userName){
        String tripId = tripRepository.findMostRecentTripId(userName);
        return tripRepository.findByUserNameAndTripId(userName,tripId);
    }

    @RequestMapping(
            value = "/GetRoute/{userName}/{tripId}",
            method = RequestMethod.GET
    )
    // To do list:
    // 1. Add code to deal with "tripId".
    public Collection<Trip> getRoute(@PathVariable("userName") String userName, @PathVariable("tripId") String tripId){
        return tripRepository.findByUserNameAndTripId(userName,tripId);
    }

    @RequestMapping(
            value = "/ClearTrip/{userName}",
            method = RequestMethod.GET
    )
    public void clearTrip(@PathVariable String userName){
        tripRepository.deleteByUserName(userName);
    }

    @RequestMapping(
            value = "/GetAllTripIds/{userName}",
            method = RequestMethod.GET
    )
    public Collection<String> getAllTripIds(@PathVariable String userName){
        return tripRepository.find5MostRecentTripId(userName);
    }

}
