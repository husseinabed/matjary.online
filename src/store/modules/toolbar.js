 
const state = {
    bind: {
         app: true, 
         flat: true,
         color: "primary",
         dark: true,
         clippedLeft: true,
         extended: false
    },
    on: {}
}
const getPropsAndEvents = (payload) => {
       const on = {}
       const bind = {}
       Object.keys(payload).forEach((name) => {
           const prop = payload[name]
           if (typeof prop === 'function') {
               on[name] = prop
           } else {
               bind[name] = prop
           }
       })
       return { bind, on }
}

const mutations = {
    'update' (state, payload) {
        const { bind, on } = getPropsAndEvents(payload)
        state.bind = Object.assign(state.bind, bind)
        state.on = Object.assign(state.bind, on)
    },
    'props' (state, payload) {
        const { bind, on } = getPropsAndEvents(payload)
        state.bind = bind
        state.on = on
    }
 
} 
export default {
    namespaced: true,
    state,
    mutations
}