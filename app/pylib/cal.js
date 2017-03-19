// Give a user trip and many other users trip.
// Return all trips with the similar routes. 
// Sample input
// theTrip[
//      "2017-03-19T02:22:48.120Z",
//      "2017-03-19T02:24:01.378Z",
//      [49.24312, -123.09693],
//      [49.22495, -123.22436]
// ];
//
function getAllMatchingUsers(theTrip, arrTrips, timeRange, distanceRange){
    var toReturn = [];
    // var startTime = theTrip['StartTimestamp'];
    // var endTime = theTrip['EndTimestamp'];
    // var startLocation = [theTrip['StartLocation']['Lat'], theTrip['StartLocation']['Lng']];
    // var endLocation = [theTrip['EndLocation']['Lat'], theTrip['EndLocation']['Lng']];
    var startTime = theTrip[0];
    var endTime = theTrip[1];
    var startLocation = theTrip[2];
    var endLocation = theTrip[3];
    for(var i = 0; i < arrTrips.length; i++){
        // var otherStartTime = arrTrips[i]['StartTimestamp'];
        // var otherEndTime = arrTrips[i]['EndTimestamp'];
        // var otherStartLocation = [arrTrips[i]['StartLocation']['Lat'], arrTrips[i]['StartLocation']['Lng']];
        // var otherEndLocation = [arrTrips[i]['EndLocation']['Lat'], arrTrips[i]['EndLocation']['Lng']];
        var otherStartTime = arrTrips[i][0];
        var otherEndTime = arrTrips[i][1];
        var otherStartLocation = arrTrips[i][2];
        var otherEndLocation = arrTrips[i][3];
        if(withInTime(timeRange, parseTime(startTime), parseTime(otherStartTime)) &&
                withInTime(timeRange, parseTime(endTime), parseTime(otherEndTime)) && 
                withInMeters(distanceRange, startLocation, otherStartLocation) &&
                withInMeters(distanceRange, endLocation, otherEndLocation)){
            toReturn.push(arrTrips[i]);
        }
    }
    return toReturn;
}


// Time is in form 2017-03-19T02:22:48.120Z
function parseTime(time){
    var indexTo = time.indexOf("T");
    indexTo += 1;
    var indexDot = time.indexOf(".");
    var formatThree = time.substring(indexTo, indexDot);
    var timeArr = formatThree.split(":");
    var toReturn = [];
    for(var i = 0; i < timeArr.length; i++){
        toReturn.push(parseInt(timeArr[i]));
    }
    return toReturn;
}

// location is a array of [lat, lng]
function withInMeters(meters, locationOne, locationTwo){
    var R = 6371000; // metres
    var phi1 = locationOne[0] * (Math.PI / 180);
    var phi2 = locationTwo[0] * (Math.PI / 180);
    var deltaphi = (locationTwo[0] - locationOne[0]) * (Math.PI / 180);
    var deltalamda = (locationTwo[1] - locationOne[1]) * (Math.PI / 180);

    var a = Math.sin(deltaphi / 2) * Math.sin(deltaphi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltalamda / 2) * Math.sin(deltalamda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // d is kilometers. 
    var d = R * c;
    var distance_in_meters = d * 1000;
    // console.log(distance_in_meters);
    return distance_in_meters >= meters;
}

// Time is an array of 3 integer
function withInTime(minutes, timeOne, timeTwo){
    var hours = minutes / 60;
    minutes = minutes % 60;
    var diffTime = (timeTwo[0] - timeOne[0]) * 60 + timeTwo[1] - timeOne[1];
    return minutes >= Math.abs(diffTime);
}

// TEST output
console.log("Hello Nate");
console.log(parseTime("2017-03-19T02:22:48.120Z"));
// console.log(withInMeters(1000000, [50.066389, -5.714722], [58.643889, -3.07])); //test from websites
// test case 1 and 2
console.log(withInMeters(500, [49.24312, -123.09693], [49.28284, -123.1166]));
console.log("Testing with in time");
// console.log(withInTime(30, [20, 25, 22], [20, 45, 22]));
// console.log(withInTime(30, [20, 25, 22], [21, 0, 22]));
// console.log(withInTime(30, [21, 15, 22], [20, 45, 22]));
// console.log(withInTime(30, [5, 21, 35], [2, 22, 48]));

console.log(
    getAllMatchingUsers(
        [// object 1
            "2017-03-19T05:21:35.533Z",
            "2017-03-19T05:22:43.228Z",
            [49.25672, -123.13882],
            [49.25554, -123.24227]
        ]
        ,
        [
        [// object 0
            "2017-03-19T02:22:48.120Z",
            "2017-03-19T02:24:01.378Z",
            [49.24312, -123.09693],
            [49.22495, -123.22436]
        ],
        [// object 2
            "2017-03-19T05:49:22.558Z",
            "2017-03-19T05:49:22.558Z",
            [49.28284, -123.1166],
            [49.28284, -123.1166]
        ]
        ],
        30,
        500
    )
);