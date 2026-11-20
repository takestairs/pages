import { reactive, ref } from "vue";
import { makeRefWithLocalStorge } from "../util/ReactiveUtil"

// const apiPrefix = "http://127.0.0.1:8787"
const apiPrefix = "https://api.535952.xyz"

const auth = makeRefWithLocalStorge("", "auth")
const isAsideCollapse = makeRefWithLocalStorge(false, "isAsideCollapse")


export { apiPrefix, auth, isAsideCollapse }