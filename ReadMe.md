# ReadMe
[Hawk](http://192.41.245.236) web application documentation.

## Purpose
This web application is one part of the smart video surveillance system. It contains two major functions.
1. Show users' paths, real time stream videos and recorded videos on Google Map or Baidu Map.
2. Manage MySQL database, update each table according to the requests from users' devices, demo maps, and dispatcher.

## Architecture
This project uses Spring MVC Framework.
1. **Model**: Models store structure of tables in the database. Repositories contain interfaces which allow to use query to access database.
2. **View**: All front end pages are in View section. Views contain static HTML pages, JavaScript files, CSS files and image files.
3. **Controller**: Controller receives data from pages, process data, update database, and return data to users. There are two types of controller, Controller and MVC Controller. MVC Controllers gather data and return front end pages to users. Controllers contains main APIs which allow other users to access. For example, devices and dispatcher can use Controller APIs to update database and get data from database.

System File:

Database:


## API Detail
1. **TripController**
    + /ReportCoordinate
        - Method: POST.
        - Description: Post coordinate information and store into database. Data should include "*userId*", "*recordTime*", "*latitude*", "*longitude*", "*altitude*" and "*tripId*".
        - Use case: Terminals, such as cellphones and body cameras, use this API to store coordinate into database.
    + /GetRoute/{userName}/{tripId}
        - Method: GET.
        - Description: Return JSON format coordinate information for a certain user and trip.
        - Use case: map.js gets route for a certain user and trip from database by using this API.
    + /GetRoute/{userName}
        - Method: GET.
        - Description: Return JSON format coordinate information for the latest trip of a certain user.
        - Use case: map.js gets route for the latest trip of a certain user from database by using this API.
    + /ClearTrip/{userName}
        - Method: GET.
        - Description: Delete all coordinates of a certain user.
        - Use case: Dispatcher uses this API to clean all coordinate information of a certain user from database.
2. **MarkerController**
    + /GetRecordedVideos/{userName}/{tripId}
        - Method: GET.
        - Description: Return JSON format recorded video information for a certain user and trip.
        - Use case: map.js uses this API to get recorded video information for a certain user and trip.
    + /GetRecordedVideos/{userName}
        - Method: GET.
        - Description: Return JSON format recorded video information for the latest trip of a certain user.
        - Use case:
    + /UpdateVideos/{userName}/{tripId}
        - Method: GET.
        - Description: Check the recorded videos of a certain user and trip. If there are new recorded videos, update the database.
        - Use case:
    + /UpdateVideos/{userName}
        - Method: GET.
        - Description: Check the recorded videos of the last trip of a certain user. If there are new recorded videos, update the database.
        - Use case:
    + /ClearMarkers/{userName}
        - Method: GET.
        - Description: Delete all markers of a certain user.
        - Use case: Dispatcher uses this API to clean all markers information of a certain user from database.
3. **UserController**
    + /getUsers
        - Method: GET.
        - Description: Return all users in the database in JSON format.
    + /getUser/{userId}
        - Method: GET.
        - Description: Return all information of a certain user in JSON format.
    + /getUserPort/{userName}
        - Method: GET.
        - Description: Return the port of a certain user in String format.
        - Use case: map.html use this API to fetch the streaming port by userName.
    + /GetUserIds
        - Method: GET.
        - Description: Return all userId in the database in JSON format.
        - Use case: map.js use this API to generate user list on the menu.
