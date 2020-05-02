 
export default {
    namespaced: true,
    state: {
        text: '',
        value: false,
        absolute: false,
        autoHeight: false,
        x: 'center',
        y: 'top',
        timeout: 6000,
        mode: 'multi-line',
        color: 'error'
    },
    mutations: {
        text (state, payload) {
            state.text = payload
        },
        value(state, payload) {
            state.value = payload
        },
        absolute(state, payload) {
            state.absolute = payload
        },
        autoHeight(state, payload) {
            state.autoHeight = payload
        },
        x(state, payload) {
            state.x = payload
        },
        y(state, payload) {
            state.y = payload
        },
        timeout(state, payload) {
            state.timeout = payload
        },
        mode(state, payload) {
            state.mode = payload
        },
        color(state, payload) {
            state.color = payload
        }
    },
    actions: {
        open ({ commit }, payload) {
            let [text,color] = payload
            commit('color', color)
            commit('text', text)
            commit('value', true)
        },
        close ({ commit }) {
            console.log('closed');
            
            commit('value', false)
            commit('text', '')
            commit('color', 'error')
        }
    }
   
}