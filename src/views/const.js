import { ref, watch } from "vue"

const auth = ref("")
watch(auth, (n) => localStorage.setItem("auth", n))

export { auth }