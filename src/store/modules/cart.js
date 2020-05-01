 
const state = {
    bind: {
         app: true, 
        //  clipped: true,
         class: "bg",
        //  dark: true,
         value: false
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
    mutations,
    actions: {
        'open' ({ commit, state }, payload = {}) {
            let { input } = payload
            if (payload.input)
                delete payload.input
            commit('update', {
                value: true,
                input: evt => {
                    if (typeof input === 'function')
                        input(evt)
                    commit('update', { value: evt })
                },
                ...payload
            })
            
        },
        'close' ({ commit }) {
            commit('update', { value: false })
        },
        'toggle' ({ dispatch, state }, payload) {
            state.bind.value ? dispatch('close') : dispatch('open', payload)
        }
    }
}