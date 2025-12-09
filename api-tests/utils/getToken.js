import http from 'k6/http';
import { buildURL } from './urlBuilder.js';
import config from '../config.js';




export function getExampleApiToken() {
    var request = http.post(buildURL(["auth","login"]),JSON.stringify(config.testUser), {
        headers: {            
            "Content-Type": "application/json"
        }
    });

    if (request.status !== 200) {
        console.error("Token request failed: " + request.body);
    } else {
        console.log("Succesfully Got Token")
    }

    const body = JSON.parse(request.body);
    return body.token
}