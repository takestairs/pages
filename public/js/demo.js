/**
 * console 输出代理控制 对象，只给往终端输出信息的函数加锁，其他函数不加锁
 */
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

/**
     * 监听器拦截，立即运行函数，配合 @run-at document-start
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

/**
 * 轻量Toast通知系统
 * Toast.info('')
 * Toast.success('')
 * Toast.error('')
 * Toast.warn('')
 */
const Toast = {
    container: null,

    init() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.top = '15px';
        this.container.style.right = '15px';
        this.container.style.zIndex = '999999';
        this.container.style.maxWidth = '90%';
        document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 3000) {
        this.init();

        const toast = document.createElement('div');
        toast.style.padding = '10px 15px';
        toast.style.marginBottom = '10px';
        toast.style.borderRadius = '4px';
        toast.style.color = 'white';
        toast.style.backgroundColor = type === 'error' ? '#e74c3c' :
            type === 'success' ? '#2ecc71' :
                type === 'warning' ? '#f39c12' : '#3498db';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.transition = 'opacity 0.3s';
        toast.style.overflow = 'hidden';
        toast.style.textOverflow = 'ellipsis';
        toast.style.whiteSpace = 'nowrap';

        toast.textContent = message;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, duration);
    },
    // 便捷方法
    info(msg, dur) { this.show(msg, 'info', dur); },
    success(msg, dur) { this.show(msg, 'success', dur); },
    error(msg, dur) { this.show(msg, 'error', dur); },
    warn(msg, dur) { this.show(msg, 'warning', dur); }
}