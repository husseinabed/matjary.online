

const dialog = {
    metadata: {

    },
    bind: {
        value: false,
        maxWidth: 360,
        persistent: false
    },
    on:{}
}
const component= {
    metadata: {

    },
    bind: {
        is: 'default'
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
    state: dialog,
    modules: {
        component: {
            namespaced: true,
            state: component,
            mutations: mutations
        } 
    },
    mutations: mutations,
    actions: {
        'open' ({ commit }, payload = {}) {
            commit('metadata', {})
            let { component, input } = payload
            if (typeof component === 'string')
                component = { is: component }
            
            if (payload.component)
                delete payload.component
            
            if (payload.input)
                delete payload.input

            commit('component/props', component)
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
        
            commit('update', { persistent: false, value: false })
            setTimeout(() => commit('component/update', { is: 'default' }), 300)
            
        }
    }
}