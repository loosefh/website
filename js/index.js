"use strict";
var input = document.querySelector("input"),
    trackDisplay = document.querySelector("#track"),
    albumDisplay = document.querySelector("#album"),
    lastDisplay = document.querySelector("#last"),
    host = window.location.host.includes("fletcher") ? window.location.host : "fltchr.net",
    mail = ["fletcher", String.fromCharCode(64), host.replace("www.", "")].join(""),
    xhr = new XMLHttpRequest,
    lastfm = {
        url: "https://ws.audioscrobbler.com/2.0/",
        user: "imscuffed",
        apiKey: "ac714a91d6871ac742628ca27225bcf0",
        recent: "user.getrecenttracks",
        top: "user.gettopartists",
        topPeriod: "1month",
        topAmount: 3,
        fetchInterval: 7e3
    },
    fadeIn = function () {
        lastDisplay.setAttribute("style", "display: inherit;")
    },
    renderCurrent = function (t) {
        var e = t.recenttracks.track[0].name,
            a = t.recenttracks.track[0].artist["#text"],
            n = t.recenttracks.track[0].album["#text"],
            r = "" === n.trim() ? "SoundCloud" : '"'.concat(n.toLowerCase(), '"'),
            o = encodeURIComponent("".concat(a, " - ").concat(e)),
            c = "SoundCloud" === r ? "https://soundcloud.com/search?q=".concat(o) : "https://www.youtube.com/results?search_query=".concat(o),
            s = document.createElement("a");
        s.innerText = "".concat(a.toLowerCase(), " - ").concat(e.toLowerCase()), s.href = c, trackDisplay.innerHTML = "now playing: ", albumDisplay.innerHTML = "from <span>".concat(r, "</span>"), trackDisplay.appendChild(s), fadeIn()
    },
    renderTop = function (t) {
        for (var e = "", a = 0; a < lastfm.topAmount; a += 1) {
            var n = a === lastfm.topAmount - 1 ? "" : ", ";
            e += "<strong>".concat(t.topartists.artist[a].name.toLowerCase(), "</strong>").concat(n), a === lastfm.topAmount - 1 && (trackDisplay.innerHTML = "now playing: <strong>nothing</strong>", albumDisplay.innerHTML = "top artists: <em>".concat(e, "</em>"), fadeIn())
        }
    },
    xhrGet = function (t, e) {
        xhr.open("GET", t), xhr.send(), xhr.onload = function () {
            200 === xhr.status && e(JSON.parse(xhr.response))
        }
    },
    renderLastfm = function () {
        xhrGet("".concat(lastfm.url, "?method=").concat(lastfm.recent, "&user=").concat(lastfm.user, "&api_key=").concat(lastfm.apiKey, "&format=json"), function (t) {
            void 0 !== t.recenttracks.track[0]["@attr"] ? renderCurrent(t) : xhrGet("".concat(lastfm.url, "?method=").concat(lastfm.top, "&user=").concat(lastfm.user, "&api_key=").concat(lastfm.apiKey, "&format=json&period=").concat(lastfm.topPeriod), function (t) {
                renderTop(t)
            })
        })
    };
input.value = mail, input.addEventListener("click", function (t) {
    t.target.focus(), t.target.select()
}), renderLastfm(), setInterval(renderLastfm, lastfm.fetchInterval);
