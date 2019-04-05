<template>
    <div id="app">
        <div id="nav">
            <h1>User: {{userId}}</h1>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </div>
        <div class="message-list">
            <h1>Messages {{messages.length}}</h1>
            <ul>
                <li :key="" v-for="m of messages">
                    Subject: {{m.subject}}
                </li>
            </ul>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {State, Action} from 'vuex-class'
    import {ACTIONS} from './store'

    @Component
    export default class App extends Vue {

        @State(({userId}) => userId) userId
        @State(({messages}) => messages) messages

        @Action(ACTIONS.AUTHENTICATE) auth
        @Action(ACTIONS.LOAD_MESSAGES) loadMessages

        // lifecycle hook
        mounted() {
            this.authAndLoadMessages()
        }


        async authAndLoadMessages() {
            await this.auth()
            await this.loadMessages()
            console.log(this.messages)
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
