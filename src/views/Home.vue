<template>
    <main class="home">
        <div class="center">
            <h1>Hi, {{email}}</h1>
            <h4>You have {{count}} messages</h4>
            <simple-button @click="toSend">Create message</simple-button>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import SimpleButton from '../components/SimpleButton.vue'
    import {State, Action} from 'vuex-class'
    import {routes} from '../router'

    @Component({
        components: {
            SimpleButton
        }
    })
    export default class Home extends Vue {
        @State('email') email
        @State('countMessages') count

        toSend() {
            console.log('go to send')
            this.$router.push({name: routes.SEND})
        }
    }
</script>

<style scoped lang="scss">
    main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .center {
            margin: auto;
        }

        h1 {
            color: #464646;
            margin-bottom: 0.2rem;
            padding-bottom: 0;
        }

        h4 {
            margin-top: 0;
            padding-top: 0;
            font-weight: lighter;
            color: #a8a8a8;
            text-align: right;
        }

    }
</style>
