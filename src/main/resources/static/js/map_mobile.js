
var myCoordinate;
var map;
var users = [];
var polylines = []
var markers = [];
var liveMarkers = [];
var colorSet = ["#FF0000", "#0000FF", "#FFFF00", "#00FF00", "#FF8000", "#FF00FF"];	// Red, Blue, Yellow, Green, Orange, Purple.
var center;
var zoom;
var tripInfoWindow = new google.maps.InfoWindow({
    content: 'An InfoWindow'
});
var xmlHttpsGetRoute = [];
var xmlHttpsGetRecordedVideo = [];
var xmlHttpsGetTrips = [];
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
        || string[right] >= 'A' && string[right] <= 'z'
        || string[right] == '_' || string[right] == '-'){
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
                strokeWeight: 4,
                map: map
            })
        );

    }
}

function getRoute(){
    for(var k = 0; k < users.length; ++k){
        (function(k){
            var url = "GetRoute/" + getUserName(k) + "/" + getTripId(k);
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
                    google.maps.event.addListener(this.polyline, 'mouseover', function(event){
                        tripInfoWindow.setContent(users[k]);
                        tripInfoWindow.setPosition(event.latLng);
                        tripInfoWindow.open(map);
                    });
                    google.maps.event.addListener(this.polyline, 'mouseout', function(event){
                        tripInfoWindow.close();
                    });
                    if (center == null) {
                        map.fitBounds(bounds);
                    } else {
                        map.setCenter(center);
                        map.setZoom(zoom);
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
                            zIndex: 1,
                            opacity: 0.3,
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
                            zIndex: 1,
                            title: "Live Video for " + users[k]
                        });
                        if(liveMarkers[k] != null){
                            liveMarkers[k].setMap(null);
                        }
                        liveMarkers[k] = marker;
                        google.maps.event.addListener(marker, 'click', (function(k){
                            return function() {
                                if(iframes.indexOf(getUserName(k)) == -1) {
                                    var left = "" + (340 + Math.random() * 300);
                                    var top = "" + (Math.random() * 300);
                                    document.getElementById("iframes").innerHTML += "<iframe id='" + getUserName(k) + "' name='" + getUserName(k) + "' width='300' height='250' style='position:absolute;left:" + left + "px;top:" + top + "px' src='/test/test.html?userId=" + getUserName(k) + "'></iframe>";
                                    iframes.push(getUserName(k));
                                }else{
                                    $("#" + getUserName(k)).remove();
                                    iframes.splice(iframes.indexOf(getUserName(k)), 1);
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
            var url = "GetRecordedVideos/" + getUserName(k) + "/" + getTripId(k);
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
                        var title = "" + users[k] + "-" + videos[i].recordFile;

                        var marker = new google.maps.Marker({
                            map: map,
                            position: coordinate,
                            icon: icon,
                            id: title,
                            zIndex: 2
                        });
                        marker.setTitle(title);
                        geocodeLatLng(coordinate, marker);
                        if(markers[k] != null && markers[k][i] != null){
                            markers[k][i].setMap(null);
                        }else if(markers[k] == null){
                            markers[k] = [];
                        }
                        markers[k][i] = marker;
                        google.maps.event.addListener(marker, 'click', (function(title, videoSrc){
                            return function() {
                                if(recordIframe.indexOf(title) == -1) {
                                    var left = 15;
                                    var top = 0;
                                    document.getElementById("iframes").innerHTML +=
                                        "<div data-role='popup' id='popupVideo' data-overlay-theme='b' data-theme='a' data-tolerance='15,15' class='ui-content'>" +
                                        "<iframe class='iframes' id='" + title + "' name='" + title + "' width='300' height='250' style='position:absolute;left:" + left + "px;top:" + top + "px' src='/test/record.html?src=" + title + "' type='video/mp4'></iframe>" +
                                        "</div>";
                                    recordIframe.push(title);
                                }else{
                                    $("#" + title).remove();
                                    recordIframe.splice(recordIframe.indexOf(title), 1);
                                }
                            }
                        })(title, videoSrc));
                        google.maps.event.addListener(marker, 'mouseover', (function(title){
                            return function(){
                                $("#" + title).css({"border-width": "10px", "border-color": "#19f6e8", "border-style": "solid"});
                            }

                        })(title));
                        google.maps.event.addListener(marker, 'mouseout', (function(title){
                            return function(){
                                $("#" + title).css({"border-width": "1px", "border-color": "gray"});
                            }

                        })(title));
                    }
                }
            }
            xmlHttpsGetRecordedVideo[k].open("GET", url, true);
            xmlHttpsGetRecordedVideo[k].send();
        })(k);
    }
}

function geocodeLatLng(coordinate, marker) {
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': coordinate}, function (results, status) {
        if (status === 'OK') {
            if (results[1]) {
                marker.setTitle(results[0].address_components[0].short_name + results[0].address_components[1].short_name);
                //marker.title = results[0].address_components[0].short_name + results[0].address_components[1].short_name;
                return results[0].address_components[0].short_name + results[0].address_components[1].short_name;
            } else {
                return "";
            }
        } else {
            return "";
        }
    });
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

function setIframeHead(id){
    var marker = markers[0][0];
    for(var i = 0; i < markers.length; ++i){
        var find = false;
        for(var j = 0; j < markers[i].length; ++j){
            if(markers[i][j].id == id){
                marker = markers[i][j];
                find = true;
                break;
            }
        }
        if(find == true){
            break;
        }
    }
    return marker.title;
}

function closeIframe(title){
    document.getElementById(title).remove();
    recordIframe.splice(recordIframe.indexOf(title), 1);
    iframes.splice(iframes.indexOf(title), 1);
}

function findIcon(id){
    var marker = markers[0][0];
    for(var i = 0; i < markers.length; ++i){
        var find = false;
        for(var j = 0; j < markers[i].length; ++j){
            if(markers[i][j].id == id){
                marker = markers[i][j];
                find = true;
                break;
            }
        }
        if(find == true){
            break;
        }
    }
    var infowindow = new google.maps.InfoWindow({
        content: marker.title
    });
    infowindow.open(map, marker);
    map.setCenter(marker.getPosition());
    setTimeout(function () { infowindow.close(); }, 5000);
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
    var url = "GetUserIdsAndMostRecentTripIds";
    var xmlHttps = new XMLHttpRequest();
    xmlHttps.onreadystatechange = function() {
        if (xmlHttps.readyState == 4 && xmlHttps.status == 200) {
            var usersList = JSON.parse(xmlHttps.responseText);
            for (var i = 0; i < usersList.length; ++i) {
                var id = usersList[i];
                // Read usersList from JSON file.
                if(users.indexOf(id) == -1){
                    document.getElementById("usersList").innerHTML +=
                        "<li class='list-group-item' style='color:black;background-color: #e3f2fd' id='l" + id + "'><div class='list-first'  id='" + id + "'>" + id
                        + "<div class='btn-group pull-right'> <button type='button' style='width:35px' class='btn btn-default btn-xs switcher' id='b"
                        + id + "'>OFF</button> </div></div> </li>";
                }else{
                    document.getElementById("usersList").innerHTML +=
                        "<li class='list-group-item' id='l" + id + "'><div class='list-first' id='" + id + "' style='color:" + colorSet[users.indexOf(id)] + "'>" + id
                        + "<div class='btn-group pull-right'> <button type='button' style='width:35px' class='btn btn-success btn-xs switcher' id='b"
                        + id + "'> ON </button> </div></div> </li>";
                }
                // Set up the sublist of a user.
                document.getElementById("l" + id).innerHTML += "<ul id='ll" + id + "' style='display:none;margin-top:4px'></ul>";
                var index = 0;
                while(id[index] != "-"){
                    ++index;
                }
                var userName = id.substring(0, index);
                (function(userName, listId, i) {
                    var urlGetTrips = "GetAllTripIds/" + userName;
                    xmlHttpsGetTrips[i] = new XMLHttpRequest();
                    xmlHttpsGetTrips[i].onreadystatechange = function() {
                        if (xmlHttpsGetTrips[i].readyState == 4 && xmlHttpsGetTrips[i].status == 200) {
                            var tripIds = JSON.parse(xmlHttpsGetTrips[i].responseText);
                            for (var j = 1; j < tripIds.length; ++j) {
                                var id = userName + "-" + tripIds[j];
                                if (users.indexOf(id) == -1) {
                                    document.getElementById(listId).innerHTML +=
                                        "<li style='margin-bottom: 4px' id='l" + id + "'>" + id
                                        + "<div class='btn-group pull-right'> <button type='button' style='width:35px' class='btn btn-default btn-xs switcher' id='b"
                                        + id + "'>OFF</button> </div></li>";
                                } else {
                                    document.getElementById(listId).innerHTML +=
                                        "<li style='margin-bottom: 4px' id='l" + id + "'style='color:" + colorSet[users.indexOf(id)] + "'>" + id
                                        + "<div class='btn-group pull-right'> <button type='button' style='width:35px' class='btn btn-success btn-xs switcher' id='b"
                                        + id + "'> ON </button> </div></li>";
                                }
                            }
                        }
                    };
                    xmlHttpsGetTrips[i].open("GET", urlGetTrips, true);
                    xmlHttpsGetTrips[i].send();
                }(userName, "ll" + id, i));
            }
        }
    }
    xmlHttps.open("GET", url, true);
    xmlHttps.send();
}

function getUserName(k){
    var i = 0;
    while(users[k][i] != '-'){
        ++i;
    }
    return users[k].substring(0, i);
}

function getTripId(k){
    var i = 0;
    while(users[k][i] != '-'){
        ++i;
    }
    return users[k].substring(i + 1, users[k].length);
}




$(document).ready(function(){
    $("#menu-toggle").click(function(){
        $("#menu").slideToggle(500);
    });
    $("#reset-map").click(function(){
        window.location.replace("//iit.videoanalytica.com/map");
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

    $(document).on("click touchstart", ".list-first", function(){
        var id = "#ll" + $(this).attr('id');
        if($(id).css("display") == "none"){
            $(id).css("display", "block");
        }else{
            $(id).css("display", "none");
        }
    });


});