// ==UserScript==
// @name         假期研修
// @description  模拟点击，挂机完成页面的所有任务点
// @namespace    http://tampermonkey.net/
// @author       Guitar
// @version      2025-07-25
// @updateURL    https://pages.274452.xyz/js/teacherTraining.js
// @downloadURL  https://pages.274452.xyz/js/teacherTraining.js
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 监听器拦截
     * @param {Array<string>} types
     */
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

    // 1. 展开所有的研修任务点（一级）
    domQueryPromise("div.fish-collapse-header").then((taskGroups => {
        taskGroups.forEach(e => e.click())

        // 2. 获取所有的研修任务点和起始下标
        const tasks = Array.from(document.querySelectorAll("div.resource-item.resource-item-train"))
        console.log("获取到任务点个数：", tasks.length);

        // let i = tasks.indexOf(document.querySelector("div.resource-item.resource-item-train.resource-item-active"))
        let i = tasks.findIndex(e => !isTaskFinished(e))
        if (i == -1) {
            console.log("所有任务点均已完成");
            return
        }

        console.log(`第一个未完成的任务是第 ${i+1} 个`);
        changeToTask(i)

        // 3. 开始挂机
        playVideo()


        function isTaskFinished(task) {
            return true && task.querySelector("i.icon_checkbox_fill")
        }

        function changeToTask(i) {
            tasks[i].click()
            console.log(`切换至任务 ${i+1}`);
            playVideo()
        }

        function playVideo() {
            domQueryPromise("div.fish-modal-confirm-btns > button.fish-btn.fish-btn-primary").then(e => {
                e.click()
                console.log("点击弹窗 我知道了");
            })

            domQueryPromise("video").then(video => {
                console.log(`自动播放视频，总时长 ${Math.floor(video.duration / 60)} min`);

                // 自动静音、倍速、播放
                video.muted = true;
                // video.playbackRate = 2.0;
                video.play();

                // 避免过载监听器
                if (!video.AUTO) {
                    // 添加 'pause' 事件监听器
                    video.addEventListener('pause', function () {
                        console.log("监测到暂停，自动继续播放");
                        playVideo();
                    });

                    // 播放完毕时执行回调
                    video.addEventListener('ended', () => {
                        debugger
                        // 当前正在学习的任务点
                        if (i <= tasks.length - 1) {
                            // switch task to next
                            changeToTask(++i)
                        } else {
                            console.log("全部任务都学习完毕");
                        }
                    });
                    video.AUTO = true
                }
            })
        }
    }))
})();