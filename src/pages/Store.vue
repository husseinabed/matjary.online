<template>
    <v-container >
        <!-- {{vendor}} -->
        <v-card flat v-if="vendor"
        >   
    
            <v-card-text :style="banner.style" style="position:relative">
             
                <img :style="img.style" v-if="!$vuetify.breakpoint.xsOnly" contain :src="vendor.banner" />
                <img :style="img.style" v-else contain :src="vendor.mobile_banner" />
            </v-card-text>
            <v-card-title class="pa-2">

            <div class="d-flex" :style="{ width: '100%', 'flex-direction': !$vuetify.breakpoint.xsOnly ? 'row' : 'column'}">
                <div   :style="{ flex: 1 }">
                    <v-list-item three-line class="pa-0">
                        <v-list-item-avatar
                            :size="$vuetify.breakpoint.xsOnly ? 90 : 120"
                            color="grey"
                        >
                            <v-img :src="vendor.logo"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="headline mb-0">{{vendor.store_name}}</v-list-item-title>
                        <v-rating dense class=""
                            background-color="orange lighten-3"
                            color="orange"
                            ></v-rating>
                            <v-list-item-subtitle class="my-1" v-if="vendor.store_hide_address == 'no'" ><v-icon small>mdi-map</v-icon>{{ vendor.vendor_address}}<v-icon ></v-icon></v-list-item-subtitle>
                            <v-list-item-subtitle class="my-1" v-if="vendor.store_hide_phone == 'no'"><v-icon small>mdi-phone</v-icon>{{ vendor.vendor_phone}}</v-list-item-subtitle>
                            <v-list-item-subtitle class="my-1" v-if="vendor.store_hide_email == 'no'"><v-icon small>mdi-email</v-icon>{{ vendor.vendor_email}}</v-list-item-subtitle  >
                        </v-list-item-content>
                        <v-list-item-action>
                        
                        </v-list-item-action>

                    </v-list-item>
                </div>
                <div  :style="{ flex: 'auto', textAlign: 'left'}">
                    <v-btn class="ml-1" small tile  :color="following ? 'green' : 'primary'" outlined @click="following = !following">
                    <v-icon v-if="!following">mdi-account-multiple-plus</v-icon>
                        <v-icon v-else>mdi-account-multiple-check</v-icon>
                    <b>{{ followTxt }}</b>
                    </v-btn>
                    <v-btn class="ml-1" small tile  color="info" outlined >
                        <v-icon >mdi-comment-question-outline</v-icon>
                        <b>{{ InqueryTxt }}</b>
                    </v-btn>
                    <v-btn class="ml-1" small tile  color="info" outlined >
                        <v-icon >mdi-information-outline</v-icon>
                        <b>{{ AboutTxt }}</b>
                    </v-btn>        
                </div>
            </div>
            
            
            
            </v-card-title>
           
    </v-card>
      <v-tabs class="my-2"
    :grow="$vuetify.breakpoint.mdAndDown "
    v-model="tab"
  >
    <v-tab>
      מוצרים
    </v-tab>
    <v-tab>
      חוות דעת
    </v-tab>
    <v-tab>
      עוקבים
    </v-tab>
  
  </v-tabs>
  <v-tabs-items
    v-model="tab"
  >
    <v-tab-item>
        <v-card flat>
            <v-card-title>
                    <v-text-field
            outlined
            
            label="חיפוש"
             prepend-inner-icon="mdi-magnify"
          ></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-container fluid>
      <v-row dense>
        <v-col
          v-for="card in cards"
          :key="card.title"
          :cols="gridFlex"
        >
          <v-card>
            <v-img
              :src="card.src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="card.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
                 
            </v-card-text>
        </v-card>
    </v-tab-item>
    <v-tab-item>
        <v-card>
            <v-card-title>title</v-card-title>
            <v-card-text>text</v-card-text>
        </v-card>
    </v-tab-item>
    <v-tab-item>
        <v-card>
            <v-card-title>title</v-card-title>
            <v-card-text>text</v-card-text>
        </v-card>
    </v-tab-item>
  </v-tabs-items>
  
    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    data () {
        return {
          vendor: null,
             cards: [
        { title: 'Pre-fab homes', src: 'https://matjary.online/wp-content/uploads/2020/04/1309040414873_4-300x225.png', flex: 4 },
        { title: 'Favorite road trips', src: 'https://matjary.online/wp-content/uploads/2020/04/1309040414873_4-300x225.png', flex: 4 },
        { title: 'Best airlines', src: 'https://matjary.online/wp-content/uploads/2020/04/1309040414873_4-300x225.png', flex: 4 },
            ],
            tab: 0,
            following: false,
            banner: {
                style: {
                    padding: 0
                }
            },
            img: {
                style: {
                    maxWidth: '100%',
                }
            }
        }
    },
    computed: {
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
   created () {
     const { store } = this.$route.params
     console.log(store);
     
     if (store) {
       axios.get('https://matjary.online/wp-json/wcfmmp/v1/vendor-store/' + store).then(res => this.vendor = res.data)
     }
   
     
    }
}
</script>
<style scoped>
 
</style>