<template>
    <v-card>
        <v-toolbar flat>
            <v-text-field autofocus ref="text" v-if="searching" label="search item"  v-model="search" clearable ></v-text-field>
            <v-toolbar-title v-else >
                Select Item
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="searching = !searching" ><v-icon >{{ searching ?  'close' : 'search' }}</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
            <v-alert
            :value="searchedItems.length < 1"
            type="warning"
            >
             items not found !
            </v-alert>
           <v-list v-if="searchedItems.length " two-line dense class="pt-0 members" >
                <template v-for="item  in searchedItems">
                    <v-list-tile
                    :key="item._id"
                    avatar
                    @click.prevent="select(item)"
                    class="py-1"
                    >
                    <v-list-tile-avatar
                        color="indigo"
                        class="headline font-weight-light white--text"
                    >
                        {{ item.title.charAt(0) }}
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title class="title" v-html="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-list-tile-action-text>
                        <v-btn icon color="red" @click.stop="$emit('clear', item._id)">
                            <v-icon color="white">
                            delete
                            </v-icon>
                        </v-btn>
                        </v-list-tile-action-text>
                    </v-list-tile-action>
                    </v-list-tile>
                </template>
            </v-list>
         
        </v-card-text>
        <v-card-actions>
            <v-btn
            color="red"
            flat
            @click="$emit('discard')"
            
            >
            <v-icon>delete</v-icon>
            Discard
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
            color="green"
            flat
            @click="$emit('addNew', $router)"
            
            >
            <v-icon>add</v-icon>
            New
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
    name: 'items',
    data:()=>({
        tab:0,
        search: '',
        searching: false
    }),
    watch: {
         
    },
    methods: {
        select (item) {
           this.$emit('save', item)
        }
    },
    computed: {
        ...mapState( { items: state => state.items.data, prediction: state => state.classifier.prediction }),
        alertText () {
            if(this.items && this.items.length < 1 && !this.searching)
                return 'No item has been added yet! please add new.'
                    
                
            if(this.searching && this.search.trim().length || this.searching)
                return 'Item not  found!'


        },
        searchedItems () {
            if (this.items && this.items.length) {
                if (this.search.trim().length) {
                    return this.items.filter(it => it.title.includes(this.search))
                } 
                if (this.prediction && this.prediction.confidences) {
                    return this.items.filter(it => Object.keys(this.prediction.confidences).includes(it._id))
                }

                return []
            }
            else
                return []
       }
    }
}
</script>

<style>

</style>
