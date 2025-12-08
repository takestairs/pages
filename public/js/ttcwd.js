// ==UserScript==
// @name         ttcdw
// @description  模拟点击，挂机完成页面的所有任务点
// @namespace    http://tampermonkey.net/
// @author       Guitar
// @version      2025-12-08
// @updateURL    https://pages.274452.xyz/js/ttcdw.js
// @downloadURL  https://pages.274452.xyz/js/ttcdw.js
// @match        https://www.ttcdw.cn/p/course/videorevision/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.ttcdw.cn
// ==/UserScript==

(function () {
    'use strict';
    /**
     * 异步检查dom元素，返回promise。当只匹配到1个dom元素时，兑现这个dom元素。匹配多个dom时返回List。
     * 如果保证selector一定能匹配，则不要给timeout参数。
     * @param {string} selector 
     * @param {ParentNode} [parentDom] 默认为 document
     * @param {number} [timeout]
     * @param {number} [refresh] 
     * @returns {Promise<NodeListOf<Element> | Element>}
     */
    async function domQueryPromise(selector, parentDom, timeout, refresh = 1000) {
        return new Promise((resolve, reject) => {
            let t = setInterval(() => {
                let obj = parentDom ? parentDom.querySelectorAll(selector) : document.querySelectorAll(selector);
                if (obj.length > 0) {
                    clearInterval(t); // 清除循环定时器
                    resolve(obj.length == 1 ? obj[0] : obj); // 兑现 Promise，并提供找到的 DOM 元素
                }
            }, refresh);

            // 可选：设定一个超时定时器，如果在一定时间内未找到对象，可以拒绝（reject）Promise
            if (timeout && timeout > 0) {
                setTimeout(() => {
                    clearInterval(t);
                    reject(new Error("Element not found within the expected time frame."));
                }, timeout); // maxWaitTime 必须定义为最大等待时间（毫秒）
            }
        });
    }

    let unfinishList = []
    let unfinishIndex = -1
    function changeToNextUnfinished() {
        if (unfinishIndex < unfinishList.length - 1) {
            console.log(`切换至 ${unfinishList[++unfinishIndex].querySelector("div.videorevision-catalogue-single-name.ellipsis").textContent}`);

            unfinishList[unfinishIndex].click()
            domQueryPromise("video").then(applyVideoSettings)
        }
        return false
    }
    function applyVideoSettings(v) {
        v.muted = true
        v.addEventListener("playing", () => {
            v.playbackRate = 2.0
        })
        // v.play()
        v.addEventListener("ended", changeToNextUnfinished)
        console.log("Applied.");
    }

    domQueryPromise("div.videorevision-catalogue-single").then(list => {
        for (let video of list) {
            if (video.querySelector("span.videorevision-catalogue-single-progress-text").textContent != "100%") {
                unfinishList.push(video)
            }
        }
        debugger
        console.log(unfinishList);

        changeToNextUnfinished()
    })
})()