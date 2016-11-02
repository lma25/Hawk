package com.example.controller;

import com.example.model.LogFile;
import com.example.model.Marker;
import com.example.model.Trip;
import com.example.repository.MarkerRepository;
import com.example.repository.TripRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
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
    public Collection<Marker> getRecordedVideos(@PathVariable("userName") String userName, @PathVariable("tripId") String tripId){
        return getRecordedVideosHelper(userName, tripId);
    }

    @RequestMapping(
            value = "/GetRecordedVideos/{userName}"
    )
    public Collection<Marker> getRecordedVideos(@PathVariable String userName){
        String tripId = tripRepository.findMostRecentTripId(userName);
        if(tripId == null){
            tripId = "0";
        }
        return getRecordedVideosHelper(userName, tripId);
    }

    public Collection<Marker> getRecordedVideosHelper(String userName, String tripId){
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
            value = "/UpdateVideos",
            method = RequestMethod.POST
    )
    public void updateVideos(@ModelAttribute("path") String path){
        LogFile.write("Path: " + path);
        // parse path:
        String[] args = new String[3];
        parsePath(path, args);
        String userName = args[0];
        String tripId = args[1];
        String fileName = args[2];
        LogFile.write("userName: " + userName);
        LogFile.write("tripId: " + tripId);
        LogFile.write("fileName: " + fileName);

        BasicFileAttributes initialAttribute = null;
        try {
            initialAttribute = Files.readAttributes(Paths.get(path), BasicFileAttributes.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        Long creationTime = initialAttribute.creationTime().toMillis();
        LogFile.write("creationTime: " + creationTime.toString());
        LogFile.write("creationTime: " + new Date(creationTime).toString());
        Collection<Trip> trips = tripRepository.findByTime(userName, tripId, new Date(creationTime));
        Iterator<Trip> it = trips.iterator();
        Marker marker = new Marker();
        marker.setUserName(userName);
        marker.setTripId(tripId);
        marker.setRecordFile(Integer.parseInt(fileName));
        marker.setIconFile(userName.hashCode() % 2 == 1 ? "1.png" : "2.png");
        marker.setRecordTime(new Date(creationTime));
        if(it.hasNext()){
            Trip trip = it.next();
            marker.setLongitude(trip.getLongitude());
            marker.setLatitude(trip.getLatitude());
            LogFile.write("Longitude: " + trip.getLongitude());
            LogFile.write("Latitude: " + trip.getLatitude());
        }
        LogFile.write("markerLongitude: " + marker.getLongitude());
        markerRepository.save(marker);
    }

    // args = {userName, tripId, fileName};
    public void parsePath(String path, String[] args){
        int right = path.length() - 1;
        int left = right;
        int i = 2;
        while(i >= 0 && left >= 0){
            if(path.charAt(left) != '/'){
                --left;
            }else{
                args[i--] = path.substring(left + 1, right + 1);
                --left;
                right = left;
            }
        }
        i = 0;
        while(i < args[2].length() && args[2].charAt(i) != '.'){
            ++i;
        }
        args[2] = args[2].substring(0, i);
    }

    /*@RequestMapping(
            value = "/UpdateVideos/{userName}/{tripId}"
    )
    public void updateVideos(@PathVariable("userName") String userName, @PathVariable("tripId") String tripId){
        updateVideosHelper(userName, tripId);
    }*/

    /*@RequestMapping(
            value = "/UpdateVideos/{userName}"
    )
    public void updateVideos(@PathVariable String userName){
        String tripId = tripRepository.findMostRecentTripId(userName);
        if(tripId == null){
            tripId = "0";
        }
        updateVideosHelper(userName, tripId);
    }*/

    public void updateVideosHelper(String userName, String tripId){
        Collection<Marker> temp = markerRepository.findByUserNameAndTripIdOrderByRecordTimeDesc(userName, tripId);
        Iterator<Marker> i = temp.iterator();
        int index = 0;
        //Path initialPath = Paths.get("C:\\test\\" + Integer.toString(index) + ".mp4");
        Path initialPath = Paths.get("/var/lib/tomcat8/webapps/videos/" + userName + "/" + tripId + "/" + Integer.toString(index) + ".mp4");
        if(i.hasNext()){
            index = i.next().getRecordFile() + 1;
            //initialPath = Paths.get("C:\\test\\" + Integer.toString(index - 1) + ".mp4");
            initialPath = Paths.get("/var/lib/tomcat8/webapps/videos/" + userName + "/" + tripId + "/" + Integer.toString(index - 1) + ".mp4");
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
            Path path = Paths.get("/var/lib/tomcat8/webapps/videos/" + userName + "/" + tripId + "/" + Integer.toString(index) + ".mp4");
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
            value = "/FindCheckCode",
            method = RequestMethod.POST
    )
    public String findCheckCode(@ModelAttribute("path") String path, HttpServletRequest request){
        String secret = "fadi123";
        String e = String.valueOf((System.currentTimeMillis()/1000)+600);
        String ip = request.getHeader("X-FORWARDED-FOR");
        if (ip == null) {
            ip = request.getRemoteAddr();
        }
        LogFile.write("client_ip : " + ip);
        LogFile.write("remote_port : " + request.getRemotePort());
        String md5 = Base64.encodeBase64URLSafeString(DigestUtils.md5(secret + e + path + ip));
        return "?st=" + md5 + "&expires=" + e;
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
        markerRepository.updateAfterInsert("Jaten", "1");
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
