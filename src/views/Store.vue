<template>
    <v-container >
        <v-card flat v-if="vendor"
        >   
    
            <v-card-text :style="{ padding: 0 }" style="position:relative">
              <v-toolbar :collapse="collapse"
                dense
                absolute
                v-if="vendor.has_social"
              > 
                  
                  <v-btn v-if="!collapse" icon v-for="(social, key) in vendor.social_profiles" :key="key">
                    <v-icon>mdi-{{key}}</v-icon>
                  
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="collapse = !collapse">
                    <v-icon>mdi-{{ collapse ? 'share-variant' : 'close-circle-outline' }}</v-icon>
                  </v-btn>
                  
              </v-toolbar>
                <img :style="{ maxWidth: '100%' }" v-if="!$vuetify.breakpoint.xsOnly" contain :src="vendor.banner" />
                <img :style="{ maxWidth: '100%' }" v-else contain :src="vendor.mobile_banner" />
            </v-card-text>
            <v-card-title class="pa-2">

            <div class="d-flex" :style="{ width: '100%', 'flex-direction': !$vuetify.breakpoint.xsOnly ? 'row' : 'column'}">
                <div   :style="{ flex: 1 }">
                    <v-list-item three-line class="pa-0">
                        <v-list-item-avatar
                            :size="$vuetify.breakpoint.xsOnly ? 90 : 120"
                            color="grey"
                        >
                            <v-img :src="vendor.avatar"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="headline mb-0">{{vendor.shop_name}}</v-list-item-title>
                        <v-rating dense 
                            :value="vendor.avg_review_rating"
                            disabled
                            background-color="orange lighten-3"
                            color="orange"
                            ></v-rating>
                            <v-list-item-subtitle class="my-1" v-if="vendor.address_string" ><v-icon small>mdi-map</v-icon>{{ vendor.address_string}}<v-icon ></v-icon></v-list-item-subtitle>
                            <v-list-item-subtitle class="my-1" v-if="vendor.phone"><v-icon small>mdi-phone</v-icon>{{ vendor.phone}}</v-list-item-subtitle>
                            <v-list-item-subtitle class="my-1" v-if="vendor.email"><v-icon small>mdi-email</v-icon>{{ vendor.email}}</v-list-item-subtitle  >
                        </v-list-item-content>
                        <v-list-item-action>
                        
                        </v-list-item-action>

                    </v-list-item>
                </div>
                <div  :style="{ flex: 'auto', textAlign: 'left'}">
                    <v-btn class="ml-1" small tile  :color="following ? 'green' : 'primary'" outlined @click="followMe" :loading="followingLoading">
                    <v-icon v-if="!following">mdi-account-multiple-plus</v-icon>
                        <v-icon v-else>mdi-account-multiple-check</v-icon>
                    <b>{{ followTxt }}</b>
                    </v-btn>
                    <v-btn class="ml-1" small tile  color="info" outlined @click="sendInquery" >
                        <v-icon >mdi-comment-question-outline</v-icon>
                        <b>{{ InqueryTxt }}</b>
                    </v-btn>
                    <!-- <v-btn class="ml-1" small tile  color="info" outlined >
                        <v-icon >mdi-information-outline</v-icon>
                        <b>{{ AboutTxt }}</b>
                    </v-btn> -->        
                </div>
            </div>
            
            
            
            </v-card-title>
           
    </v-card>
     <v-tabs v-model="tab" v-if="hasTabs">
        <v-tab v-for="(name, tab) in vendor.store_tabs" :key="tab" v-html="name"></v-tab>
     </v-tabs>
     <v-tabs-items v-model="tab" v-if="hasTabs">
        <v-tab-item v-for="(name, tab) in vendor.store_tabs" :key="tab" v-html="tab == 'about' ? vendor.shop_description : null"></v-tab-item>
     </v-tabs-items>
  
    </v-container>
</template>
<script>
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

export default {
    data () {
        return {
            collapse: true,
            vendor: null,
            tab: 0,
            following: false,
            followingLoading: false

        }
    },
    computed: {
        ...mapState({
            user: state => state.io.auth.user
        }),
        hasTabs () {
            if (this.vendor) {
                if (this.vendor.store_tabs)
                    return true
            }
            return false
        },
        followTxt () {
            return this.following ? "עוקב" : "עקוב"  
        },
        InqueryTxt () {
            return 'שלח בירור'
        },
        AboutTxt () {
            return 'אודות'
        },
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
    watch: {
        
    },
    methods: {
      ...mapActions({
        getStore: 'io/api/getStore',
        followVendor: 'io/api/followVendor',
        getUser: 'io/auth/currentUser',
        openDialog: 'dialog/open'
    }),
    sendInquery () {
        this.openDialog({
            component: {
                is: "inquery",
                vendor: this.vendor.shop_name
            }, 
            maxWidth: 350,
        })
        // console.log(this.vendor)
    },
    // follow vendor btn
    async followMe () {
        this.followingLoading = true
        const res = await this.followVendor({
            user: this.user.id,
            vendor: this.vendor.id,
            follow: this.following,
            count: this.vendor.total_follower_count
        });
        this.followingLoading = false
        if (res.data){
            //if new follower
            if (!this.following) 
                this.vendor.total_follower_count++
            else
                this.vendor.total_follower_count--
            this.following = !this.following
            
        }
    } 
      
    },
     async created () {
      const { store } = this.$route.params
      this.loading = true
      const res = await this.getStore({slug:store})
      this.vendor = res.data
      console.log( res.data)
      this.following = this.vendor.user_is_following 
      this.loading = false 

    }
    
}
</script>
<style scoped>
 
</style>