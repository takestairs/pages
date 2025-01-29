import { reactive } from "vue";
import { makeRefWithLocalStorge } from "../util/ReactiveUtil"


const auth = makeRefWithLocalStorge("", "auth")
const isAsideCollapse = makeRefWithLocalStorge(false, "isAsideCollapse")


const globleStatus = reactive(new Map());
/**
 * 缓存 promise，当 promise 兑现时，会触发status的响应式。
 * 需要响应式的地方： {{ globleStatus.get(name) }}
 * 提供 promise：setStatus(name, promise)
 * @param {Promise<string> | Function} provider 
 */
function setStatus(name, provider) {
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

export { auth, isAsideCollapse, globleStatus as status, setStatus }