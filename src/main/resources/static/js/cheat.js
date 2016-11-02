/**
 * Created by Li on 2016/10/17.
 */

setInterval(function() { cheat();}, 10000);

function cheat(){
    for(var i = 0; i < 15; ++i){
        $("#video_" + i).attr('src', "http://iit.videoanalytica.com/test/" + i + ".mp4");
    }
}