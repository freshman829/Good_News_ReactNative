import { Button, Input, InputSlot, InputField, View, ButtonIcon, StarIcon } from "@gluestack-ui/themed"
import { useState } from "react";
import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

interface MessageInputProps {
    handleSend: (value: string) => void;
};
const MessageInput: React.FC<MessageInputProps> = ({ handleSend }) => {
    const [message, setMessage] = useState<string>("");

    const handleClick = () => {
        handleSend(message);
        setMessage("");
    }

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === "Enter") handleClick();
    }
    return (
        <View w="$full">
            <Input onPointerEnter={handleClick}>
                <InputField placeholder="" onKeyPress={handleKeyPress} onChangeText={setMessage} value={message}/>
                <InputSlot>
                    <Button onPress={handleClick}>
                        <ButtonIcon as={StarIcon} />
                    </Button>
                </InputSlot>
            </Input>
        </View>
    )
};

export default MessageInput;