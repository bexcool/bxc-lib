"use strict";
var SmartMessage = /** @class */ (function () {
    function SmartMessage() {
    }
    Object.defineProperty(SmartMessage, "unexpected_error", {
        get: function () {
            return "216unexpected_error";
        },
        enumerable: false,
        configurable: true
    });
    SmartMessage.serialize = function (msg) {
        var len = msg.length;
        var len_size = len.toString().length;
        if (len_size.toString().length != 1)
            console.error(this.unexpected_error + "Size of message length must be 1 byte");
        return len_size.toString() + len.toString() + msg;
    };
    /**
     * Parsing
     * get size of message length (e.g. size 2 for a message with length 16)
     */
    SmartMessage.messageLengthSize = function (msg) {
        var len_size = parseInt(msg.substr(0, 1));
        if (len_size <= 0 && !isNaN(len_size))
            console.error(this.unexpected_error +
                "Size of message length must be a number and cannot be less or equal to 0");
        return len_size;
    };
    /**
     * Parsing
     * get length of a message
     */
    SmartMessage.messageLength = function (msg, len_size) {
        if (len_size === void 0) { len_size = -1; }
        // don't calculate the size if the user already has it somewhere
        if (len_size == -1)
            len_size = this.messageLengthSize(msg);
        // offset 1 since that's the position of the size
        var len = parseInt(msg.substr(1, len_size));
        return len;
    };
    /**
     * Parsing
     * get length of message, message size and 1 for the size byte (combined)
     */
    SmartMessage.messageTotalLength = function (msg) {
        var len_size = this.messageLengthSize(msg);
        // offset 1 since that's the position of the size
        var len = this.messageLength(msg, len_size);
        return 1 + len_size + len;
    };
    /**
     * Parsing
     * remove the size, length and message from a string
     */
    SmartMessage.removeMessage = function (msg) {
        return msg.substr(this.messageTotalLength(msg));
    };
    /**
     * Parsing
     * get the message from a string
     */
    SmartMessage.getMessage = function (msg) {
        var len_size = this.messageLengthSize(msg);
        // offset 1 since that's the position of the size
        var len = this.messageLength(msg, len_size);
        // read $len chars after the size and length
        return msg.substr(1 + len_size, len);
    };
    return SmartMessage;
}());
