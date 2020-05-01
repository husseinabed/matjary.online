<template>
  <v-bottom-sheet ref="sheet" app v-bind="bottomSheet.bind" v-on="bottomSheet.on">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card height="250px">
          <v-toolbar  >
            <v-toolbar-title v-if="!searching">Select an item</v-toolbar-title>
            <v-text-field placeholder="search item" v-else v-model="search" autofocus></v-text-field>
            <v-spacer></v-spacer>
            <v-btn icon  @click="searching = !searching" v-if="!bottomSheet.bind.isPrediction">
              <v-icon>{{ searching ? 'close' : 'search'}}</v-icon>
            </v-btn>
             <v-btn icon  @click.stop="$refs.sheet.$emit('addNew', $router)" v-if="!bottomSheet.bind.isPrediction">
              <v-icon color="green">add_circle</v-icon>
            </v-btn>
          </v-toolbar>
          <v-alert
            :value="!hasPredictions"
            type="warning"
            style="width:100%"
          >
            {{ alertText }}
          </v-alert>
          <v-list two-line class="scroll">
            <template v-for="(item, id) in predictedItems">
              
              <v-list-tile  :key="id"
              class="py-1"
              ripple
              avatar
                @click="itemClicked(item)"
              >
                
                <v-list-tile-avatar 
                :color="getColorByConfedince(item.confidence * 100)"
                class=" white--text"
                style="font-size: 10px"
                >
                  {{ (item.confidence * 100).toFixed(1) }}%
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="title">
                    {{ item.name || item }}
                  </v-list-tile-title>
                  
                  <v-list-tile-sub-title>
                    <v-progress-linear
                        v-if="item.confidence"
                        :color="getColorByConfedince(item.confidence * 100)"
                        :value="item.confidence * 100"
                        class="ma-0 progress"
                        :height="3"
                  ></v-progress-linear>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <!-- {{ Object.keys(items) }}
          {{predictedItems}} -->
          <!-- <v-list two-line class="scroll">
            <v-list-tile v-if="predictedItems.length < 1">
            </v-list-tile>
            <template v-for="(item, index) in predictedItems">
              <v-list-tile
                :key="item._id"
                avatar
                ripple
                @click="itemClicked(item)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  <v-progress-linear
                        v-if="item.confidence"
                        :color="getColorByConfedince(item.confidence * 100)"
                        :value="item.confidence * 100"
                        class="ma-0 progress"
                        :height="3"
                  ></v-progress-linear>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-list-tile-action-text>{{ item.confidence * 100 }}%</v-list-tile-action-text>
                 
                </v-list-tile-action>

              </v-list-tile>
              <v-divider></v-divider>
            </template>
          </v-list> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-bottom-sheet>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
export default {
  data: () => ({
    isPrediction: false,
  }),
  watch: {
    'bottomSheet.bind.value' (v) {
      this.isPrediction = this.bottomSheet.bind.isPrediction
      this.toggleSearch(false)
      this.search = ''
    }
  },
  methods: {
    ...mapMutations({
      toggleSearch: 'items/toggleSearch'
    }),
    itemClicked (item) {
    this.isPrediction ?  this.$refs.sheet.$emit('action', item) : this.$refs.sheet.$emit('select', item)
    },
    getColorByConfedince (conf) {
    if (!conf) return 'red'
    return conf <= 50 ? 'red' : (conf <= 90 && conf > 50) ? 'orange' : 'green'
    }

  },
  computed: {
    search: {
      async set (v) {
        await this.$store.commit('items/search', v)
      },
      get() {
        return this.$store.state.items.search
      }
    },
    searching: { 
      async set (v) {
        this.toggleSearch(v)
      },
      get () {
        return this.$store.state.items.searching
      }
     
    },
    hasPredictions () {
      return Boolean(Object.keys(this.predictedItems).length)
    },
    alertText () {
      if(!this.hasItems && !this.isPrediction)
        return 'No item has been added yet! please add new.'
      if(this.searchStarted || this.isPrediction)
        return 'No item found!'
    },
    ...mapState({ 
      
      user: state => state.io.auth.user,
      examples: state => state.classifier.examples,
      prediction: state => state.classifier.prediction,
      bottomSheet: state => state.bottomSheet,
      classifier: state => state.classifier
    }),
    ...mapGetters({
      items: 'items/items',
      hasItems: 'items/hasItems',
      searchStarted: 'items/searchStarted'
    }),
    predictedItems () {
      let newItems = {}
      if (this.hasItems && !this.searching) {
        if (this.prediction) { 
          for( let item of this.prediction) {
            console.log(item);
            newItems[item.label] = { ...this.items[item.label], confidence: item.confidence }
          }
        } else 
          newItems = this.items
      } else if (this.hasItems && this.searching) {
        newItems = this.items
      }  
      return newItems
    },
  }
}
</script>

<style scoped >
 .scroll {
   max-height: calc(100% - 56px);
   overflow-y: auto;
 }

</style>
