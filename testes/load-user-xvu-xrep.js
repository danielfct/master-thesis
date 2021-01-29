import http from "k6/http";
import {check, sleep } from "k6";
import { Rate } from "k6/metrics";
import encoding from "k6/encoding";

// A custom metric to track failure rates
var failureRate = new Rate("check_failure_rate");

// Options
export let options = {
    stages: [        
        { target: 1, duration: "1m" },
        { target: 100, duration: "1m30s" },
        { target: 100, duration: "2m" },
        { target: 1, duration: "1m30s" },
        { target: 1, duration: "1m" }
    ],
    ext: {
        loadimpact: {
            distribution: {
                londonTest1: { loadZone: "amazon:gb:london", percent: 50},
                londonTest2: { loadZone: "amazon:us:portland", percent: 50}
            }
        }
    }
};

function genereateWord(isOnlyLetters, size) {
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "l", "m", 
                   "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "z"];
    var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var word = "";

    for(var i = 0; i < size; i++) {
        var isLetter = isOnlyLetters ? true : (Math.random() < 0.5);
       
        if (isLetter) {
            var randomLetter = Math.floor(Math.random() * letters.length);
            word += letters [randomLetter];
        } else {
            var randomNumber = Math.floor(Math.random() * numbers.length);
            word += numbers [randomNumber];
        }
    }
    return word;
}

function genereateRegisterPayload() {
    var username = genereateWord(false, 8);
    var password = genereateWord(false, 4);
    var email = genereateWord(false, 8) + "@email." + genereateWord(true, 3);
    var firstName = genereateWord(true, 6);
    var lastName = genereateWord(true, 6);

    var payload = JSON.stringify({
        "username": username,
        "password": password,
        "email": email,
        "firstName": firstName,
        "lastName": lastName
    });

    return payload;
}

function getRandomUser() {
    var users = [
        {"username": "Eve_Berger", "password": "eve"},
        {"username": "user", "password": "password"},
        {"username": "user1", "password": "password"}
    ];

    var randomUser = Math.floor(Math.random() * users.length);
    var userEnconded = encoding.b64encode(users[randomUser].username + ":" +  users[randomUser].password);

    return "Basic " + userEnconded;
}


// Main function
export default function () {
    var loadZone = __ENV["LI_LOAD_ZONE"];
    var baseURL = "";
    if(loadZone == "amazon:us:portland") {
        baseURL = "http://" + "54.87.165.240" + ":1906";
    }
    else if (loadZone == "amazon:gb:london") {
        baseURL = "http://" + "35.178.149.47" + ":1906";
    }

    var maxLogin = 0.5;
    var randomNumber = Math.random();    
    var response;

    if (randomNumber < maxLogin) {
        var authUser = getRandomUser();
        var params = { headers: { "Authorization": authUser, "Content-Type": "application/json"} };
        response = http.get(baseURL + "/login", params);
    } else {
        var payload = genereateRegisterPayload();
        var params = { headers: {"Content-Type": "application/json"} };
        response = http.post(baseURL + "/register", payload, params);
    }

    // check() returns false if any of the specified conditions fail
    let checkRes = check(response, {
        //"http2 is used": (r) => r.proto === "HTTP/2.0",
        "status is 200": (r) => r.status === 200,
        //"content is present": (r) => r.body.indexOf("Welcome to the LoadImpact.com demo site!") !== -1,
    });

    // We reverse the check() result since we want to count the failures
    failureRate.add(!checkRes);

    sleep(Math.random() * 1 + 0.1); // Random sleep between 0s and 1s
}