import { Button, Input, InputSlot, InputField, View, ButtonIcon, StarIcon } from "@gluestack-ui/themed"
import { useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

interface MessageInputProps {
    handleSend: (value: string) => void;
};
const MessageInput: React.FC<MessageInputProps> = ({ handleSend }) => {
    const [message, setMessage] = useState<string>("");

    const handleClick = () => {
        handleSend(message);
        setMessage("");
    }
    return (
        <View w="$full">
            <Input>
                <InputField placeholder="" onChangeText={setMessage} />
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