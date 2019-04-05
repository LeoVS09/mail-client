<template>
    <div v-if="message" class="message">
        <h4 class="message-from">From {{message.from}}</h4>
        <h2 class="message-subject">{{message.subject}}</h2>
        <div class="message-controls">
            <button
                    v-for="a of message.attachments"
                    :key="a.id"
                    @click="() => loadAttachment({ message, attachment: a })"
                    class="attachment"
            >
                Download {{a.name}}
            </button>
        </div>
        <div class="message-text">
            <h3 v-if="!isHaveText" class="message-loading">Loading...</h3>
            <p v-else v-html="message.text">
                {{message.text}}
            </p>
        </div>
    </div>
    <h1 v-else>Loading...</h1>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Getter, Action} from 'vuex-class'
    import {ACTIONS} from '../store/types'

    @Component
    export default class Message extends Vue {
        @Getter('currentMessage') message;

        @Action(ACTIONS.LOAD_ATTACHMENT) loadAttachment;

        get isHaveText() {
            return !!this.message.text
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

        &-from {
            width: 100%;
            text-align: right;
            color: #49667e;
            margin-bottom: 1rem;
        }

        &-subject {
            width: 100%;
            text-align: left;
        }

        &-text {
            margin-top: 2rem;
            padding-top: 2rem;
            padding-bottom: 2rem;
            width: 100%;
            height: 100%;
            border-top: 1px solid #eae8e8;
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
