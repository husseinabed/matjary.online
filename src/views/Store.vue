<template>
    <v-container class="pt-0 " height="100%">
    <v-row v-if="vendor">
         <v-col class="" cols="2">
            <v-card class="pa-0 transparent" flat tile> 
                <v-card-text class="pa-0 text-center">
                    <v-avatar size="150" color="grey lighten-2" style="border: 5px solid #fff">
                        <v-img :src="vendor.avatar" />
                    </v-avatar>
                </v-card-text>
                <v-card-title class="pa-0 text-center">
                    <v-flex class="font-weight-bold">
                        {{vendor.shop_name}}
                        <v-rating dense 
                        :value="vendor.avg_review_rating"
                        readonly
                        size="17"
                        background-color="orange lighten-3"
                        color="orange"
                        ></v-rating>
                    </v-flex>
                </v-card-title>
                <v-card-text class="pa-0 text-center">

                    
                </v-card-text>
            </v-card>
                
         </v-col>
         <v-col cols="10" class=" pa-0">
            <v-card class="pa-0" flat tile>
                <v-card-text class="pa-0">
                    <img :style="{ maxWidth: '100%' }" v-if="!$vuetify.breakpoint.xsOnly" contain :src="vendor.banner" />
                    <img :style="{ maxWidth: '100%' }" v-else contain :src="vendor.mobile_banner" />
                </v-card-text>
                <v-card-title>
                  <v-btn class="ml-1" small tile  :color="following ? 'green' : 'primary'"  @click="followMe" :loading="followingLoading">
                    <v-icon v-if="!following">mdi-account-multiple-plus</v-icon>
                        <v-icon v-else>mdi-account-multiple-check</v-icon>
                    <b>{{ followTxt }}</b>

                    </v-btn>
                    <v-btn class="ml-1" small tile    @click="sendInquery" >
                        <v-icon >mdi-comment-question-outline</v-icon>
                        <b>{{ InqueryTxt }}</b>
                    </v-btn>
                    <v-spacer/>
                <v-btn  icon v-for="(social, key) in vendor.social_profiles" :key="key" v-if="allowedSocial.indexOf(key) !== -1" :style="{ background: socialIconsColors[key]}" class="mx-2">
                    
                    <v-icon class="white--text">mdi-{{key}}</v-icon>
      
                </v-btn>
                </v-card-title>
              
            </v-card>

            <v-row>
                <v-col>
                    <v-card flat tile class="pb-5">
                        <v-card-title>
                            פרטים
                        </v-card-title>
                        <v-card-text >
                            <v-list dense class="pa-0">
                           
                                <v-list-item v-if="vendor.address_string" dense class="pa-0">
                                    <v-list-item-avatar class="ma-0">
                                        <v-icon small>mdi-map-marker</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-title>
                                        {{ vendor.address_string}}
                                    </v-list-item-title>
                                    <v-list-item-action>

                                    </v-list-item-action>
                                    
                                </v-list-item>
                                <v-list-item v-if="vendor.phone" dense class="pa-0">
                                    <v-list-item-avatar class="ma-0">
                                        <v-icon small>mdi-phone</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-title>
                                        {{ vendor.phone}}
                                    </v-list-item-title>
                                    <v-list-item-action>

                                    </v-list-item-action>
                                    
                                </v-list-item>
                                <v-list-item v-if="vendor.email" dense class="pa-0">
                                    <v-list-item-avatar class="ma-0">
                                        <v-icon small>mdi-mail</v-icon>
                                    </v-list-item-avatar>
                                    <v-list-item-title>
                                        {{ vendor.email}}
                                    </v-list-item-title>
                                    <v-list-item-action>

                                    </v-list-item-action>
                                    
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card flat tile>
                        <v-card-title>
                            מיקום
                        </v-card-title>
                        <v-card-text class="   ">
                           
                       
                            <l-map
                                :zoom="zoom"
                                :center="center"
                                style="height: 200px; width: 100%"
                            >
                                <l-tile-layer
                                    :url="url"
                                    :attribution="attribution"
                                />
                            </l-map>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-tabs class="my-5"  v-model="tab" v-if="hasTabs">
                <v-tab v-for="(name, tab) in vendor.store_tabs" :key="tab" v-html="name"></v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" v-if="hasTabs">
                <v-tab-item class="pa-5 elevation-1" v-for="(name, tab) in vendor.store_tabs" :key="tab" v-html="tab == 'about' ? vendor.shop_description : null"></v-tab-item>
            </v-tabs-items>
            
         </v-col>
    </v-row>
    </v-container>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
export default {
    components:{
        LMap, LTileLayer, LMarker 
    },
    data () {
        return {
            collapse: true,
            vendor: null,
            tab: 0,
            following: false,
            followingLoading: false,
            socialIconsColors: {
                facebook: '#3b5998',
                twitter: '#1da1f2',
                youtube: '#cd201f',
                instagram: '#ed4956',
                snapchat: '#FFFC00',
                pinterest: '#e60023',
                linkedin: '#0073b1'
            },
            zoom: 13,
            center: latLng(47.41322, -1.219482),
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:        ''
        }
    },
    computed: {
        ...mapState({
            user: state => state.io.auth.user
        }),
        allowedSocial () {
            return Object.keys(this.socialIconsColors)
        },
        hasTabs () {
            if (this.vendor) {
                if (this.vendor.store_tabs)
                    return true
            }
            return false
        },
        followTxt () {
            // return this.following ? "עוקב" : "עקוב"  
            // return 'עוקבים' 
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
        getVendorProducts: 'io/api/getVendorProducts',

        followVendor: 'io/api/followVendor',
        getUser: 'io/auth/currentUser',
        openDialog: 'dialog/open'
    }),
    sendInquery () {
        this.openDialog({
            component: {
                is: "inquery",
                vendor: this.vendor.id
            }, 
            fullscreen: this.$vuetify.breakpoint.mdAndDown,
            hideOverlay: this.$vuetify.breakpoint.mdAndDown,
            transition: "dialog-bottom-transition",
            maxWidth: this.$vuetify.breakpoint.mdAndDown ? null : 450,
            scrollable: true
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
      if ( this.vendor.shop_info.geolocation ) {
          const { store_lat, store_lng } = this.vendor.shop_info.geolocation
          this.center = latLng(store_lat, store_lng);
      }
      this.loading = false
      const items = await this.getVendorProducts({ vendor_id: this.vendor.id})
      this.items = items.data
      console.log( items.data)
      
    
    }
    
}
</script>
<style scoped>
 
</style>