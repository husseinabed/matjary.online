import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'
Vue.use(Vuetify);

export default new Vuetify({
    rtl: true,
     theme: {
       themes: {
         light: {

           primary: colors.purple.darken1, // #E53935
           secondary: colors.purple.lighten4, // #FFCDD2
           accent: colors.orange.lighten1, // #3F51B5
         },
       },
     },
});
