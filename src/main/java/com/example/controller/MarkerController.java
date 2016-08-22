package com.example.controller;

import com.example.model.Marker;
import com.example.model.Trip;
import com.example.repository.MarkerRepository;
import com.example.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedList;

/**
 * Created by Li on 2016/6/20.
 */

@RestController
public class MarkerController {
    @Autowired
    private MarkerRepository markerRepository;

    @Autowired
    private TripRepository tripRepository;

    @RequestMapping(
            value = "/GetRecordedVideos/{userName}/{tripId}"
    )
    public Collection<Marker> getRecordedVideos(@PathVariable("userName") String userName, @PathVariable("tripId") Integer tripId){
        return getRecordedVideosHelper(userName, tripId);
    }

    @RequestMapping(
            value = "/GetRecordedVideos/{userName}"
    )
    public Collection<Marker> getRecordedVideos(@PathVariable String userName){
        int tripId = 1;
        return getRecordedVideosHelper(userName, tripId);
    }

    public Collection<Marker> getRecordedVideosHelper(String userName, Integer tripId){
        Collection<Marker> temp = markerRepository.findByUserNameAndTripIdOrderByRecordTimeDesc(userName, tripId);
        LinkedList<Marker> result = new LinkedList<>();
        Iterator<Marker> it = temp.iterator();
        int count = 10;
        while(it.hasNext() && count > 0){
            --count;
            result.offerFirst(it.next());
        }
        return result;
    }

    @RequestMapping(
            value = "/UpdateVideos/{userName}/{tripId}"
    )
    public void updateVideos(@PathVariable("userName") String userName, @PathVariable("tripId") Integer tripId){
        updateVideosHelper(userName, tripId);
    }

    @RequestMapping(
            value = "/UpdateVideos/{userName}"
    )
    public void updateVideos(@PathVariable String userName){
        int tripId = 1;
        updateVideosHelper(userName, tripId);
    }

    public void updateVideosHelper(String userName, Integer tripId){
        Collection<Marker> temp = markerRepository.findByUserNameAndTripIdOrderByRecordTimeDesc(userName, tripId);
        Iterator<Marker> i = temp.iterator();
        int index = 0;
        //Path initialPath = Paths.get("C:\\test\\" + Integer.toString(index) + ".mp4");
        Path initialPath = Paths.get("/var/lib/tomcat8/webapps/videos/" + userName + "/" + Integer.toString(tripId) + "/" + Integer.toString(index) + ".mp4");
        if(i.hasNext()){
            index = i.next().getRecordFile() + 1;
            //initialPath = Paths.get("C:\\test\\" + Integer.toString(index - 1) + ".mp4");
            initialPath = Paths.get("/var/lib/tomcat8/webapps/videos/" + userName + "/" + Integer.toString(tripId) + "/" + Integer.toString(index - 1) + ".mp4");
        }
        BasicFileAttributes initialAttribute = null;
        try {
            initialAttribute = Files.readAttributes(initialPath, BasicFileAttributes.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Long prevTime = initialAttribute.creationTime().toMillis();
        while(true){
            //Path path = Paths.get("C:\\test\\" + Integer.toString(index) + ".mp4");
            Path path = Paths.get("/var/lib/tomcat8/webapps/videos/" + userName + "/" + Integer.toString(tripId) + "/" + Integer.toString(index) + ".mp4");
            BasicFileAttributes attribute = null;
            try {
                attribute = Files.readAttributes(path, BasicFileAttributes.class);
            } catch (IOException e) {
                e.printStackTrace();
            }
            Long creationTime = attribute.creationTime().toMillis();
            if(creationTime - prevTime > 180000){
                return;
            }
            //Collection<Trip> trips = tripRepository.findByUserName(userName);
            Collection<Trip> trips = tripRepository.findByTime(userName, tripId, new Date(creationTime));
            Iterator<Trip> it = trips.iterator();
            Marker marker = new Marker();
            marker.setUserName(userName);
            marker.setTripId(tripId);
            marker.setRecordFile(index);
            marker.setIconFile(userName.hashCode() % 2 == 1 ? "1.png" : "2.png");
            marker.setRecordTime(new Date(creationTime));
            if(it.hasNext()){
                Trip trip = it.next();
                marker.setLongitude(trip.getLongitude());
                marker.setLatitude(trip.getLatitude());
                System.out.println((new Date()).getTime() - creationTime);
                if((new Date()).getTime() - creationTime > 10000){
                    markerRepository.save(marker);
                }
            }
            ++index;
            prevTime = creationTime;
        }
    }

    @RequestMapping(
            value = "/ClearMarkers/{userName}"
    )
    public void clearMarkers(@PathVariable String userName){
        markerRepository.deleteByUserName(userName);
    }

    @RequestMapping(
            value = "/test"
    )
    public void test(){
        markerRepository.updateAfterInsert("Jaten", 1);
        markerRepository.delete11();
    }
    /*public static void main(String[] args) throws Exception{
        long time = new Date().getTime();
        Path initialPath = Paths.get("C:\\test\\" + Integer.toString(0) + ".mp4");
        BasicFileAttributes attribute = Files.readAttributes(initialPath, BasicFileAttributes.class);
        System.out.println(time);
        System.out.println(attribute.creationTime().toMillis());
        System.out.println(time - attribute.creationTime().toMillis());
    }*/
}
