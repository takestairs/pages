// ==UserScript==
// @name         test on pages
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  try to take over the world!
// @author       Guitar
// @match        https://pages.274452.xyz
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // console 输出代理控制 对象，只给往终端输出信息的函数加锁
    const console = (function () {
        // 输出控制key
        const CONSOLE_KEY = {}
        const lockProperties = ["log", "warn", "debug", "error", "info", "dir", "table"]

        // 函数锁代理
        const lockConsoleProxy = new Proxy(window.console, {
            get(target, property) {
                if (lockProperties.includes(property) && target[property] instanceof Function) {
                    return function (k, ...args) {
                        if (k === CONSOLE_KEY) {
                            target[property](...args)
                        }
                    }
                } else {
                    return target[property]
                }
            }
        })
        window.console = lockConsoleProxy

        return new Proxy(window.console, {
            get(target, property) {
                if (lockProperties.includes(property) && target[property] instanceof Function) {
                    return function (...args) { return target[property](CONSOLE_KEY, ...args) }
                } else {
                    return target[property]
                }
            }
        })
    })();

    // 监听器拦截
    (function (types) {
        const oldadd = EventTarget.prototype.addEventListener
        EventTarget.prototype.addEventListener = function (...args) {
            // console.log('addEventListener', ...args)

            // 劫持指定的监听类型
            if (args.length !== 0 && types.includes(args[0])) {
                console.log(`劫持${args[0]}成功`)
                return;
            }

            oldadd.call(this, ...args)
        }
    })(['visibilitychange']);

    /**
     * 异步检查dom元素，返回promise。当只匹配到1个dom元素时，兑现这个dom元素。匹配多个dom是返回List。
     * 如果保证selector一定能匹配，则不要给timeout参数。
     * @param {string} selector 
     * @param {number} refresh 
     * @param {number} timeout 
     * @returns {Promise<NodeListOf<Element> | Element>}
     */
    async function domQueryPromise(selector, timeout, refresh = 1000) {
        return new Promise((resolve, reject) => {
            let t = setInterval(() => {
                let obj = document.querySelectorAll(selector);
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
})();