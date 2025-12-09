import config from "../config.js";


/**
 * Builds the base url for the request
 * @param {string[]} paths Array of path parts to resolve.
 * @param {boolean} talingSlash If the path should end with "/".
 * @returns 
 */
export function buildURL(paths,talingSlash = false) {
    if (!config.baseUrl) console.error("Base URL Empty!!");
    var url = config.baseUrl
    if (!url.endsWith("/")) {
        url += "/"
    }
    url += paths.join("/");

    if (talingSlash) {
        url += "/"
    }

    return url
}