/**
 * Created by Li on 2016/9/14.
 */

var usersList= [];

getUserNames();

function getUserNames(){
    var url = "GetUserNameByActivity";
    var xmlHttps = new XMLHttpRequest();
    xmlHttps.onreadystatechange = function() {
        if (xmlHttps.readyState == 4 && xmlHttps.status == 200) {
            var result = JSON.parse(xmlHttps.responseText);
            for(var i = 0; i < 15; ++i){
                if(i < result.length){
                    usersList[i] = result[i];
                }else{
                    usersList[i] = null;
                }
            }
            for(var i = 0; i < 15; ++i){
                if(usersList[i] != null){
                    document.getElementById("settingForm").innerHTML += "<input type='text' class='form-control' id='userName_" + i + "' value='" + usersList[i] + "' style='float:left;width:20%;height:32px'/>";
                }else{
                    document.getElementById("settingForm").innerHTML += "<input type='text' class='form-control' id='userName_" + i + "' style='float:left;width:20%;height:32px'/>";
                }
            }
            setupHawkView();
        }
    }
    xmlHttps.open("GET", url, true);
    xmlHttps.send();
}

function setupHawkView(){
    for(var i = 0; i < 15; ++i){
        document.getElementById("videos").innerHTML += "<div width='310px' height='255px' class='pull-left' style='max-width:310px;max-height:255px'><div align='center' class='title-area' id='title-area_" + i + "'><span class='title' id='title_" + i + "'>NULL</span><span class='open glyphicon glyphicon-resize-full' id='open_" + i + "' style='float:right;'></span></div><video id='video_" + i + "'width='290' height='210' controls autoplay src='rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov' style='margin-right: 10px; margin-top: 10px;margin-left: 10px;margin-bottom: 10px;'></video></div>";
    }
    var url = "/GetHVConfig";
    var xmlHttps = new XMLHttpRequest();
    xmlHttps.onreadystatechange = function() {
        if (xmlHttps.readyState == 4 && xmlHttps.status == 200) {
            var configs = JSON.parse(xmlHttps.responseText);
            for(var i = 0; i < configs.length; ++i){
                setupStream(configs[i].location, configs[i].src);
            }
        }
    }
    xmlHttps.open("GET", url, true);
    xmlHttps.send();
}

function setupStream(id, src){
    document.getElementById("video_" + id).setAttribute("src", src);
    var index = src.length;
    while(src[index] != '/'){
        --index;
    }
    document.getElementById("title_" + id).innerHTML = src.substring(index + 1, src.length);
}

/*function setupStream(userName, id){
    if(userName == null){
        document.getElementById("video_" + id).setAttribute("src", "https://www.youtube.com/watch?v=nlcIKh6sBtc");
        document.getElementById("title_" + id).innerHTML = "NULL";
        return;
    }
    document.getElementById("video_" + id).setAttribute("src", "rtsp://192.41.245.236:9876/" + userName);
    document.getElementById("title_" + id).innerHTML = userName;
}*/


function updateUsersList(){
    for(var i = 0; i < 15; ++i){
        var newUserName = document.getElementById("userName_" + i).getAttribute("value");
        if(newUserName != usersList[i]){
            usersList[i] = newUserName;
            setupStream(newUserName, i);
        }
    }
}

function updateDatabase(id, src) {
    var url = "/UpdateHVConfig";
    var xmlHttps = new XMLHttpRequest();
    xmlHttps.open("POST", url, true);
    xmlHttps.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttps.send("location=" + id + "&src=" + src);
}



function getDomainName(){
    var address = window.location.href;
    var count = 0;
    var end = 0;
    while(end < address.length){
        if(address[end] == '/'){
            ++count;
        }
        if(count == 3){
            break;
        }
        ++end;
    }
    return address.substring(7, end);
}

$(document).ready(function(){
    $("#menu-toggle").click(function(){
        $("#menu").toggle(500);
        updateUsersList();
    });

    $(document).on("keyup", ".form-control", function(){
        var id = this.id.toString();
        document.getElementById(id).setAttribute("value", document.getElementById(id).value);
    });

    $(document).on("click", "#save", function(){
        updateUsersList();
    });

    $(document).on("dblclick", ".title", function(){
        var id = this.getAttribute("id").toString().substring(6);
        var value = this.innerHTML;
        var src = document.getElementById("video_" + id).getAttribute("src");
        var end = 0;
        var count = 0;
        while(end < src.length){
            if(src[end] == '/'){
                ++count;
            }
            if(count == 3){
                break;
            }
            ++end;
        }
        document.getElementById("title-area_" + id).innerHTML =
            "<input type='text' class='form-control' id='urla_" + id + "' value='" + src.substring(0, end) + "/" + "' style='float:left;width:60%;height:32px'/>"
            + "<input type='text' class='form-control' id='urlb_" + id + "' value='" + value + "' style='float:left;width:20%;height:32px'/>"
            + "<button class='btn btn-primary pull-left url-update' id='url-update_" + id + "'><span class='glyphicon glyphicon-refresh'></span></button>";
    });

    $(document).on("click", ".open", function(){
        window.open("http://" + getDomainName() + "/test/test.html?userName=" + usersList[this.getAttribute("id").substring(5)], usersList[this.getAttribute("id").substring(5)], 'window settings')
    })

    $(document).on("click", ".url-update", function(){
        var id = this.getAttribute("id").toString().substring(11);
        var src = document.getElementById("urla_" + id).getAttribute("value").toString()
            + document.getElementById("urlb_" + id).getAttribute("value").toString();
        updateDatabase(id, src);
        document.getElementById("video_" + id).setAttribute("src", src);
        var name = document.getElementById("urlb_" + id).getAttribute("value").toString();
        if(name == "") name = "NULL";
        document.getElementById("title-area_" + id).innerHTML = "<span class='title' id='title_" + id + "'>" + name + "</span><span class='open glyphicon glyphicon-resize-full' id='open_" + id + "' style='float:right;'></span>";
        var player = null;
        setTimeout(function (id) {
            player = rtsp.attach(document.getElementById('video_' + id));
            if (!player.started()) {
                player.start();
            }
        }, 200, id);
    });
});


