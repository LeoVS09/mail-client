<template>
    <div class="messages">
        <div class="search">
            <input
                    type="text"
                    :value="query"
                    placeholder="search"
                    @input="event => updateQuery(event.target.value)"
                    @keyup.enter="find()"
            >
            <button @click="find()">Search</button>
        </div>
        <h3>Found {{messages.length}}</h3>
        <div class="messages-list">
            <p class="message-item" :key="" v-for="(m, index) of messages" @click="openMessage(index)">
                <span class="message-subject">{{m.subject}}</span>
                <span class="message-from">{{m.from}}</span>
            </p>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {State, Action} from 'vuex-class'
    import {ACTIONS} from '../store'

    @Component
    export default class MessagesList extends Vue {
        @State(({messages}) => messages) messages
        @State(({query}) => query) query

        @Action(ACTIONS.OPEN_MESSAGE) openMessage
        @Action(ACTIONS.UPDATE_QUERY) updateQuery
        @Action(ACTIONS.LOAD_MESSAGES_LIST) find
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .messages {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-right: 1px solid #eae8e8;
        box-sizing: border-box;

        .search {
            display: flex;
            flex-direction: row;
            padding: 1rem 2rem;
            input {
                flex: 1;
                border: none;

                &:focus {
                    outline: none;
                }
            }

            button {
                margin-left: 0.1rem;
                border-radius: 0.3rem;
                border: 1px solid rgba(2, 101, 233, 0.3);
                background-color: transparent;
                padding: 0.3rem 0.5rem;
            }
        }
        h3 {
            margin: 0.3rem 1rem;
            font-size: 0.75rem;
            font-style: normal;
            text-align: right;
        }

        &-list {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            margin: 0;
            padding-left: 1rem;
            padding-right: 1rem;
            overflow-y: auto;
        }
    }

    .message {
        &-item {
            width: 100%;
            display: flex;
            flex-direction: column;
            border-top: 1px solid #eae8e8;
            margin: 0;
            box-sizing: border-box;
            height: auto;
            min-height: 6rem;

            &:hover {
                background-color: #d8effb;
                cursor: pointer;
            }
        }

        &-subject {
            font-size: 0.8rem;
            color: black;
            text-align: left;
            top: 1rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }

        &-from {
            font-size: 0.8rem;
            /*margin-left: auto;*/
            color: #49667e;
            text-align: right;
            margin-bottom: 0.5rem;
        }
    }
</style>
