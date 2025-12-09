import http from 'k6/http';
import { getExampleApiToken } from '../../utils/getToken.js';
import { buildURL } from '../../utils/urlBuilder.js';
import { check } from 'k6';
import config from '../../config.js';


export function setup() {
    var t = getExampleApiToken();

    return {
        token: t
    }
}

export default function(data) {
    var request = http.get(buildURL(["auth","info"]), {
        headers: {
            Authorization: "Bearer " + data.token,
            "Content-Type": "application/json"
        }
    });

    check(request, {
        "username matches test user": (r) => {
            return JSON.parse(r.body).username == config.testUser.username
        }
    })
}