class SmartMessage
{
    const unexpected_error = "216unexpected_error";

    static function serialize(string $msg): string
    { 
        $len = strlen($msg);
        $len_size = strlen($len);

        if (strlen($len_size) != 1)
            die(self::unexpected_error . "Size of message length is not 1 byte");

        return $len_size . $len . $msg;
    }

    /**
     * Parsing
     * get size of message length (e.g. size 2 for a message with length 16)
     */
    static function messageLengthSize(string $msg): int
    {
        $len_size = intval(substr($msg, 0, 1));
        if ($len_size <= 0)
            die(self::unexpected_error . "Size of message length cannot be less or equal to 0");

        return $len_size;
    }

    /**
     * Parsing
     * get length of a message
     */
    static function messageLength(string $msg, int $len_size = -1): int
    {
        // don't calculate the size if the user already has it somewhere
        if ($len_size == -1)
            $len_size = self::messageLengthSize($msg);
        // offset 1 since that's the position of the size
        $len = intval(substr($msg, 1, $len_size));

        return $len;
    }

    /**
     * Parsing
     * get length of message, message size and 1 for the size byte (combined)
     */
    static function messageTotalLength(string $msg): int
    {
        $len_size = self::messageLengthSize($msg);
        // offset 1 since that's the position of the size
        $len = self::messageLength($msg, $len_size);

        return 1 + $len_size + $len;
    }

    /**
     * Parsing
     * remove the size, length and message from a string
     * we could use passing by reference here, but to make the code easily portable we won't
     */
    static function removeMessage(string $msg): string
    {
        return substr($msg, self::messageTotalLength($msg));
    }

    /**
     * Parsing
     * get the message from a string
     */
    static function getMessage(string $msg): string 
    {
        $len_size = self::messageLengthSize($msg);
        if ($len_size <= 0)
            die(self::unexpected_error . "Size of Message Length cannot be less or equal to 0");
        // offset 1 since that's the position of the size
        $len = self::messageLength($msg, $len_size);

        // read $len chars after the size and length
        return substr($msg, 1 + $len_size, $len);
    }
}
