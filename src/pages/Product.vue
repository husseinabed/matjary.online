<template>
  <v-container :class="{
        'd-flex': true,
        'flex-column': $vuetify.breakpoint.xs,
        'flex-row': $vuetify.breakpoint.lgAndDown,
  }">
        
        <v-flex :style="{ flex: 0.4 }" class="pa-2">
            
            <v-card>
                <v-carousel height="300" v-model="slide" hide-delimiters>
                    <v-carousel-item
                    v-for="(item,i) in items"
                    
                    :key="i"
                    :src="item.src"
                    reverse-transition="fade-transition"
                    transition="fade-transition"
                    ></v-carousel-item>
                </v-carousel >
                <v-divider></v-divider>
                 <v-tabs :grow="false" v-model="slide" >
                    <v-tab v-for="(item,i) in items" :key="i" class="px-1">
                        <v-avatar tile   >
                            <v-img
                            
                            
                            
                            :src="item.thump"
                        
                            ></v-img>
                        </v-avatar >
                    </v-tab>
                </v-tabs>
           
               
            </v-card>
        </v-flex>
        <v-flex :style="{ flex: 0.6 }" class="pa-2">
            <v-card>
                
                <v-card-text>
                <v-toolbar flat dense > 
                        <v-toolbar-title>
                            <h1  class="headline font-weight-bold"> שעון 1</h1>
                        <v-rating
                        :value="4.5"
                        background-color="white"
                        color="yellow accent-4"
                        dense
                        half-increments
                        hover
                        size="20"
                    ></v-rating>
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items style=" text-decoration: line-through;" class="pa-1 title text-linethrogh  blue-grey--text text--lighten-3">
                            ₪70.00                            
                        </v-toolbar-items>
                        <v-toolbar-items class="title green--text pa-1">
                            ₪49.00                            
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-list two-line>
                <v-list-item>
                    <v-list-item-avatar size="70">
                    <v-img src="https://matjary.online/wp-content/uploads/2020/03/Logo-katrina-1-150x150.png"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                    <v-list-item-subtitle>מוכר</v-list-item-subtitle>
                    <v-list-item-title>קטרינה</v-list-item-title>
                    <v-list-item-title>
                        <v-rating
                        :value="4.5"
                        background-color="white"
                        color="yellow accent-4"
                        dense
                        half-increments
                        hover
                        size="12"
                    ></v-rating>
                    </v-list-item-title>
                    
                    
                    </v-list-item-content>
                    <v-list-item-action>
                    
                    </v-list-item-action>
                </v-list-item>
                </v-list>
                
                </v-card-text>
            </v-card>
        </v-flex>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        slide: 0,
       items: [
          {
            src: 'https://matjary.online/wp-content/uploads/2020/04/115804900324_5.png',
            get thump () { 
                return this.src.replace('.png', '-100x100.png')
            }
          },
          {
            src: 'https://matjary.online/wp-content/uploads/2020/04/1309040414873_4.png',
            get thump () { 
                return this.src.replace('.png', '-100x100.png')
            }
          },
          {
            src: 'https://matjary.online/wp-content/uploads/2020/04/13425752191951_10.png',
            get thump () { 
                return this.src.replace('.png', '-100x100.png')
            }
          },
          {
            src: 'https://matjary.online/wp-content/uploads/2020/04/16461269344457_7.png',
            get thump () { 
                return this.src.replace('.png', '-100x100.png')
            }
          },
        ],
        cycle: false,
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
      }
    },
  }
</script>