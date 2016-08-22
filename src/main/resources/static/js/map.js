
var myCoordinate;
var map;
var users = [];
var polylines = []
var markers = [];
var liveMarkers = [];
var colorSet = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00", "#FF8000", "#FF00FF"];	// Red, Blue, Yellow, Green, Orange, Purple.
var center;
var zoom;
var xmlHttpsGetRoute = [];
var xmlHttpsGetRecordedVideo = [];
var infoWindow = new google.maps.InfoWindow();
var iframes = [];
var recordIframe = [];

function initialize() {
    myCoordinate = {lat: 42.0840891, lng: -87.98112345};
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            function(position){
                myCoordinate = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                map.setCenter(myCoordinate);
            }
        );
    }
    map = new google.maps.Map(document.getElementById("googleMap"), {
        center: myCoordinate,
        zoom: 13,
        mapTypeControl: false,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    });
    getUsers();
    setUsersList();
    initializePolylinesAndMarkers();
    //showStreamInIframe();
    getRoute();
    getRecordedVideos();

}
function getUsers(){
    var string = window.location.search;
    var left = 0;
    for(; left < string.length; ++left){
        if(string[left] == '='){
            ++left;
            break;
        }
    }
    var right = left;
    while(right < string.length){
        if(string[right] >= '0' && string[right] <= '9'
        || string[right] >= 'A' && string[right] <= 'z'){
            ++right;
        }else if(left < right){
            users.push(string.substring(left, right));
            ++right;
            left = right;
        }else{
            ++right;
            ++left;
        }
    }
    if(left < right){
        users.push(string.substring(left, right));
    }

}

function initializePolylinesAndMarkers(){
    for(var i = 0; i < users.length; ++i){
        var path = [];
        polylines.push(
            new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: colorSet[i],
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            })
        );
    }
}

function getRoute(){
    for(var k = 0; k < users.length; ++k){
        (function(k){
            var url = "GetRoute/" + users[k];
            xmlHttpsGetRoute[k] = new XMLHttpRequest();
            xmlHttpsGetRoute[k].polyline = polylines[k];
            xmlHttpsGetRoute[k].onreadystatechange = function() {
                if (xmlHttpsGetRoute[k].readyState == 4 && xmlHttpsGetRoute[k].status == 200) {
                    var route = JSON.parse(xmlHttpsGetRoute[k].responseText);
                    var bounds = new google.maps.LatLngBounds();
                    var path = [];
                    for (var i = 0; i < route.length; ++i) {
                        var coordinate = new google.maps.LatLng(parseFloat(route[i].latitude), parseFloat(route[i].longitude));
                        bounds.extend(coordinate);
                        path.push(coordinate);
                    }
                    this.polyline.setPath(path);
                    if (center == null) {
                        map.fitBounds(bounds);
                    } else {
                        map.setCenter(center);
                        map.setZoom(zoom);
                    }

                    // Set up live video.
                    var pre = getPreAddress();
                    var src = pre + "live/streamingtest.html";
                    if(users[k] == 8555){
                        src = pre + "live/streamingtest1.html";
                    }else if(users[k] == "ericsson"){
                        src = pre + "live/streamingtest2.html";
                    }
                    var coordinate = new google.maps.LatLng(parseFloat(route[route.length - 1].latitude), parseFloat(route[route.length - 1].longitude));
                    var lastUpdateTime = new Date(parseFloat(route[route.length - 1].recordTime));
                    var now = new Date();
                    if(now - lastUpdateTime > 60000){
                        // Set the live video inactive icon.
                        var icon = {
                            url: "images/live_inactive.png",
                            scaledSize: new google.maps.Size(30, 30), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };
                        var marker = new google.maps.Marker({
                            map: map,
                            position: coordinate,
                            icon: icon,
                            title: "No Live Video for " + users[k]
                        });
                        if(liveMarkers[k] != null){
                            liveMarkers[k].setMap(null);
                        }
                        liveMarkers[k] = marker;
                    }else{
                        // Set the live video active icon.
                        var icon = {
                            url: "images/live_active.png",
                            scaledSize: new google.maps.Size(30, 30), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };
                        var marker = new google.maps.Marker({
                            map: map,
                            position: coordinate,
                            icon: icon,
                            title: "Live Video for " + users[k]
                        });
                        if(liveMarkers[k] != null){
                            liveMarkers[k].setMap(null);
                        }
                        liveMarkers[k] = marker;
                        google.maps.event.addListener(marker, 'click', (function(k){
                            return function() {
                                if(iframes.indexOf(users[k]) == -1) {
                                    var left = "" + (340 + Math.random() * 300);
                                    var top = "" + (Math.random() * 300);
                                    document.getElementById("iframes").innerHTML += "<iframe id='" + users[k] + "' name='" + users[k] + "' width='300' height='250' style='position:absolute;left:" + left + "px;top:" + top + "px' src='/test/test.html?userId=" + users[k] + "'></iframe>";
                                    iframes.push(users[k]);
                                }else{
                                    $("#" + users[k]).remove();
                                    iframes.splice(iframes.indexOf(users[k]), 1);
                                }
                            }
                        })(k));
                    }
                }
            }
            xmlHttpsGetRoute[k].open("GET", url, true);
            xmlHttpsGetRoute[k].send();
        })(k);
    }
}

function getRecordedVideos(){
    for(var k = 0; k < users.length; ++k){
        (function(k){
            var url = "GetRecordedVideos/" + users[k];
            xmlHttpsGetRecordedVideo[k] = new XMLHttpRequest();
            xmlHttpsGetRecordedVideo[k].onreadystatechange = function() {
                if (xmlHttpsGetRecordedVideo[k].readyState == 4 && xmlHttpsGetRecordedVideo[k].status == 200) {
                    var videos = JSON.parse(xmlHttpsGetRecordedVideo[k].responseText);
                    for (var i = 0; i < videos.length; ++i) {
                        var lat = parseFloat(videos[i].latitude);
                        var lon = parseFloat(videos[i].longitude);
                        var coordinate = new google.maps.LatLng(parseFloat(videos[i].latitude), parseFloat(videos[i].longitude));
                        var icon = {
                            url: "images/" + videos[i].iconFile,
                            scaledSize: new google.maps.Size(30, 30), // scaled size
                            origin: new google.maps.Point(0, 0), // origin
                            anchor: new google.maps.Point(0, 0) // anchor
                        };
                        var videoSrc = "http://192.41.245.236/videos/" + users[k] + "/" + videos[i].recordFile + ".mp4";
                        var title = "" + users[k] + "_" + videos[i].recordFile;
                        var marker = new google.maps.Marker({
                            map: map,
                            position: coordinate,
                            icon: icon,
                            title: videoSrc
                        });
                        if(markers[k] != null && markers[k][i] != null){
                            markers[k][i].setMap(null);
                        }else if(markers[k] == null){
                            markers[k] = [];
                        }
                        markers[k][i] = marker;
                        google.maps.event.addListener(marker, 'click', (function(title, videoSrc){
                            return function() {
                                if(recordIframe.indexOf(title) == -1) {
                                    var left = "" + (340 + Math.random() * 300);
                                    var top = "" + (Math.random() * 300);
                                    document.getElementById("iframes").innerHTML += "<iframe id='" + title + "' name='" + title + "' width='300' height='250' style='position:absolute;left:" + left + "px;top:" + top + "px' src='/test/record.html?src=" + title + "'></iframe>";
                                    recordIframe.push(title);
                                }else{
                                    $("#" + title).remove();
                                    recordIframe.splice(recordIframe.indexOf(title), 1);
                                }
                            }
                        })(title, videoSrc));
                    }
                }
            }
            xmlHttpsGetRecordedVideo[k].open("GET", url, true);
            xmlHttpsGetRecordedVideo[k].send();
        })(k);
    }
}

function getPreAddress(){
    var string = window.location.toString();
    var i = 0;
    var count = 0;
    while(count < 3 && i < string.length){
        if(string[i] == '/') {
            ++count;
        }
        ++i;
    }
    var pre = string.substring(0, i);
    return pre;
}

function isInfoWindowOpen(){
    return infoWindow.getMap() != null;
}

function updateMap(){
    if(isInfoWindowOpen() == false){
        center = map.getCenter();
        zoom = map.getZoom();
        getRoute();
        getRecordedVideos();
    }
    for(var k = 0; k < users.length; ++k){
        (function(k){
            var url = "UpdateVideos/" + users[k];
            var xmlHttpsUpdateVideos = new XMLHttpRequest();
            xmlHttpsUpdateVideos.open("GET", url, true);
            xmlHttpsUpdateVideos.send();
        })(k);
    }
}

function setupStream(){
    if(users.length >= 1){
        document.getElementById("stream").innerHTML += "<h3>userId = "+ users[0] +"</h3>";
        document.getElementById("stream").innerHTML += "<iframe style='float:left;width:100%;height:35%;border-style: none;' src='http://192.41.245.236/live/streamingtest.html'></iframe>";
        document.getElementById("stream").innerHTML += "<p>-</p>";
    }
    if(users.length >= 2){
        document.getElementById("stream").innerHTML += "<h3>userId = "+ users[1] +"</h3>";
        document.getElementById("stream").innerHTML += "<iframe style='float:left;width:100%;height:35%;border-style: none;' src='http://192.41.245.236/live/streamingtest1.html'></iframe>";
    }
}

function showStreamInIframe(){
    var left = 340;
    for(var i = 0; i < users.length; ++i){
        document.getElementById("iframes").innerHTML += "<iframe id='" + users[i] + "' name='" + users[i] + "' width='300' height='250' style='position:absolute;left:" + left + "px' src='/test/test.html?userId=" + users[i] +"'></iframe>";
        left += 300;
    }
}

function closeIframe(userName){
    document.getElementById(userName).innerHTML = "";
}
function closeIframe(){
    document.getElementById("9555").innerHTML = "";
}

google.maps.event.addDomListener(window, 'load', initialize);


setInterval(function() { updateMap();}, 20000);

function appendUserIdToUrl(userId){
    var url = window.location.toString();
    if(url.indexOf("userId") == -1){
        url = url + "?userId=" + userId;
    }else{
        url = url + "+" + userId;
    }
    window.location = url;
}

function removeUserIdFromUrl(userId){
    var url = window.location.toString();
    if(users.length == 0){
        return;
    }else if(users.length == 1 && users[0] == userId){
        url = url.slice(0, url.indexOf("?"));
    }else{
        for(var i = 0; i < users.length; ++i){
            if(users[i] == userId){
                if(i == 0){
                    url = url.slice(0, url.indexOf(userId, url.indexOf("?userId"))) + url.slice(url.indexOf(userId, url.indexOf("?userId")) + userId.toString().length + 1, url.length);
                }else{
                    url = url.slice(0, url.indexOf(userId, url.indexOf("?userId")) - 1) + url.slice(url.indexOf(userId, url.indexOf("?userId")) + userId.toString().length + 1, url.length);
                }
                break;
            }
        }
    }
    window.location = url;
}

function setUsersList(){
    var url = "GetUserIds";
    var xmlHttps = new XMLHttpRequest();
    xmlHttps.onreadystatechange = function() {
        if (xmlHttps.readyState == 4 && xmlHttps.status == 200) {
            var usersList = JSON.parse(xmlHttps.responseText);
            for (var i = 0; i < usersList.length; ++i) {
                var id = usersList[i];
                // Read usersList from JSON file.
                if(users.indexOf(id) == -1){
                    document.getElementById("usersList").innerHTML += "<li class='list-group-item' style='color:black' id='l" + id + "'>" + id
                        + "<div class='btn-group pull-right'> <button type='button' class='btn btn-default btn-xs switcher' id='b"
                        + id + "'>OFF</button> </div> </li>";
                }else{
                    document.getElementById("usersList").innerHTML += "<li class='list-group-item' style='color:" + colorSet[users.indexOf(id)] + "' id='l" + id + "'>" + id
                        + "<div class='btn-group pull-right'> <button type='button' class='btn btn-success btn-xs switcher' id='b"
                        + id + "'>ON</button> </div> </li>";
                }
            }
        }
    }
    xmlHttps.open("GET", url, true);
    xmlHttps.send();
}


$(document).ready(function(){
    $("#menu-toggle").click(function(){
        $("#menu").toggle(500);
    });
    $(document).on("click", ".switcher", function(){
        var id = this.id.toString().slice(1);
        var buttonId = "#b" + id;
        if($(buttonId).html() == "OFF"){
            $(buttonId).html("ON");
            $(buttonId).removeClass("btn-default");
            $(buttonId).addClass("btn-success");
            appendUserIdToUrl(id);
        }else{
            $(buttonId).html("OFF");
            $(buttonId).removeClass("btn-success");
            $(buttonId).addClass("btn-default");
            removeUserIdFromUrl(id);
        }
    });
});