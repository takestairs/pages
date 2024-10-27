import { makeRefWithLocalStorge } from "./reactiveUtil"


const auth = makeRefWithLocalStorge("", "auth")
const isAsideCollapse = makeRefWithLocalStorge(false, "isAsideCollapse")

export { auth, isAsideCollapse }