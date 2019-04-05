export default {
    currentMessage(state){
        if(!state.currentMessageId)
            return null

        return state.messages.find(({id}) => id === state.currentMessageId)
    }
}
