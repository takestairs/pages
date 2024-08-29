import { reactive, ref, watch } from "vue"

const auth = ref("")
watch(auth, (n) => localStorage.setItem("auth", n))

export { auth }

/**
 * 响应式联合本地存储，配合 onMounted() 完成值初始化
 * @param {string} value 
 * @param {string} name 
 */
export function makeRefWithLocalStorge(value, name) {
    const r = ref(value)
    if (name) {
        watch(r, n => localStorage.setItem(name, n))
    }
    return r
}