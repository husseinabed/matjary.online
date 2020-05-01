<template>
  <v-container>
  
    <v-row  >
      <v-col :cols="gridFlex" v-for="vendor in vendors" :key="vendor.vendor_id">
         <v-card class="my-6" >
      <v-card-text class="pa-0">
        <!-- {{vendor}} -->
          <img :src="vendor.list_banner"  width="100%"/>
      </v-card-text>

      <v-card-title>
       
        <v-avatar class="ml-3">
          <img :src="vendor.logo" /> 
        </v-avatar>
        {{ vendor.vendor_shop_name }}
        <span class="grey--text text--lighten-2 caption mr-2">
        ({{ rating }})
      </span>
      <v-rating
        v-model="rating"
        background-color="white"
        color="yellow accent-4"
        dense
        half-increments
        hover
        size="10"
      ></v-rating>
         <v-list-item three-line class="pa-0">
          <v-list-item-content>
              <v-list-item-subtitle v-if="vendor.store_hide_address == 'no'" class="my-1" ><v-icon small>mdi-map</v-icon>{{ vendor.vendor_address }}<v-icon ></v-icon></v-list-item-subtitle>
              <v-list-item-subtitle v-if="vendor.store_hide_phone == 'no'" class="my-1" ><v-icon small>mdi-phone</v-icon> {{ vendor.vendor_phone }}</v-list-item-subtitle>
              <v-list-item-subtitle v-if="vendor.store_hide_email == 'no'" class="my-1" ><v-icon small>mdi-email</v-icon> {{ vendor.vendor_email }}</v-list-item-subtitle  >
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
       <v-card-actions class="pa-4">
      <v-btn class="primary" @click="$router.push('/' + vendor.slug)">בקר</v-btn>
      <v-btn class="secondary">שלח בירור</v-btn>
      <v-spacer></v-spacer>
      
    </v-card-actions>
    </v-card>
      </v-col>
    </v-row>
   
   
  </v-container>
</template>

<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  // import api from '../api'
  export default {
    name: 'Home',
    data () {
      return { vendors: {}, rating: 4.5 }
    },
    methods: {
      ...mapActions({
        getStoresList: 'io/api/getStoresList'
      })
      
    },
    computed: {
      gridFlex () {
          const { breakpoint } = this.$vuetify
          if (breakpoint.lg)
              return 3
          if (breakpoint.md)
              return 4
          if (breakpoint.sm)
              return 6
          if (breakpoint.xs)
              return 12
      }
    },
    async created () {
      this.loading = true
      const res = await this.getStoresList()
      
      this.vendors = res.data
      this.loading = false

    }
   
  }
</script>
 