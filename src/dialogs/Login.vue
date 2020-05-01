<template>
   <v-card>
       <v-card-title class="title">  
           {{title}}
       </v-card-title>
       <v-card-text>
            <v-form ref="form">
                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex>
                        <v-text-field   
                            :disabled="loading"
                            prepend-icon="account_circle"
                            v-model="username"
                            :rules="rules.username"
                            label="Username"
                            required
                            counter
                            @click:append="showPassword = !showPassword"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field
                            :disabled="loading"
                            prepend-icon="lock"
                            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                            v-model="password"
                            :rules="rules.password"
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            counter
                            @click:append="showPassword = !showPassword"
                            ></v-text-field>
                        </v-flex>
                        
                    </v-layout>
                </v-container>
            </v-form>
       </v-card-text>
       <v-card-actions>
           <v-btn :disabled="loading" :loading="loading" @click="submit" :color="color">{{title}}</v-btn>
            <v-btn :disabled="loading" @click="close">cancel</v-btn>
       </v-card-actions>
   </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

    export default {
        name: 'login',
        props: {
            title: {
                type: String,
                default: 'Login'
            },
            color: {
                type: String,
                default: 'primary'
            }
        },
        data: () => ({
            username: '',
            password: '',
            showPassword: false,
            loading: false,
            rules:{
                username: [
                    v => !!v || 'requierd'

                ],
                password: [
                    v => !!v || 'requierd',
                    v => v.length > 8 || 'must be more than 8'
                ]
            }
        }),
        computed: {
            ...mapState({ 'error': state => state.io.auth.error })
        },
        methods: {
            ...mapMutations({
                updateDialog: 'dialog/update', 

            }),
            ...mapActions({ 
                close: 'dialog/close',
                login: 'io/auth/login', register: 'io/auth/register' }),
         
            async submit () {
                const { form } = this.$refs
                const isLogin = this.title.toLowerCase() == "login" 
                if (form.validate()) {
                    const user = { username: this.username, password: this.password }  
                    this.loading = true
                    // this.updateDialog({ persistent: true })

                    if (isLogin)
                        await this.login(user) 
                    else
                        await this.register(user) 
                    if (!this.$store.state.io.auth.error)
                        this.close()
                    this.loading = false
                    // this.updateDialog({ persistent: false })

                    
                }
            }

        } 
    }
</script>

<style lang="scss" scoped>

</style>