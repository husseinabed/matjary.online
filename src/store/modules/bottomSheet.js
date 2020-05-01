

const state = {
    metadata: {

    },
    bind: {
        value: false,
        maxWidth: 360,
        persistent: false,
        backFromNew: null
    },
    on:{}
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
    'metadata' (state, payload) {
        state.metadata = payload
    },
    'update' (state, payload) {
        const { bind, on } = getPropsAndEvents(payload)
        state.bind = Object.assign(state.bind, bind)
        state.on = Object.assign(state.on, on)
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
    mutations: mutations,
    actions: {
        'open' ({ state, commit }, payload = {}) {
            commit('metadata', {})
            let { input } = payload
            if (payload.input)
                delete payload.input
                
            commit('props', {
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
            commit('props', { persistent: false, value: false, backFromNew: null })
        }
    }
}