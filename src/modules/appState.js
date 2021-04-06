
import { reactive, toRefs } from "vue";


const stateObj = {
    appLoading: false,
    sessionMounted: false,
    logSession: null,
    logSession_fb_me: null,
    logSession_fb_picture: null,
}
const state = reactive(stateObj);
const stateRefs = {
    ...toRefs(state)
}
//let initialized = false

export default function appState() {
    return stateRefs
}