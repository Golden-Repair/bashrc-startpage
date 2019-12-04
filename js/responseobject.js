class ResponseObject {
    constructor(resultType, messages) {
        this.resultType = resultType;
        this.messages = typeof messages === 'string' ? this.messages = [messages] : this.messages = messages;
    }
}