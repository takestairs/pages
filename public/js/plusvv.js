// ==UserScript==
// @name         Plus-VV
// @namespace    http://tampermonkey.net/
// @version      2024-07-21
// @description  try to take over the world!
// @author       Guitar
// @match        https://plus.aivvm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aivvm.com
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';
    function dolater(selector, fn, refresh = 1000) {
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

    // 获取URL数组（假设您的数组名为urls）
    // const urls = ['https://plus.aivvm.com/auth/login_share?token=fk-Ik9aEx8_gbUjN2bipels0KzZbbBW8u2C5cnCQO24tjg', 'https://www.google.com', 'https://www.github.com'];
    const urls = await fetch("https://api.274452.xyz/upstash/plus").then(r => r.json())
    console.log(urls);
    urls.unshift("-------")

    // 创建下拉菜单
    const selectElement = document.createElement('select');
    selectElement.innerHTML = urls.map(url => `<option value="${url}">${url.slice("-7")}</option>`).join('');

    // 为下拉菜单添加事件监听器
    selectElement.addEventListener('change', (event) => {
        // 获取选中选项的值
        const selectedUrl = event.target.value;

        // 跳转到对应的URL
        window.location.href = selectedUrl;
    });

    if (document.location.href === "https://plus.aivvm.com/auth/login_auth0") {
        selectElement.className = "c2722e13e cb5eb711c c23b439c3";
        dolater("#submit-token", (submitTokenElement) => {
            // 获取父元素
            var parentElement = submitTokenElement.parentNode;
            // 将新元素插入到 "submit-token" 元素之后
            parentElement.appendChild(selectElement)
        })

    } else {
        selectElement.className = "group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 text-lg font-semibold text-token-text-secondary overflow-hidden whitespace-nowrap bg-token-main-surface-secondary radix-state-open:bg-token-main-surface-secondary"
        dolater("div.flex-1.overflow-hidden > div > div.absolute.left-0.right-0 > div > div.absolute", (e) => e.appendChild(selectElement))
    }
})();