import * as Regex from "../../shared/regex/regex";

export const isNonEmptyString = (str) => {
return   Boolean(str && typeof str === "string" && str.length);

}

export const isUrlValid = (userInput) => {
    let res = userInput.match(Regex.URL_REGEX);
    return Boolean(res);
}

export const isYoutubeUrlValid = (userInput) => {
    let res = userInput.match(Regex.YOUTUBE_URL_REGEX);
    return Boolean(res);
}
