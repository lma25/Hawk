/**
 * Created by Li on 2016/9/30.
 */
var sc_width = screen.width;
var sc_height = screen.height;
var sc_referer = "" + document.referrer;
try {
    sc_referer = "" + parent.document.referrer
} catch (ex) {
    sc_referer = "" + document.referrer
}
var sc_unique = 0;
var sc_returning = 0;
var sc_returns = 0;
var sc_error = 0;
var sc_remove = 0;
var sc_cls = -1;
var sc_inv = 0;
var sc_os = "";
var sc_title = "";
var sc_url = "";
var sc_base_dir = "";
var sc_click_dir = "";
var sc_link_back_start = "";
var sc_link_back_end = "";
var sc_security_code = "";
var sc_http_url = "http";
var sc_host = "statcounter.com";
var sc_dc = "c";
var sc_alt_text = "StatCounter - Free Web Tracker and Counter";
var sc_counter_size = "";
var sc_prerendering = 0;
var sc_uuid = "";
var sc_uuid_q = "&u1=za";
var sc_unique_returning = "";
var sc_sp = "cookie";
if (window.sc_client_storage) {
    sc_sp = window.sc_client_storage
}
if (typeof window.sc_first_party_cookie != "undefined" && sc_first_party_cookie == "0") {
    sc_sp = "disabled"
}
var _statcounter_pending = _statcounter;
var _statcounter = {
    push: function (_1) {
    }
};
if (window.sc_invisible) {
    if (window.sc_invisible == 1) {
        sc_inv = 1
    }
}
if (window.sc_click_stat) {
    sc_cls = window.sc_click_stat
}
sc_doc_loc = "" + document.location;
myRE = new RegExp("^https", "i");
if (sc_doc_loc.match(myRE)) {
    sc_http_url = "https"
}
if (window.sc_local) {
    sc_base_dir = sc_local
} else {
    if (sc_cls == -1) {
        sc_cls = 1
    }
    sc_base_dir = sc_http_url + "://" + sc_dc + "." + sc_host + "/"
}
sc_click_dir = sc_base_dir;
if (window.sc_counter_target) {
    sc_base_dir += window.sc_counter_target + "?"
} else {
    if (window.sc_text) {
        sc_base_dir += "text.php?"
    } else {
        sc_base_dir += "t.php?"
    }
}
if (window.sc_project) {
    if (sc_project == "4135125" || sc_project == "6169619" || sc_project == "6222332" || sc_project == "5106510" || sc_project == "6311399" || sc_project == "6320092" || sc_project == "5291656" || sc_project == "7324465" || sc_project == "6640020" || sc_project == "4629288" || sc_project == "1480088" || sc_project == "2447031") {
        if (Math.floor(Math.random() * 6) != 1) {
            sc_remove = 1
        }
    }
    sc_base_dir += "sc_project=" + sc_project
} else {
    if (window.usr) {
        sc_base_dir += "usr=" + usr
    } else {
        sc_error = 1
    }
}
if (window.sc_remove_link) {
    sc_link_back_start = "";
    sc_link_back_end = ""
} else {
    sc_link_back_start = "<a class=\"statcounter\" href=\"http://www." + sc_host + "\" target=\"_blank\">";
    sc_link_back_end = "</a>"
}
sc_date = new Date();
sc_time = sc_date.getTime();
sc_time_difference = 3600000;
sc_title = "" + document.title;
sc_url = "" + document.location;
sc_title = sc_title.substring(0, 300);
sc_url = sc_url.substring(0, 300);
if (encodeURIComponent) {
    sc_title = encodeURIComponent(sc_title)
} else {
    sc_title = escape(sc_title)
}
sc_url = escape(sc_url);
if (window.sc_security) {
    sc_security_code = sc_security
}
if (sc_script_num) {
    sc_script_num++
} else {
    var sc_script_num = 1
}
if (typeof _sc_imgs == "undefined") {
    var _sc_imgs = {}
}
var sc_pageview_tag_string = "";
(function (_2, _3, _4, _5) {
    var _6 = "";
    var _7 = {
        "google": null,
        "bing": ["q"],
        "search.yahoo": null,
        "m.yahoo": null,
        "m2.yahoo": null,
        "baidu": ["wd", "word"],
        "yandex": ["text"],
        "ya.ru": ["text"],
        "haosou": ["q"],
        "so.com": ["q"],
        "360.cn": ["q"],
        "360sou": ["q"],
        "aol": ["query", "q"],
        "duckduckgo": null,
        "ask.com": ["q", "QUERYT"],
        "mail.ru": ["words"],
        "sogou": ["q", "query"]
    };
    var _8 = {
        "fb": ["facebook.com", "fb.me"],
        "pi": ["pinterest.com"],
        "tw": ["twitter.com", "t.co"],
        "ln": ["linkedin.com"],
        "gp": ["plus.google.com", "plus.url.google.com"]
    };

    function classify_referrer(r) {
        if (r == "") {
            return "d"
        }
        if (r.search(/\bgoogle\..*\?.*adurl=http/) !== -1) {
            return "p"
        }
        var _a = ["utm_source=bing", "gclid=", "utm_medium=cpc", "utm_medium=paid-media", "utm_medium=ppc", "aclk?", "cid="];
        for (var i = 0; i < _a.length; i++) {
            if (document.location.search.indexOf(_a[i]) !== -1) {
                return "p"
            }
        }
        var _c = ["utm_medium=email"];
        for (var i = 0; i < _c.length; i++) {
            if (document.location.search.indexOf(_c[i]) !== -1) {
                return "e"
            }
        }
        var _d = r.split("/")[2].replace(/^www\./, "");
        if (document.location.host.replace(/^www\./, "") == _d) {
            return "internal"
        }
        for (var _e in _7) {
            if (_d.replace(_e, "#").split(".").indexOf("#") !== -1) {
                if (_7[_e] === null) {
                    return _e
                }
                for (var i = 0; i < _7[_e].length; i++) {
                    var _f = _7[_e][i];
                    if (r.indexOf("?" + _f + "=") !== -1 || r.indexOf("&" + _f + "=") !== -1) {
                        return _e
                    }
                }
            }
        }
        for (var _10 in _8) {
            for (var i = 0; i < _8[_10].length; i++) {
                var _e = _8[_10][i];
                if (_d.replace(_e, "#").split(".").indexOf("#") !== -1) {
                    return _10
                }
            }
        }
        return _d
    }

    function categorize_class(cls) {
        if (cls == "d" || cls == "p" || cls == "e" || cls == "internal") {
            return cls
        }
        if (cls in _7) {
            return "o"
        }
        if (cls in _8) {
            return "s"
        }
        return "r"
    }

    if (sc_remove != 1) {
        if (document.webkitVisibilityState != "prerender") {
            sc_prerendering = 0
        } else {
            sc_prerendering = 1;
            document.addEventListener("webkitvisibilitychange", function (evt) {
                if (sc_prerendering == 1) {
                    sc_prerendering = 2;
                    sc_send_data()
                } else {
                    return
                }
            }, false)
        }
    }
    var _13 = parseInt(sc_project, 10);
    var _14 = _13 == 9560334 || _13 == 6709687 || _13 == 9879613 || _13 == 4124138 || _13 == 204609 || _13 == 10776808;
    try {
        var _15 = Math.pow(_3, _4), _16 = Math.pow(2, _5), _17 = _16 * 2, _18 = _3 - 1;
        var _19;
        var _1a = function (_1b, _1c) {
            var key = [];
            var _1e = mixkey(flatten(_1c ? [_1b, tostring(_2)] : 0 in arguments ? _1b : autoseed(), 3), key);
            var _1f = new ARC4(key);
            mixkey(tostring(_1f.S), _2);
            _19 = function () {
                var n = _1f.g(_4), d = _15, x = 0;
                while (n < _16) {
                    n = (n + x) * _3;
                    d *= _3;
                    x = _1f.g(1)
                }
                while (n >= _17) {
                    n /= 2;
                    d /= 2;
                    x >>>= 1
                }
                return (n + x) / d
            };
            return _1e
        };

        function ARC4(key) {
            var t, _25 = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
            if (!_25) {
                key = [_25++]
            }
            while (i < _3) {
                s[i] = i++
            }
            for (i = 0; i < _3; i++) {
                s[i] = s[j = _18 & (j + key[i % _25] + (t = s[i]))];
                s[j] = t
            }
            (me.g = function (_2a) {
                var t, r = 0, i = me.i, j = me.j, s = me.S;
                while (_2a--) {
                    t = s[i = _18 & (i + 1)];
                    r = r * _3 + s[_18 & ((s[i] = s[j = _18 & (j + t)]) + (s[j] = t))]
                }
                me.i = i;
                me.j = j;
                return r
            })(_3)
        }

        function flatten(obj, _2e) {
            var _2f = [], typ = (typeof obj)[0], _31;
            if (_2e && typ == "o") {
                for (_31 in obj) {
                    try {
                        _2f.push(flatten(obj[_31], _2e - 1))
                    } catch (e) {
                    }
                }
            }
            return (_2f.length ? _2f : typ == "s" ? obj : obj + "\x00")
        }

        function mixkey(_32, key) {
            var _34 = _32 + "", _35, j = 0;
            while (j < _34.length) {
                key[_18 & j] = _18 & ((_35 ^= key[_18 & j] * 19) + _34.charCodeAt(j++))
            }
            return tostring(key)
        }

        function autoseed(_37) {
            try {
                window.crypto.getRandomValues(_37 = new Uint8Array(_3));
                return tostring(_37)
            } catch (e) {
                return [+new Date, window, window.navigator.plugins, window.screen, tostring(_2)]
            }
        }

        function tostring(a) {
            return String.fromCharCode.apply(0, a)
        }

        mixkey(Math.random(), _2);
        function _localStorageAvailable() {
            var _39 = false;
            if ("localStorage" in window) {
                try {
                    _39 = window["localStorage"] !== null
                } catch (e) {
                    if (!e.name || e.name.toLowerCase().replace(/_/g, "").substring(0, 16) !== "quotaexceedederr") {
                        if (!e.number || parseInt(e.number, 10) !== -2147024891) {
                            throw e
                        }
                    }
                }
            }
            return _39
        }

        function _setLocalStorage(_3a, _3b, _3c) {
            if (_localStorageAvailable()) {
                try {
                    if (_3a === "is_visitor_unique") {
                        localStorage.setItem("statcounter.com/localstorage/", _3b)
                    } else {
                        localStorage.setItem("statcounter_" + _3a, _3b)
                    }
                } catch (e) {
                    if (!e.name || e.name.toLowerCase().replace(/_/g, "").substring(0, 16) !== "quotaexceedederr") {
                        if (!e.number || parseInt(e.number, 10) !== -2147024891) {
                            throw e
                        }
                    }
                    return false
                }
                return true
            }
            return false
        }

        function setLocal(_3d, _3e, _3f, _40, _41) {
            if (typeof _3e === "string") {
                _3e = [_3e]
            }
            if (_40 === undefined) {
                _40 = ""
            }
            if (_41 === undefined) {
                _41 = 30
            }
            var _42 = false;
            if (sc_sp == "localStorage") {
                _42 = _setLocalStorage(_3d, _40 + _3e.join("-"), _3f);
                if (!_42) {
                    _42 = _writeCookie(_3d, _40 + _3e.join("-"), _3f)
                } else {
                    if (_readCookie(_3d) !== null) {
                        _removeCookie(_3d, _3f)
                    }
                }
            } else {
                cookie_value = _3e.slice(0, _41).join("-");
                _42 = _writeCookie(_3d, _40 + cookie_value, _3f);
                if (!_42) {
                    _42 = _setLocalStorage(_3d, _40 + _3e.join("-"), _3f)
                } else {
                    if (_3e.length > _41) {
                        _setLocalStorage(_3d, "mx" + _3e.slice(_41).join("-"), _3f)
                    } else {
                        _removeLocalStorage(_3d)
                    }
                }
            }
            return _42
        }

        function getLocal(_43) {
            var val = null;
            if (_localStorageAvailable()) {
                if (_43 === "is_visitor_unique") {
                    val = localStorage.getItem("statcounter.com/localstorage/")
                } else {
                    val = localStorage.getItem("statcounter_" + _43)
                }
            }
            if (sc_sp == "localStorage" && val !== null && val.substring(0, 2) == "rx") {
                return val
            }
            var _45 = _readCookie(_43);
            if (val !== null) {
                if (_45 === null && val.substring(0, 2) == "rx") {
                    return val
                } else {
                    if (_45 !== null && val.substring(0, 2) == "mx") {
                        _45 += "-" + val.substring(2)
                    }
                }
            }
            return _45
        }

        function _removeLocalStorage(_46) {
            if (_localStorageAvailable()) {
                if (_46 === "is_visitor_unique") {
                    localStorage.removeItem("statcounter.com/localstorage/")
                }
                localStorage.removeItem("statcounter_" + _46)
            }
        }

        function removeLocal(_47, _48) {
            _removeLocalStorage(_47);
            if (_readCookie(_47)) {
                _removeCookie(_47, _48)
            }
        }

        function _readCookie(_49) {
            var _4a = "sc_" + _49 + "=";
            if (document.cookie) {
                var ca = document.cookie.split(";");
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == " ") {
                        c = c.substring(1, c.length)
                    }
                    if (c.indexOf(_4a) == 0) {
                        return c.substring(_4a.length, c.length)
                    }
                }
            }
            return null
        }

        function _writeCookie(_4e, _4f, _50, _51) {
            if (_51 === undefined) {
                var _52 = 1000 * 60 * 60 * 24 * 365 * 2
            } else {
                var _52 = 1000 * _51
            }
            expiration = new Date();
            expiration.setTime(expiration.getTime() + _52);
            var _53 = 3050;
            if (_4f.length > _53 - 50 && _4f.substring(0, _53).indexOf("-") !== -1) {
                _4f = _4f.substring(0, _4f.substring(0, _53).lastIndexOf("-"))
            }
            document.cookie = "sc_" + _4e + "=" + _4f + "; expires=" + expiration.toGMTString() + "; domain=" + _50 + "; path=/";
            if (_readCookie(_4e) !== null) {
                return true
            } else {
                return false
            }
        }

        function _removeCookie(_54, _55) {
            document.cookie = "sc_" + _54 + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=" + _55 + "; path=/"
        }

        function detectBrowserFeatures() {
            var _56 = [];
            var i;
            var _58;
            var _59 = {
                pdf: "application/pdf",
                qt: "video/quicktime",
                realp: "audio/x-pn-realaudio-plugin",
                wma: "application/x-mplayer2",
                dir: "application/x-director",
                fla: "application/x-shockwave-flash",
                java: "application/x-java-vm",
                gears: "application/x-googlegears",
                ag: "application/x-silverlight"
            };
            var _5a = (new RegExp("Mac OS X.*Safari/")).test(navigator.userAgent) ? window.devicePixelRatio || 1 : 1;
            if (!((new RegExp("MSIE")).test(navigator.userAgent))) {
                if (navigator.mimeTypes && navigator.mimeTypes.length) {
                    for (i in _59) {
                        if (Object.prototype.hasOwnProperty.call(_59, i)) {
                            _58 = navigator.mimeTypes[_59[i]];
                            _56.push((_58 && _58.enabledPlugin) ? "1" : "0")
                        }
                    }
                }
                if (typeof navigator.javaEnabled !== "unknown" && typeof navigator.javaEnabled !== "undefined" && navigator.javaEnabled()) {
                    _56.push("java")
                }
                if (typeof window.GearsFactory === "function") {
                    _56.push("gears")
                }
            }
            _56.push(screen.width * _5a + "x" + screen.height * _5a);
            return _56.join("")
        }

        function generate_uuid() {
            var now = new Date();
            var _5c = false;
            var _5d = 32;
            if (_5c) {
                _5d = 36
            }
            var _5e = Math.round(now.getTime() / 1000) + now.getMilliseconds();
            var _5f = (navigator.userAgent || "") + (navigator.platform || "") + detectBrowserFeatures() + now.getTimezoneOffset() + window.innerWidth + window.innerHeight + window.screen.colorDepth + document.URL + _5e;
            _1a(_5f);
            var _60 = "0123456789ABCDEF".split(""), _61 = new Array(_5d), rnd = 0, r;
            for (var i = 0; i < _5d; i++) {
                if (_5c && (i == 8 || i == 13 || i == 18 || i == 23)) {
                    _61[i] = "-"
                } else {
                    if ((i == 12 && !_5c) || (i == 14 && _5c)) {
                        _61[i] = "4"
                    } else {
                        if ((i == 13 && !_5c) || (i == 15 && _5c)) {
                            _61[i] = "F"
                        } else {
                            if (rnd <= 2) {
                                rnd = 33554432 + (_19() * 16777216) | 0
                            }
                            r = rnd & 15;
                            rnd = rnd >> 4;
                            _61[i] = _60[(i == 19) ? (r & 3) | 8 : r]
                        }
                    }
                }
            }
            return _61.join("")
        }

        var _65 = classify_referrer(sc_referer);
        var _66 = categorize_class(_65);
        if (_65 != "internal") {
            _6 = "&rcat=" + _66 + "&rdom=" + _65
        }
        try {
            localStorage.removeItem("statcounter_medium_source")
        } catch (ignore) {
        }
        var _67 = Math.round((new Date()).getTime() / 1000);
        if (sc_sp != "disabled") {
            try {
                var _68 = JSON.parse(localStorage.getItem("sc_medium_source"));
                if (_68 == null) {
                    _68 = {}
                } else {
                    if ("internal" in _68) {
                        delete _68["internal"]
                    }
                }
                var _69 = null;
                var _6a = null;
                var _6b = null;
                var msl = 0;
                for (var k in _68) {
                    if (_69 === null || _68[k] > _68[_69]) {
                        _69 = k
                    }
                    var _6e = categorize_class(k);
                    if (_66 == _6e && (_6a === null || _68[k] > _68[_6a])) {
                        _6a = k
                    }
                    if (_6e == "r" && (_6b === null || _68[k] < _68[_6b])) {
                        _6b = k
                    }
                    msl += 1
                }
                if (msl > 30 && _6b !== null) {
                    delete _68[_6b]
                }
                var _6f = "";
                if (sessionStorage.getItem("statcounter_bounce")) {
                    sessionStorage.removeItem("statcounter_bounce");
                    _6f = "&bb=0"
                }
                if (_65 == "d" && _69 !== null && _69 != "d" && (_67 - _68[_69]) < 60 * 15) {
                    _65 = "internal"
                }
                if (_66 == "r" && sessionStorage.getItem("statcounter_exit_domain") == _65) {
                    _65 = "internal"
                }
                if (_65 == "internal") {
                    if (_69 !== null) {
                        _6 = "&rcat=" + categorize_class(_69) + "&rdomo=" + _69;
                        _6 += "&rdomg=" + (_67 - _68[_69]);
                        _68[_69] = _67
                    }
                } else {
                    var _70 = false;
                    if (_65 in _68) {
                        if (_65 == _69) {
                            _6 = _6.replace("rdom=", "rdomo=")
                        }
                        _6 += "&rdomg=" + (_67 - _68[_65]);
                        if (_67 - _68[_65] < 60 * 30) {
                            _70 = true
                        }
                    } else {
                        _6 += "&rdomg=new"
                    }
                    if (_6f == "" && !_70) {
                        sessionStorage.setItem("statcounter_bounce", "1");
                        _6f = "&bb=1"
                    }
                    if (_6a !== null && (!(_65 in _68) || _65 != _6a)) {
                        _6 += "&rcatg=" + (_67 - _68[_6a])
                    }
                    _68[_65] = _67
                }
                _6 += _6f;
                try {
                    localStorage.setItem("sc_medium_source", JSON.stringify(_68))
                } catch (maybe_not_enough_space) {
                }
            } catch (ignore) {
            }
            if (_13 == 10227105) {
                try {
                    var _71 = new Image();
                    _71.src = "http://statcounter.com/feedback/?email=javascript@statcounter.com&page_url=" + encodeURIComponent(document.location.protocol + "//" + document.location.host + document.location.pathname + document.location.search + document.location.hash) + "&name=Auto%20JS&feedback_username=statcounter&pid=" + sc_project + "&fake_post&user_company&feedback=consistent%20uniques%20js%20exception:%20" + encodeURIComponent(localStorage.getItem("statcounter.com/localstorage/") + ":::" + _readCookie("is_visitor_unique"))
                } catch (ignore) {
                }
            }
            var _72 = "1.1.1.1.1.1.1.1.1";
            if (typeof window.sc_cookie_domain == "undefined") {
                var _73 = window.location.host
            }
            if (_73.substring(0, 1) != ".") {
                _73 = "." + _73
            }
            var _74 = "is_visitor_unique";
            try {
                var _75 = getLocal(_74)
            } catch (e) {
                var _75 = false;
                sc_uuid = ".ex"
            }
            var _76 = [];
            var _77 = [];
            if (_75 && _75.substring(0, 2) == "rx") {
                removeLocal(_74, _73);
                var _78 = _75.substring(2);
                _76 = _78.split("-");
                var _79 = false;
                var _7a = false;
                for (var i = 0; i < _76.length; i++) {
                    var _7c = _76[i].split(".");
                    if (_7c[0] == sc_project) {
                        _79 = true;
                        var _7d = parseInt(_7c[1], 10);
                        var _7e = [30, 60, 120, 180, 360, 720, 1440, 2880, 10080];
                        var _7f = [];
                        var _80 = 2;
                        if (_7c[2].length == 32) {
                            sc_uuid = "." + _7c[2];
                            _80 = 3
                        } else {
                            sc_uuid = _7a
                        }
                        for (var ir = 0; ir < _7e.length; ir++) {
                            var _82 = parseInt(_7c[ir + _80], 10);
                            if (isNaN(_82)) {
                                _82 = 1
                            }
                            _7f.push(_82)
                        }
                        sc_unique_returning += "&jg=" + (_67 - _7d);
                        for (var ir = 0; ir < _7e.length; ir++) {
                            if (_6.indexOf("rdom=") !== -1) {
                                _7f[ir]++
                            } else {
                                if (_67 > (_7d + 60 * _7e[ir])) {
                                    _7f[ir]++
                                }
                            }
                        }
                        sc_unique_returning += "&rr=" + _7f.join(".");
                        _77.push(sc_project + "." + _67 + sc_uuid + "." + _7f.join("."))
                    } else {
                        _77.push(_76[i]);
                        if (i == 0 && _7c[2].length == 32 && sc_uuid == "") {
                            sc_uuid = "." + _7c[2]
                        }
                    }
                    if (i == 0) {
                        _7a = sc_uuid
                    }
                }
                if (!_79) {
                    if (_77.length == 0 && sc_uuid == "") {
                        sc_uuid = "." + generate_uuid()
                    }
                    _77.push(sc_project + "." + _67 + sc_uuid + "." + _72);
                    sc_unique_returning += "&jg=new&rr=" + _72
                }
                _77.sort(function (a, b) {
                    return parseInt(b.split(".")[1], 10) - parseInt(a.split(".")[1], 10)
                });
                for (var iv = 1; iv < _77.length; iv++) {
                    _77[iv] = _77[iv].replace("." + _77[0].split(".")[2] + ".", ".")
                }
                setLocal(_74, _77, _73, "rx", 3)
            } else {
                if (sc_uuid != ".ex") {
                    sc_uuid = "." + generate_uuid();
                    _77 = [sc_project + "." + _67 + sc_uuid + "." + _72];
                    var _86 = setLocal(_74, _77, _73, "rx", 3);
                    if (_86) {
                        sc_unique_returning += "&jg=new&rr=" + _72
                    } else {
                        sc_uuid = ".na"
                    }
                }
            }
            if (sc_uuid != "") {
                sc_uuid_q = "&u1=" + sc_uuid.substring(1)
            }
        }
    } catch (e) {
        if (_14) {
            if (typeof encodeURIComponent != "function") {
                encodeURIComponent = function (s) {
                    return escape(s)
                }
            }
            var _88 = "";
            _88 += "unique_returning: " + sc_unique_returning + "\n";
            _88 += "uuid: " + sc_uuid + "\n";
            _88 += "cookie_projects_in: rx" + _76.join("-") + "\n";
            _88 += "cookie_projects_out: rx" + _77.join("-") + "\n";
            for (var _89 in e) {
                _88 += "property: " + _89 + " value: [" + e[_89] + "]\n"
            }
            _88 += "toString(): " + " value: [" + e.toString() + "]\n";
            var _71 = new Image();
            _71.src = "http://statcounter.com/feedback/?email=javascript@statcounter.com&page_url=" + encodeURIComponent(document.location.protocol + "//" + document.location.host + document.location.pathname + document.location.search + document.location.hash) + "&name=Auto%20JS&feedback_username=statcounter&pid=" + sc_project + "&fake_post&user_company&feedback=consistent%20uniques%20js%20exception:%20" + encodeURIComponent(_88)
        }
        sc_unique_returning = "";
        sc_uuid_q = "&u1=f2"
    }
    function _8a(obj, _8c) {
        var _8d = obj.__proto__ || obj.constructor.prototype;
        return (_8c in obj) && (!(_8c in _8d) || _8d[_8c] !== obj[_8c])
    }

    if (Object.prototype.hasOwnProperty) {
        var _8a = function (obj, _8f) {
            return obj.hasOwnProperty(_8f)
        }
    }
    function _sc_strip_tags(_90, _91) {
        _91 = (((_91 || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
        var _92 = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, _93 = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return _90.replace(_93, "").replace(_92, function ($0, $1) {
            return _91.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : ""
        })
    }

    function _sc_validateTags(_96) {
        var _97 = 5;
        var _98 = 1;
        var _99 = 300;
        var _9a = [];
        if (!(_96.length % 2 == 0)) {
            _9a.push("Every tag must have a name and value.")
        } else {
            if (_96.length / 2 > _97) {
                _9a.push("No more than " + _97 + " tags can be passed - " + _96.length / 2 + " passed.")
            }
            for (i = 0; i < _96.length; i++) {
                var _9b = ("" + _96[i]).length;
                if (_9b < _98 || _9b > _99) {
                    _9a.push("Tag names and values must be between " + _98 + " and " + _99 + " characters in length ('" + _96[i] + "' is " + _96[i].length + " characters long).")
                }
            }
            for (i = 0; i < _96.length; i++) {
                if (_sc_strip_tags("" + _96[i]) != "" + _96[i]) {
                    _9a.push("Tag names and values may not contain HTML tags.")
                }
            }
        }
        if (_9a.length != 0) {
            for (i = 0; i < _9a.length; i++) {
            }
            return false
        }
        return true
    }

    function _sc_sanitiseTags(_9c) {
        for (i = 0; i < _9c.length; i++) {
            _9c[i] = ("" + _9c[i]).trim()
        }
        return _9c
    }

    if (Object.prototype.toString.call(_statcounter_pending) === "[object Array]") {
        var _9d = _statcounter_pending.length;
        if (_9d >= 1) {
            if (_8a(_statcounter_pending[0], "tags")) {
                var _9e = [];
                for (var tag in _statcounter_pending[0]["tags"]) {
                    _9e[_9e.length] = tag;
                    _9e[_9e.length] = _statcounter_pending[0]["tags"][tag]
                }
                if (_sc_validateTags(_9e)) {
                    _9e = _sc_sanitiseTags(_9e);
                    for (i = 0; i < _9e.length; i = i + 2) {
                        sc_pageview_tag_string += "&sc_ev_" + encodeURIComponent(_9e[i]) + "=" + encodeURIComponent(_9e[i + 1])
                    }
                }
            }
        }
    }
    sc_base_dir += "&java=1&security=" + sc_security_code + sc_uuid_q;
    var _a0 = sc_unique_returning + "&resolution=" + sc_width + "&h=" + sc_height + "&camefrom=" + escape(sc_referer.substring(0, 600)) + "&u=" + sc_url + "&t=" + sc_title + _6 + "&sc_snum=" + sc_script_num + sc_pageview_tag_string + "&sess=a181b5";
    if (window.sc_counter_width && window.sc_counter_height) {
        sc_counter_size = " width=\"" + sc_counter_width + "\" height=\"" + sc_counter_height + "\""
    }
    if (window.sc_remove_alt) {
        sc_alt_text = ""
    }
    if (sc_error == 1) {
        document.writeln("Code corrupted. Insert fresh copy.")
    } else {
        if (sc_remove == 1) {
        } else {
            sc_send_data()
        }
    }
    function sc_send_data() {
        if (sc_inv == 1 || sc_prerendering == 2) {
            _a0 += "&p=" + sc_prerendering + "&invisible=1";
            if (window.sc_call) {
                sc_call++
            } else {
                sc_call = 1
            }
            var _a1 = false;
            if (sc_uuid != "" && typeof JSON == "object" && JSON && typeof JSON.stringify == "function" && "sessionStorage" in window) {
                _a1 = true
            }
            var _a2 = false;
            if (_a1) {
                try {
                    var _a3 = sessionStorage.getItem("statcounter_pending");
                    if (!_a3) {
                        var _a4 = {}
                    } else {
                        try {
                            var _a4 = JSON.parse(_a3)
                        } catch (ignore) {
                            var _a4 = {}
                        }
                    }
                    if (_a4[sc_project] === undefined) {
                        _a4[sc_project] = {}
                    }
                    var now = new Date().getTime();
                    _a4[sc_project][now] = _a0;
                    while (true) {
                        _a3 = JSON.stringify(_a4);
                        if (_a3 == "{}") {
                            sessionStorage.removeItem("statcounter_pending");
                            break
                        }
                        var _a6 = _a3.split(/:.{20}/).length - 1;
                        if (_a6 < 20) {
                            var _a7 = true;
                            try {
                                sessionStorage.setItem("statcounter_pending", _a3)
                            } catch (e) {
                                if (!e.name || e.name.toLowerCase().replace(/_/g, "").substring(0, 16) !== "quotaexceedederr") {
                                    throw e
                                }
                                _a7 = false
                            }
                            if (_a7) {
                                break
                            }
                        }
                        var _a8 = false;
                        var _a9 = false;
                        var _aa = false;
                        for (var _ab in _a4) {
                            for (var _ac in _a4[_ab]) {
                                var _ad = /jg=(\d+)/.exec(_a4[_ab][_ac]);
                                if (_ad !== null) {
                                    var _ae = parseInt(_ad[1])
                                } else {
                                    var _ae = false
                                }
                                if (_a8 === false || (_ae !== false && _ae < _a8)) {
                                    if (_ae !== false) {
                                        _a8 = _ae
                                    }
                                    _a9 = _ab;
                                    _aa = _ac
                                }
                            }
                        }
                        if (_aa === false) {
                            break
                        }
                        delete _a4[_a9][_aa];
                        if (JSON.stringify(_a4[_a9]) == "{}") {
                            delete _a4[_a9]
                        }
                    }
                    for (var ts in _a4[sc_project]) {
                        (function (_b0, _b1) {
                            var _b2 = _a4[_b1][_b0];
                            _sc_imgs[sc_call + "." + _b0] = new Image();
                            _sc_imgs[sc_call + "." + _b0].onload = function () {
                                var _b3 = JSON.parse(sessionStorage.getItem("statcounter_pending"));
                                delete _b3[_b1][_b0];
                                if (JSON.stringify(_b3[_b1]) == "{}") {
                                    delete _b3[_b1]
                                }
                                var _b4 = JSON.stringify(_b3);
                                if (_b4 == "{}") {
                                    sessionStorage.removeItem("statcounter_pending")
                                } else {
                                    sessionStorage.setItem("statcounter_pending", _b4)
                                }
                            };
                            if (_b0 != now) {
                                _b2 += "&pg=" + Math.round((now - _b0) / 1000)
                            } else {
                                _a2 = true
                            }
                            _sc_imgs[sc_call + "." + _b0].src = sc_base_dir + "&sc_random=" + Math.random() + _b2
                        })(parseInt(ts, 10), sc_project)
                    }
                } catch (e) {
                    if (_14) {
                        if (typeof encodeURIComponent != "function") {
                            encodeURIComponent = function (s) {
                                return escape(s)
                            }
                        }
                        var _b6 = "";
                        for (var _b7 in e) {
                            _b6 += "e[" + _b7 + "]: " + e[_b7] + "\n"
                        }
                        _b6 += "unique_returning: " + sc_unique_returning + "\n";
                        _b6 += "uuid: " + sc_uuid + "\n";
                        _b6 += "toString(): " + " value: [" + e.toString() + "]\n";
                        var _b8 = new Image();
                        _b8.src = "http://statcounter.com/feedback/?email=javascript@statcounter.com&page_url=" + encodeURIComponent(document.location.protocol + "//" + document.location.host + document.location.pathname + document.location.search + document.location.hash) + "&name=Auto%20JS&feedback_username=statcounter&pid=" + sc_project + "&fake_post&user_company&feedback=pending%20exception:%20" + encodeURIComponent(_b6)
                    }
                }
            }
            if (!_a1 || !_a2) {
                _sc_imgs[sc_call] = new Image();
                _sc_imgs[sc_call].src = sc_base_dir + "&sc_random=" + Math.random() + _a0
            }
        } else {
            var _b9 = sc_base_dir + "&sc_random=" + Math.random() + _a0 + "&p=" + sc_prerendering;
            _b9 = _b9.replace(/&/g, "&amp;");
            if (window.sc_text) {
                document.writeln("<scr" + "ipt" + " src=" + _b9 + "&amp;text=" + sc_text + "></scr" + "ipt>")
            } else {
                document.writeln("<span class=\"statcounter\">" + sc_link_back_start + "<img src=\"" + _b9 + "\" alt=\"" + sc_alt_text + "\" border=\"0\"" + sc_counter_size + ">" + sc_link_back_end + "</span>")
            }
        }
    }
})([], 256, 6, 52);
if (sc_cls > 0) {
    if (clickstat_done != 1) {
        var clickstat_done = 1;
        var clickstat_project = window.sc_project;
        var clickstat_security = window.sc_security_code;
        var dlext = "7z|aac|avi|csv|doc|docx|exe|flv|gif|gz|jpe?g|js|mp(3|4|e?g)|mov|pdf|phps|png|ppt|rar|sit|tar|torrent|txt|wma|wmv|xls|xlsx|xml|zip";
        if (typeof (window.sc_download_type) == "string") {
            dlext = window.sc_download_type
        }
        var ltype = "https?|ftp|telnet|ssh|ssl|mailto|spotify|tel";
        var second = "ac|co|gov|ltd|me|mod|net|nic|nhs|org|plc|police|sch|com";
        var dl = new RegExp("\\.(" + dlext + ")$", "i");
        var lnk = new RegExp("^(" + ltype + "):", "i");
        var domsec = new RegExp("^(" + second + ")$", "i");
        var host_name = location.host.replace(/^www\./i, "");
        var host_splitted = host_name.split(".");
        var domain = host_splitted.pop();
        var host_split = host_splitted.pop();
        if (domsec.test(host_split)) {
            domain = host_split + "." + domain;
            host_split = host_splitted.pop()
        }
        domain = host_split + "." + domain;
        var lnklocal_mask = "^https?://(.*)(" + domain + "|webcache.googleusercontent.com)";
        var lnklocal = new RegExp(lnklocal_mask, "i");
        if (document.getElementsByTagName) {
            var anchors = document.getElementsByTagName("a");
            for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                if (anchor.onmousedown) {
                    var original_click = anchor.onmousedown;
                    var s = original_click.toString().split("\n").join(" ");
                    var bs = s.indexOf("{");
                    var head = s.substr(0, bs);
                    var ps = head.indexOf("(");
                    var pe = head.indexOf(")");
                    var params = head.substring(ps + 1, pe);
                    var plist = params.split(",");
                    var body = s.substr(bs + 1, s.length - bs - 2);
                    var insert = "sc_clickstat_call(this,'" + sc_click_dir + "');";
                    var final_body = insert + body;
                    var ev_head = "new Function(";
                    var ev_params = "";
                    var ev_sep = "";
                    for (var sc_i = 0; sc_i < plist.length; sc_i++) {
                        ev_params = ev_sep + "'" + plist[sc_i] + "'";
                        ev_sep = ","
                    }
                    if (ev_sep == ",") {
                        ev_params += ","
                    }
                    var ev_foot = "final_body);";
                    var ev_final = ev_head + ev_params + ev_foot;
                    anchor.onmousedown = eval(ev_final)
                } else {
                    anchor.onmousedown = new Function("event", "sc_clickstat_call(this,'" + sc_click_dir + "');return true;")
                }
            }
        }
        function sc_none() {
            return
        }

        function sc_delay() {
            if (window.sc_click_stat) {
                var d = window.sc_click_stat
            } else {
                var d = 0
            }
            var n = new Date();
            var t = n.getTime() + d;
            while (n.getTime() < t) {
                var n = new Date()
            }
        }

        function sc_clickstat_call(_bd, _be) {
            if (_bd) {
                var _bf = 0;
                if (lnk.test(_bd)) {
                    if ((lnklocal.test(_bd))) {
                        if (dl.test(_bd)) {
                            _bf = 1
                        } else {
                            if (window.sc_exit_link_detect && new RegExp(sc_exit_link_detect, "i").test(_bd)) {
                                _bf = 2
                            } else {
                                if (sc_cls == 2) {
                                    _bf = 2
                                }
                            }
                        }
                    } else {
                        _bf = 2
                    }
                }
                if (_bf != 0) {
                    var _c0 = escape(_bd);
                    if (_c0.length > 0) {
                        if (sc_unique_returning == "") {
                            sc_unique_returning = "&jg=&rr="
                        }
                        if (_bf == 2 && sc_sp != "disabled") {
                            try {
                                sessionStorage.setItem("statcounter_exit_domain", _c0.split("/")[2].replace(/^www\./, ""))
                            } catch (ignore) {
                            }
                        }
                        var _c1 = _be + "click.gif?sc_project=" + clickstat_project + "&security=" + clickstat_security + "&c=" + _c0 + "&m=" + _bf + "&u=" + sc_url + "&t=" + sc_title + "&sess=a181b5&rand=" + Math.random() + sc_uuid_q + sc_unique_returning;
                        var _c2 = new Image();
                        _c2.onload = sc_none;
                        _c2.src = _c1;
                        sc_delay()
                    }
                }
            }
        }

        var sc_gsyn_pattern = "googlesyndication.com|ypn-js.overture.com|ypn-js.ysm.yahoo.com|googleads.g.doubleclick.net";
        var sc_gsyn_pattern2 = "^aswift_[0-9]+$";
        var sc_px;
        var sc_py;

        function sc_adsense_click(_c3) {
            if (_c3.src.match(sc_gsyn_pattern)) {
                var _c4 = escape(_c3.src)
            } else {
                var _c4 = escape("Google Adsense " + _c3.width + "x" + _c3.height)
            }
            var i = new Image();
            var _c6 = sc_click_dir + "click.gif?sc_project=" + clickstat_project + "&security=" + clickstat_security + "&c=" + _c4 + "&m=2&u=" + sc_url + "&t=" + sc_title + "&sess=a181b5&rand=" + Math.random() + sc_uuid_q + sc_unique_returning;
            i.src = _c6;
            sc_delay()
        }

        function sc_adsense_init() {
            if (document.all && typeof window.opera == "undefined") {
                var el = document.getElementsByTagName("iframe");
                for (var i = 0; i < el.length; i++) {
                    if (el[i].src.match(sc_gsyn_pattern) || el[i].id.match(sc_gsyn_pattern2)) {
                        el[i].onfocus = function () {
                            sc_adsense_click(this)
                        }
                    }
                }
            } else {
                if (typeof window.addEventListener != "undefined") {
                    window.addEventListener("unload", sc_exitpage, false);
                    window.addEventListener("mousemove", sc_getmouse, true)
                }
            }
        }

        if (typeof window.addEventListener != "undefined") {
            window.addEventListener("load", sc_adsense_init, false)
        } else {
            if (typeof document.addEventListener != "undefined") {
                document.addEventListener("load", sc_adsense_init, false)
            } else {
                if (typeof window.attachEvent != "undefined") {
                    window.attachEvent("onload", sc_adsense_init)
                } else {
                    if (typeof window.onload == "function") {
                        var sc_existing = onload;
                        window.onload = function () {
                            sc_existing();
                            sc_adsense_init()
                        }
                    } else {
                        window.onload = sc_adsense_init
                    }
                }
            }
        }
        function sc_getmouse(e) {
            if (typeof e.pageX == "number") {
                sc_px = e.pageX;
                sc_py = e.pageY
            } else {
                if (typeof e.clientX == "number") {
                    sc_px = e.clientX;
                    sc_py = e.clientY;
                    if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                        sc_px += document.body.scrollLeft;
                        sc_py += document.body.scrollTop
                    } else {
                        if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                            sc_px += document.documentElement.scrollLeft;
                            sc_py += document.documentElement.scrollTop
                        }
                    }
                }
            }
        }

        function sc_findy(obj) {
            var y = 0;
            while (obj) {
                y += obj.offsetTop;
                obj = obj.offsetParent
            }
            return (y)
        }

        function sc_findx(obj) {
            var x = 0;
            while (obj) {
                x += obj.offsetLeft;
                obj = obj.offsetParent
            }
            return (x)
        }

        function sc_exitpage(e) {
            ad = document.getElementsByTagName("iframe");
            if (typeof sc_px == "undefined") {
                return
            }
            for (var i = 0; i < ad.length; i++) {
                var _d0 = sc_findx(ad[i]);
                var _d1 = sc_findy(ad[i]);
                var adW = parseInt(_d0, 10) + parseInt(ad[i].width, 10) + 15;
                var adH = parseInt(_d1, 10) + parseInt(ad[i].height, 10) + 10;
                var _d4 = (sc_px > (_d0 - 10) && sc_px < adW);
                var _d5 = (sc_py > (_d1 - 10) && sc_py < adH);
                if (_d5 && _d4) {
                    if (ad[i].src.match(sc_gsyn_pattern) || ad[i].id.match(sc_gsyn_pattern2)) {
                        sc_adsense_click(ad[i])
                    }
                }
            }
        }
    }
}