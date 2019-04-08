<template>
    <div class="message">
        <div class="message-header">
            <div class="message-to"><span>To</span><input type="text" v-model="to" placeholder="some@mail.com"></div>
            <div class="message-subject"><span>Subject</span><input type="text" v-model="subject" placeholder="Тема"></div>
            <simple-button class="send" @click="sendMessage">Send</simple-button>
        </div>
        <div class="message-text">
            <textarea id="text" v-model="text" placeholder="Type some text..."></textarea>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import SimpleButton from '../components/SimpleButton.vue'
    import {State, Action} from 'vuex-class'
    import {ACTIONS} from '../store/types'
    import autoresize from 'autoresize'

    @Component({
        components: {
            SimpleButton
        }
    })
    export default class Message extends Vue {

        to = ''
        subject = ''
        text = ''

        mounted() {
            autoresize(document.querySelector('#text'))
        }

        @Action(ACTIONS.SEND_MESSAGE) sendMessageAction;

        sendMessage() {
            this.sendMessageAction({
                to: this.to,
                subject: this.subject,
                text: this.text
            })
                .then(() => {
                    this.to = ''
                    this.subject = ''
                    this.text = ''
                })
        }
    }
</script>

<style scoped lang="scss">
    .message {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 1rem;
        overflow-y: auto;
        overflow-wrap: break-word;
        box-sizing: border-box;

        &-header {
            width: 100%;
            display: flex;
            flex-direction: column;
            height: auto;
            min-height: 10rem;
        }

        input {
            border: none;
            border-bottom: 1px solid #5e5e5e;
            background: transparent;
            flex: 1;
            padding: 0.5rem 1rem;
            box-sizing: border-box;
            margin-left: 1rem;
            margin-right: 0;

            &:focus {
                outline: none;
            }
        }

        &-to, &-subject {

            width: 100%;
            text-align: right;
            margin-bottom: 1rem;
            display: flex;
            flex-direction: row;
            color: #49667e;
            span {
                margin-top: 0.9rem
            }
        }

        &-text {
            margin-top: 2rem;
            padding-top: 2rem;
            padding-bottom: 2rem;
            width: 100%;
            height: 100%;
            border-top: 1px solid #eae8e8;
        }

        textarea {
            width: 100%;
            min-height: 10rem;
            font-family: 'Roboto', Helvetica, Arial, sans-serif;
            border: none;

            &:focus {
                outline: none;
            }
        }

        .attachment {
            margin-left: 0.1rem;
            border-radius: 0.3rem;
            border: none;
            background-color: #0260E8;
            padding: 0.3rem 0.5rem;
            color: white;
        }
    }
</style>
