import axios from 'axios'
import OAuth from "oauth-1.0a";
import CryptoJS from "crypto-js";
const paramToJson = (data) => JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
const JsonToparam = (data) => Object.keys(data).map(function (k) {
  return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
}).join('&')
const initOAuth = () =>  
OAuth({
    consumer: {
        key: 'WKLRIwwuvb00',
        secret: 'EE0lrdCmIeLXe0LWclOAoN12g9kLuMOjALW69775ATa8I97q',
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64)
    },
})
const oauth_callback = 'https://10.0.0.17:8888/login'
// import io from 'socket.io-client';
// import ls from "local-storage"


const user = null //localStorage.getItem('user')
const token = {
    key: null,
    secret: null
} //localStorage.getItem('token')
const server = process.env.NODE_ENV === 'production' ? '/' : 'https://' + location.hostname + ':8080/'

const fetch = axios.create({
    baseURL: server + 'api',
    headers: {
        "Content-Type": "application/json",
    }
})
// sync with localstorage
const authState = {
    user,
    token,
    loading: false,
    error: null,
}

export default {
    namespaced: true,
    state: {
        fetch,
        connected: false,
        ready: false,
        socket: null,
        error: null
    },
    mutations: {
       socket(state, payload) {
           state.socket = payload
       },
       ready (state, payload) {
            state.ready = payload
       },
       connected(state, payload) {
            state.connected = payload
       },
       error (state, payload) {
            state.error = payload
       }
    },
    actions:{
        // socket ({ state, commit, dispatch }, payload) {
        //     const { token, user } = payload
        //     if (state.socket && state.connected) return 

        //     if (!token) {
        //         throw new Error('io/soket must receive "token"')
        //     }
        //     const socket = io(server, {/*secure: true,*/ query: `token=${token}&uid=${user.id}`})
        //     socket.on('connect', () => {
        //         commit('connected', true)
        //     })
        //     socket.on('disconnect', () => {
        //         commit('connected', false)
        //     })
        //     socket.on('ready', () => {
        //         commit('ready', true)
        //     })
        //     socket.on('_error', error => commit('error', error))
        //     socket.on('error', error => commit('error', error))
        //     commit('socket', socket)
        // },
        // on ({ state }, payload) {
        //     const [ method, callback ]  = payload
        //     if(state.socket)
        //         state.socket.on(method, callback)
        // },
        // off ({ state }, method) {
        //     if (state.socket)
        //         if (typeof method == 'string')
        //             state.socket.off(method)
        //         else method.forEach(element => {
        //                 state.socket.off(element)
        //         });
        // },
        // emit ({ state }, payload) {
        //     const [ method, data ]  = payload
        //     console.log(method, data)
        //     if(state.socket)
        //         state.socket.emit(method, data)
        // },
        async get ({ state, commit }, payload) {
            const url = typeof payload == 'string' ? payload : payload.url
            const options = payload.options || {}
            if (!url) return commit('error', 'no URL has been supplied to io/get action')
            const response = await axios.get(url, options).catch(e => commit('error', e))
            return response
        },
        async post ({ state, commit }, payload) {
            const [url, data, options] = payload
    

            const response = await state.fetch.post(url, data, options)
            // .catch(e => commit('error', e))
            return response
        },
        async put ({ state, commit }, payload) {
            const [url, data] = payload
            const response = await state.fetch.put(url, data).catch(e => commit('error', e))
            return response
        },
        async delete ({ state, commit }, payload) {
            const [url, data] = payload
            const response = await state.fetch.delete(url, data).catch(e => commit('error', e))
            return response
        }   
    },
    modules: {
        auth: {
            namespaced: true,
            state:authState,
            getters: {
                isAuthenticated (state) {
                    return !!state.user && !!state.token.key && !!state.token.secret
                }
            },
            mutations: {
                user (state, payload) {
                    state.user = payload
                },
                authHeader (state, payload) {
                  state.authHeader = payload
                },
                loading (state, payload) {
                    state.loading = payload
                },
                token(state, payload) {
                    state.token.key = payload
                },
                secret (state, payload) {
                    state.token.secret = payload
                },
                error (state, payload) {
                    state.error = payload
                }
            },
            actions: {
                async authorize ({ commit, dispatch }) {
                    commit('loading', true)
                    const oauth = initOAuth()
                    const request_data = {
                          url: 'https://matjary.online/oauth1/request',
                          method: 'GET',
                          data: {
                            oauth_callback
                          },
                    }
                    const headers = oauth.toHeader(oauth.authorize(request_data));
                    const res = await axios.get(request_data.url, { headers }).catch(e => commit('error', e))
                    commit('secret', paramToJson(res.data).oauth_token_secret);
                    window.location.href = 'https://matjary.online/oauth1/authorize?' + res.data
                },
                async access ({ commit, state, dispatch }, payload) {
                    const oauth = initOAuth()
                    const { oauth_token, oauth_verifier } = payload;
                    const oauth_token_secret = state.token.secret
                    commit('token', oauth_token)// save temp token to state
                    
                    commit('loading', true)
                    const request_data = {
                       url: 'https://matjary.online/oauth1/access',
                       method: 'GET',
                       data: {
                        oauth_verifier,
                        oauth_callback
                       }
                    }
                    const headers = oauth.toHeader(oauth.authorize(request_data, state.token))
                    const res = await axios.get(request_data.url, { headers }).catch(e => commit('error', e))
                    const token = paramToJson(res.data)
                    // save auth token to state                    
                    commit('token', token.oauth_token);
                    commit('secret', token.oauth_token_secret);
                    await dispatch('currentUser')
                    commit('loading', false)
                    
                    // window.location.href = '/' //check main.js for watching isAuthintecated changes
                    
                },
                async currentUser ({ state, commit }) {
                    const oauth = initOAuth()

                     // get curent user
                     const request_user_data = {
                       url: 'https://matjary.online/wp-json/wp/v2/users/me',
                       method: 'GET'
                     }
                    const user = await axios.get(request_user_data.url, {
                      headers: oauth.toHeader(oauth.authorize(request_user_data, state.token))
                    }).catch(e => commit('error', e))
                    await commit('user', user.data)
                    return user.data
                },
                logout ({ commit }) {
                    commit('error', null)
                    commit('user', null)
                    commit('token', null)
                    commit('secret', null)
                }
            }
        },
        api: {
            namespaced: true,
            actions: {
                async getStoresList({ dispatch }, payload)  {
                    return await dispatch('io/get', 'https://matjary.online/wp-json/wcfmmp/v1/vendors-list', {
                      root: true
                    })
                },
                async getStore({ dispatch, commit, rootState }, payload)  {
                    if (!payload) return commit('io/error', 'no payload has been supplied to io/api/getStore action', {
                      root: true
                    })
                    const slug = typeof payload == 'string' ? payload : payload.slug
                    if (!slug) return commit('io/error', 'no slug has been supplied to io/api/getStore action', {
                      root: true
                    })
                    const user_id = rootState.io.auth.user ? rootState.io.auth.user.id : null
                    return await dispatch('io/get', 'https://matjary.online/wp-json/wcfmmp/v1/vendor-store/' + slug + '?user_id=' + user_id, {
                      root: true
                    })
                },
                async getVendorProducts({ dispatch, commit, rootState }, payload) {
                    if (!payload) return commit('io/error', 'no payload has been supplied to io/api/getVendorProducts action', {
                        root: true
                    })
                    const id = typeof payload == 'string' ? payload : payload.vendor_id
                    if (!id) return commit('io/error', 'no vendor_id has been supplied to io/api/getVendorProducts action', {
                        root: true
                    })
                    // const user_id = rootState.io.auth.user ? rootState.io.auth.user.id : null
                    return await dispatch('io/get', 'https://matjary.online/wp-json/wcfmmp/v1/products/?id=' + id, {
                        root: true
                    })
                },
                async sendEnquery({ commit, dispatch, rootState  }, payload) {
                    const oauth = initOAuth()
                    console.log(payload)
                    const { vendor, message, product } = payload
                    if (vendor === undefined || message === undefined) return commit('io/error', 'one of this args "vendor || message" is missing in io/api/sendEnquery action', {
                        root: true
                    })
                    // get curent user
                    const request_data = {
                      url: 'https://matjary.online/wp-json/wcfmmp/v1/customer-enquiry/',
                      method: 'GET',
                      data:{
                        vendor_id: vendor,
                        product_id: product,
                        enquiry: message
                      }
                    }
                    return await dispatch('io/get', {
                          url: request_data.url + '?' + JsonToparam(request_data.data),
                          options:{
                              headers: oauth.toHeader(oauth.authorize(request_data, rootState.io.auth.token))
                          }
                        }, {
                      root: true
                    })
                },
                async followVendor({ commit, dispatch, rootState  }, payload) {
                    const oauth = initOAuth()

                    const { vendor, user, follow, count } = payload
                    if (!vendor || !user ) return commit('io/error', 'one of this args "vendor || user" is missing in io/api/followVendor action', {
                        root: true
                    })
                    // get curent user
                    const request_data = {
                      url: 'https://matjary.online/wp-json/wcfmmp/v1/vendor-followers/' + (!follow ? 'follow' : 'unfollow'),
                      method: 'GET',
                      data:{
                        user_id: user,
                        vendor_id: vendor,
                        count
                      }
                    }
                    return await dispatch('io/get', {
                          url: request_data.url + '?' + JsonToparam(request_data.data),
                          options:{
                              headers: oauth.toHeader(oauth.authorize(request_data, rootState.io.auth.token))
                          }
                        }, {
                      root: true
                    })
                    

                }
            }
        }
    }

}