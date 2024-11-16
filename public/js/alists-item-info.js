// ==UserScript==
// @name         Alist Item Info
// @namespace    http://tampermonkey.net/
// @version      2024-11-16
// @description  try to take over the world!
// @author       You
// @match        http://192.168.31.33:5244/*
// @match        https://alist.274452.xyz:5255/*
// @icon         https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    /**
     * 异步检查dom元素，返回promise。当只匹配到1个dom元素时，兑现这个dom元素。匹配多个dom是返回List。
     * 如果保证selector一定能匹配，则不要给timeout参数。
     * @param {string} selector 
     * @param {ParentNode} parentDom
     * @param {number} refresh 
     * @param {number} timeout 
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

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('路径变更, 重新添加侦听器...');
                main()
            }
        }
    });

    domQueryPromise("#root > div > div > nav > ol").then(ol => {
        // 传入目标节点和观察选项
        observer.observe(ol, { attributes: false, childList: true, subtree: false });
        console.log("开始监听路径变化...");
    })

    function countSelected(items) {
        let c = 0
        for (let item of items) {
            if (item.querySelector("input[type=checkbox]").checked) c++
        }
        return c
    }
    function main() {
        Promise.all([
            domQueryPromise("#root > div > div > div > div.list"),
            domQueryPromise("#root > div > div > div > div > div.title > div > p")
        ]).then(([list, p]) => {
            const items = list.querySelectorAll("div.list > div:not(.title)")
            p.innerText = `Name (0/${items.length})`

            // 创建一个观察器实例并传入回调函数
            new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        console.log('加载更多项目, 重新添加侦听器...');
                        main()
                    }
                }
            }).observe(list, { attributes: false, childList: true, subtree: false });


            list.addEventListener("change", (e) => {
                p.innerText = `Name (${countSelected(items)}/${items.length})`
            })
            console.log("侦听器添加完毕");
        })
    }
    console.log("初始化添加侦听器...");
    main()
})();