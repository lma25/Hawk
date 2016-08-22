
var myCoordinate;
var map;
var users = [];
var polylines = [];
var markers = [];
var liveMarkers = [];
var colorSet = ["red", "blue", "yellow", "orange", "black", "#FF00FF"];	// Red, Blue, Yellow, Green, Orange, Purple.
var center;
var zoom;
var xmlHttpsGetRoute = [];
var xmlHttpsGetRecordedVideo = [];
//var infoWindow = new BMap.InfoWindow();

function initialize() {
    map = new BMap.Map("BaiduMap");          // 创建地图实例
    myCoordinate = new BMap.Point(116.404, 39.915);  // 创建点坐标
    map.centerAndZoom(myCoordinate, 15);                 // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom();

    getUsers();
    setUsersList();
    initializePolylinesAndMarkers();
//    showStreamInIframe();
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
            new BMap.Polyline(path, {strokeColor: colorSet[i], strokeWeight:6, strokeOpacity:0.6})
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
                    var path = [];
                    for (var i = 0; i < route.length; ++i) {
                        var coordinate = new BMap.Point(parseFloat(route[i].latitude), parseFloat(route[i].longitude));
                        path.push(coordinate);
                    }
                    map.removeOverlay(polylines[k]);
                    polylines[k] = new BMap.Polyline(path, {strokeColor: colorSet[i], strokeWeight:3, strokeOpacity:0.5});
                    map.addOverlay(polylines[k]);
                    if (center == null) {
                        
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
                    var opts = {
                        width : 300,     // 信息窗口宽度
                        height: 250,     // 信息窗口高度
                        title : "直播视频:" , // 信息窗口标题
                        enableMessage:true//设置允许信息窗发送短息
                    };
                    var coordinate = new BMap.Point(parseFloat(route[route.length - 1].latitude), parseFloat(route[route.length - 1].longitude));
                    var lastUpdateTime = new Date(parseFloat(route[route.length - 1].recordTime));
                    var now = new Date();
                    if(now - lastUpdateTime > 60000){
                        // Set the live video inactive icon.
                        var icon = new BMap.Icon("images/live_inactive.png", new BMap.Size(30, 30));
                        icon.setImageSize(new BMap.Size(30, 30));
                        var marker = new BMap.Marker(coordinate);
                        marker.setIcon(icon);
                        marker.setLabel("No live Video for " + users[k]);

                        map.removeOverlay(liveMarkers[k]);
                        liveMarkers[k] = marker;
                        map.addOverlay(liveMarkers[k]);
                    }else{
                        // Set the live video active icon.
                        var icon = new BMap.Icon("images/live_active.png", new BMap.Size(30, 30));
                        icon.setImageSize(new BMap.Size(30, 30));
                        var marker = new BMap.Marker(coordinate, icon);
                        marker.setLabel("Live Video for " + users[k]);
                        map.removeOverlay(liveMarkers[k]);
                        liveMarkers[k] = marker;
                        map.addOverlay(liveMarkers[k]);
                        marker.addEventListener("click",function(e) {
                            var content = "<iframe width='300' height='250' src='" + src + "'></iframe>";
                            infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                            map.openInfoWindow(infoWindow, coordinate); //开启信息窗口
                        });
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
                        var coordinate = new BMap.Point(parseFloat(videos[i].latitude), parseFloat(videos[i].longitude));
                        var icon = new BMap.Icon("images/" + videos[i].icon, new BMap.Size(30, 30));
                        icon.setImageSize(new BMap.Size(30, 30));
                        var videoSrc = "videos/" + users[k] + "/" + videos[i].video + ".mp4";

                        var marker = new BMap.Marker(coordinate);
                        marker.setIcon(icon);

                        if(markers[k] == null){
                            markers[k] = [];
                        }
                        map.removeOverlay(markers[k][i]);
                        markers[k][i] = marker;
                        map.addOverlay(markers[k][i]);

                        var opts = {
                            width : 300,     // 信息窗口宽度
                            height: 250,     // 信息窗口高度
                            title : "历史视频:" , // 信息窗口标题
                            enableMessage:true//设置允许信息窗发送短息
                        };

                        markers[k][i].addEventListener("click",function(e) {
                            var content = "<iframe width='300' height='250' src='" + videoSrc + "'></iframe>";
                            infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                            map.openInfoWindow(infoWindow, coordinate); //开启信息窗口
                        });

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
    //if(isInfoWindowOpen() == false){
        center = map.getCenter();
        zoom = map.getZoom();

        getRoute();
        getRecordedVideos();
    //}
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
        var pre = getPreAddress();
        var src = pre + "live/streamingtest.html";
        if(users[k] == 8555){
            src = pre + "live/streamingtest1.html";
        }else if(users[k] == "ericsson"){
            src = pre + "live/streamingtest2.html";
        }
        document.getElementById("content").innerHTML += "<iframe id='" + users[i] + "' name='" + users[i] + "' width='300' height='250' style='position:absolute;left:" + left + "px' src='" + "iframe1.html" +"'></iframe>";
        left += 300;
    }
}

initialize();


setInterval(function() { updateMap();}, 5000);

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