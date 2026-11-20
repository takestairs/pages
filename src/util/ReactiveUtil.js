import { onMounted, reactive, ref, watch } from "vue"

/**
 * 响应式联合本地存储，如果本地已有该键，则使用本地值
 * @param {*} value 
 * @param {string} name
 */
export function makeRefWithLocalStorge(value, name) {
    const r = ref(value)
    const i = localStorage.getItem(name)
    if (name && i) {
        r.value = JSON.parse(i)
    }
    if (name) {
        watch(r, n => localStorage.setItem(name, JSON.stringify(n)))
    }
    return r
}

export const globleStatus = reactive(new Map());
/**
 * 缓存 promise，当 promise 兑现时，会触发status的响应式。
 * 需要响应式的地方： {{ globleStatus.get(name) }}
 * 提供 promise：setStatus(name, promise)
 * @param {Promise<string> | Function} provider 
 */
export function setGlobleStatus(name, provider) {
    if (provider instanceof Promise) {
        globleStatus.set(name, "waiting")
        provider.then(v => {
            globleStatus.set(name, v)
        })
    } else if (provider instanceof Function) {
        setStatus(name, provider())
    } else {
        globleStatus.set(name, provider)
    }
}