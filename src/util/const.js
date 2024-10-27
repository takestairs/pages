import { makeRefWithLocalStorge } from "./ReactiveUtil"


const auth = makeRefWithLocalStorge("", "auth")
const isAsideCollapse = makeRefWithLocalStorge(false, "isAsideCollapse")

export { auth, isAsideCollapse }