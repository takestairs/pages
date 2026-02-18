// ==UserScript==
// @name         人教师苑
// @description  自动跳转视频最后一秒
// @namespace    http://tampermonkey.net/
// @author       Guitar
// @version      2025-05-09
// @updateURL    https://pages.535952.xyz/js/pecec.js
// @downloadURL  https://pages.535952.xyz/js/pecec.js
// @match        https://sy.pecec.com.cn/p/t_pc/course_pc_detail/video/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sy.pecec.com.cn
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


    // domQueryPromise("video").then(v => v.dispatchEvent(new Event("ended")))
    domQueryPromise("video").then(video => {
        // 自动静音、倍速、播放
        video.muted = true;
        // video.playbackRate = 2.0;
        video.play();

        const t = setInterval(() => {
            const skip = video.duration - 1
            if (skip) {
                console.log("current", video.currentTime)
                if (video.currentTime >= skip) {
                    clearInterval(t)
                } else {
                    video.currentTime = skip
                }
            }
        }, 1000)
    })
})();