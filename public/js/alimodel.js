// ==UserScript==
// @name         百炼模型
// @description  自动获取当前页面百炼模型的具有免费额度的所有模型
// @namespace    http://tampermonkey.net/
// @author       Guitar
// @version      2025-05-26
// @match        https://bailian.console.aliyun.com/?tab=model
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @run-at       document-end
// ==/UserScript==


(function () {
    'use strict';

    const rows = document.querySelectorAll("tr.efm_ant-table-row.efm_ant-table-row-level-1")
    const freeModels = []
    for (let row of rows) {
        const tds = row.querySelectorAll("td")
        const model = tds[1].innerText
        const desc = tds[6].innerText
        if (desc != "无免费额度") {
            const free = parseInt(desc.split("\n")[0])
            if (free <= 10) {
                console.warn(model, `${free}%`)
            }
            freeModels.push(model)
        }
    }
    console.log(freeModels);
})();