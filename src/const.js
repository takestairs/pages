import { makeRefWithLocalStorge } from "./util/reactiveUtil"


const auth = makeRefWithLocalStorge("", "auth")
const isAsideCollapse = makeRefWithLocalStorge(false, "isAsideCollapse")

export { auth, isAsideCollapse }