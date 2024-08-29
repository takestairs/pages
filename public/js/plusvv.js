// ==UserScript==
// @name         Plus-VV
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @updateURL    https://pages.274452.xyz/js/plusvv.js
// @downloadURL  https://pages.274452.xyz/js/plusvv.js
// @description  Get the token to login
// @author       Guitar
// @match        https://plus.aivvm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aivvm.com
// @grant        none
// ==/UserScript==

(async function () {
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

    const LOGIN = "https://plus.aivvm.com/auth/login_share?token=";
    // 获取URL数组（假设您的数组名为urls）
    const tokens = await fetch("https://api.274452.xyz/upstash/plus").then(r => r.json())
    console.log(tokens);
    tokens.unshift("-------")

    // 创建下拉菜单
    const selectElement = document.createElement('select');
    selectElement.innerHTML = tokens.map(token => `<option value="${token}">${token.slice("-7")}</option>`).join('');

    // 为下拉菜单添加事件监听器
    selectElement.addEventListener('change', (event) => {
        // 获取选中选项的值
        const selectedUrl = event.target.value;

        // 跳转到对应的URL
        window.location.href = LOGIN + selectedUrl;
    });

    if (document.location.href.startsWith("https://plus.aivvm.com/auth/login_auth0")) {
        selectElement.className = "c2722e13e cb5eb711c c23b439c3";
        domQueryPromise("#submit-token").then(submitTokenElement => {
            // 获取父元素
            var parentElement = submitTokenElement.parentNode;
            // 将新元素插入到 "submit-token" 元素之后
            parentElement.appendChild(selectElement)
        })

    } else {
        selectElement.className = "group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 text-lg font-semibold text-token-text-secondary overflow-hidden whitespace-nowrap bg-token-main-surface-secondary radix-state-open:bg-token-main-surface-secondary"
        domQueryPromise("div.flex-1.overflow-hidden > div > div.absolute.left-0.right-0 > div > div.absolute").then(e => e.appendChild(selectElement))
    }
})();