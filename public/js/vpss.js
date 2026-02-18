// ==UserScript==
// @name         VPS-s
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @updateURL    https://pages.535952.xyz/js/vpss.js
// @downloadURL  https://pages.535952.xyz/js/vpss.js
// @description  自动填写表单
// @author       You
// @match        https://hax.co.id/create-vps/
// @match        https://woiden.id/create-vps/
// @match        https://free.vps.vc/create-vps
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const pwd = "DjU0qrN35RL4an7"

    const osMap = {
        "https://hax.co.id/create-vps/": 3,
        "https://woiden.id/create-vps/": 4,
        "https://free.vps.vc/create-vps": 2
    }
    function checkObj(selector, fn, refresh) {
        if (!refresh) refresh = 1000

        let t = setInterval(function () {
            //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
            let obj = document.querySelector(selector); //声明要查询的对象
            if (obj) {
                //判断对象是否存在，存在则开始设置值
                fn(obj);
                clearInterval(t); //清除循环定时器
            }
        }, refresh);
    }
    checkObj("#datacenter", (e) => e.selectedIndex = 1)
    checkObj("#os", (e) => e.selectedIndex = osMap[document.location.href])
    checkObj("#password", (e) => e.value = pwd)
    checkObj("#purpose", (e) => e.selectedIndex = 1)
    checkObj(".form-check-input", () => $(".form-check-input").click())

})();