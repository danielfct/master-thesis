import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate } from "k6/metrics";

// A custom metric to track failure rates
var failureRate = new Rate("check_failure_rate");

// Options
export let options = {
    stages: [        
        { target: 1, duration: "1m" },
        { target: 50, duration: "1m30s" },
        { target: 50, duration: "2m" },
        { target: 1, duration: "1m30s" },
        { target: 1, duration: "1m" }
    ]
    ,ext: {
        loadimpact: {
            distribution: {
                londonTest1: { loadZone: "amazon:gb:london", percent: 50 },
                londonTest2: { loadZone: "amazon:us:portland", percent: 50 }
            }
        }
    }
};

function generateJsonBody(baseUrl, responseJson) {
    var staticReqs = [];
    for (let index = 0; index < responseJson.length; index++) {
        const image1 = responseJson[index].imageUrl[0];
        const image2 = responseJson[index].imageUrl[1];
        var staticImage1 = ["GET", baseUrl + image1, , { tags: { staticAsset: "yes" } } ];
        var staticImage2 = ["GET", baseUrl + image2, , { tags: { staticAsset: "yes" } } ];
        staticReqs.push(staticImage1);
        staticReqs.push(staticImage2);
    }
    return staticReqs;
}

// Main function
export default function () {
    var loadZone = __ENV["LI_LOAD_ZONE"];
    var baseURL = "";
    if(loadZone == "amazon:us:portland") {
        baseURL = "http://" + "52.71.3.168" + ":1906";
    }
    else if (loadZone == "amazon:gb:london") {
        baseURL = "http://" + "35.178.199.65" + ":1906";
    }

    let response = http.get(baseURL + "/catalogue");
    //console.log('URL: ' + response.url + '\nDuration: ' + response.timings.duration + 'ms');
    var staticReqs = generateJsonBody(baseURL, JSON.parse(response.body));
    // check() returns false if any of the specified conditions fail
    let checkRes = check(response, {
        //"http2 is used": (r) => r.proto === "HTTP/2.0",
        "status is 200": (r) => r.status === 200,
        //"content is present": (r) => r.body.indexOf("Welcome to the LoadImpact.com demo site!") !== -1,
    });

    // We reverse the check() result since we want to count the failures
    failureRate.add(!checkRes);

    // Load static assets, all requests
    group("Static Assets", function () {
        // Execute multiple requests in parallel like a browser, to fetch some static resources
        let resps = http.batch(
            staticReqs
        );
        
        // Combine check() call with failure tracking
        /*failureRate.add(!check(resps, {
            "status is 200": (r) => r[0].status === 200 && r[1].status === 200,
            "reused connection": (r) => r[0].timings.connecting == 0,
        })); */
    });

    sleep(Math.random() * 2 + 1.1); // Random sleep between 1.1s and 3.1s
}