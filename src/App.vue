<template>
    <div id="app">
        <div class="view">
            <div class="left-view">
                <messages-list/>
            </div>
            <div class="center-view">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {State, Action} from 'vuex-class'
    import MessagesList from './components/MessagesList'
    import {ACTIONS} from './store'

    @Component({
        components: {
            MessagesList
        }
    })
    export default class App extends Vue {

        @State(({userId}) => userId) userId

        @Action(ACTIONS.AUTHENTICATE) auth
        @Action(ACTIONS.LOAD_MESSAGES_LIST) loadMessages

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
    @import url('https://fonts.googleapis.com/css?family=Roboto');

    html, body {
        margin: 0;
        width: 100%;
        height: 100%;
    }

    #app {
        font-family: 'Roboto', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        width: 100%;
        height: 100%;
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

    .view {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    }

    .left-view {
        flex: 1;
        min-width: 30vw;
    }

    .center-view {
        flex: 3;
        height: 100%;
        max-width: 70vw;
    }
</style>
