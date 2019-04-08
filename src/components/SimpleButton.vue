<template>
    <button @click="emitClick" class="simple-button"><slot>simple</slot></button>
</template>

<script>
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'

    @Component
    export default class SimpleButton extends Vue {
        emitClick() {
            this.$emit('click')
        }
    }
</script>

<style scoped lang="scss">
    .simple-button {
        width: 100%;
        padding: 1rem 3rem;
        background: #0260E8;
        border: none;
        border-radius: 0.5rem;
        color: white;
        font-weight: bold;
    }
</style>
