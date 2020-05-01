import $router from './../../router'

const items = []
const model = {
  name: {
    type: String,
    rules: [
      v => !!v || 'Name is required',
    ]
  },
  price: {
    type: Number
  },
  type_id: {
    type: String,
    rules: [
      v => !!v || 'Type is required',
    ]
  }
}
const item = {}
const rules = {}
Object.keys(model).forEach(name => {
  item[name] = model[name].type()
  rules[name] = model[name].rules
})


export default {
  namespaced: true,
  state: {
    search: '',
    searching: false,
    data: [],
    item: {
      ...item
    },
    types: [],
    rules,
    isNewItem: true,
    loading: false,
    loadingItems: false,
    form: null,
  },
  mutations: {
    delete(state, payload) {
      console.log(state.data instanceof Array, payload);
      if (state.data instanceof Array)
        state.data = state.data.filter(entry => entry._id != payload._id)
    },
    update(state, payload) {

      if (state.data instanceof Array) {
        const entry = state.data.find(entry => entry._id = payload._id)
        if (entry) Object.assign(entry, payload)
      }
    },
    insert(state, payload) {
      if (state.data instanceof Array)
        state.data.push(payload)
    },
    deleteType(state, payload) {
      if (state.types instanceof Array)
        state.types = state.types.filter(entry => entry._id != payload._id)
    },
    updateType(state, payload) {
      if (state.data instanceof Array) {
        const entry = state.types.find(entry => entry._id = payload._id)
        if (entry) Object.assign(entry, payload)
      }
    },
    insertType(state, payload) {
      if (state.types instanceof Array)
        state.types.push(payload)
    },
    item(state, payload) {
      state.item = payload
    },
    isNewItem(state, payload) {
      state.isNewItem = payload
    },
    data(state, payload) {
      state.data = payload
    },
    types(state, payload) {
      state.types = payload
    },
    search(state, payload) {
      state.search = payload
    },
    toggleSearch(state, payload) {
      state.searching = (typeof payload === 'boolean') ? payload : !state.searching
    },
    toggleLoading(state, payload) {
      state.loading = (typeof payload === 'boolean') ? payload : !state.loading
    },
    toggleLoadingItems(state, payload) {
      state.loadingItems = (typeof payload === 'boolean') ? payload : !state.loading
    },
    form(state, form) {
      state.form = form
    }
  },
  actions: {
    async get({
      dispatch,
      commit
    }) {
      await commit('toggleLoadingItems', true)
      await commit('data', [])
      items.map().once(async (data, id) => {
        console.log(data);
        if (data)
          await commit('insert', data)

        // else
        //     commit('delete', id) 

      })
      // const response = await dispatch('io/get', '/items', { root:true })
      // if (response && response.status == 200)
      //     await commit('data', response.data)
      await commit('toggleLoadingItems', false)
    },

    async post({
      dispatch,
      commit
    }, payload) {
      const id = uuid()
      const post = {
        _id: id,
        ...payload
      }
      await commit('toggleLoading', true)
      items.get(id).put(post)
      await commit('toggleLoading', false)

      // const response = await dispatch('io/post', ['/items', payload], { root:true })
      // await commit('bottomSheet/metadata', response.data || {}, { root:true })
      // if (response && response.status === 200) { 
      //     await commit('insert', response.data)
      // }
    },
    async put({
      dispatch,
      commit
    }, payload) {
      await commit('toggleLoading', true)
      items.get(payload._id).put(payload)

      // const response = await dispatch('io/put', ['/items/' + payload._id, payload], {
      //     root: true
      // })
      // if (response && response.status === 200) {
      //     await commit('update', response.data)
      // }
      await commit('toggleLoading', false)

    },
    async delete({
      dispatch,
      commit
    }, payload) {
      await commit('toggleLoading', true)
      items.get(payload._id).put(null)

      // const response = await dispatch('io/delete', ['/items/'+payload._id], { root:true })
      // if (response && response.status == 200) {
      //     await commit('delete', payload)
      //     await dispatch('classifier/clearClass', payload._id, { root: true })
      // }
      await commit('toggleLoading', false)

    },
    async setItem({
      commit,
      getters,
      state
    }, id) {
      await commit('item', (!Boolean(state.isNewItem)) ? getters.items[id] : item)
    },
    //form save
    async save({
      dispatch,
      state
    }) {
      const {
        item,
        form
      } = state
      if (form && !form.validate()) return;
      await dispatch(state.isNewItem ? 'post' : 'put', item)
      $router.go(-1)
    },
    async getTypes({
      dispatch,
      commit
    }) {
      await commit('toggleLoadingItems', true)
      await commit('types', [])
      const response = await dispatch('io/get', '/types', {
        root: true
      })
      if (response && response.status == 200)
        await commit('types', response.data)
      await commit('toggleLoadingItems', false)
    },

    async postType({
      dispatch,
      commit
    }, payload) {
      await commit('toggleLoading', true)
      const response = await dispatch('io/post', ['/types', payload], {
        root: true
      })
      if (response && response.status === 200) {
        await commit('insertType', response.data)
      }
      await commit('toggleLoading', false)
    },
    async putType({
      dispatch,
      commit
    }, payload) {
      await commit('toggleLoading', true)
      const response = await dispatch('io/put', ['/types/' + payload._id, payload], {
        root: true
      })
      if (response && response.status === 200) {
        await commit('updateType', response.data)
      }
      await commit('toggleLoading', false)

    },
    async deleteType({
      dispatch,
      commit
    }, payload) {
      await commit('toggleLoading', true)
      const response = await dispatch('io/delete', ['/types/' + payload._id], {
        root: true
      })
      if (response && response.status == 200) {
        await commit('deleteType', payload)
        // await dispatch('classifier/clearClass', payload._id, { root: true })
      }
      await commit('toggleLoading', false)

    },
  },
  getters: {
    searchStarted(state) {
      return Boolean(state.searching && state.search.trim().length > 1)
    },
    hasItems(state) {
      return Boolean(state.data && state.data.length)
    },
    items(state) {
      let items = state.data
      console.log(items);

      if (state.searching && state.search.trim().length)
        items = items.filter(el => el.title.includes(state.search.trim()))
      if (items && items.length)
        items = Object.fromEntries(items.map(item => [item._id, item]))
      return items
    },
    types(state) {
      let types = state.types
      if (types && types.length)
        types = Object.fromEntries(types.map(item => [item._id, item]))
      return types
    }
  }

}