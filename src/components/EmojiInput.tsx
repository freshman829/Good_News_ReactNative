import { Button, ButtonText, Input, InputField, Modal, View, ModalContent, Box, HStack } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

interface EmojiInputProps {
    value: string,
    onChangeText: (text: string) => void
}

const EmojiInput: React.FC<EmojiInputProps> = ({ value, onChangeText }) => {
    const [text, setText] = useState("");
    const [isPickerVisible, setIsPickerVisible] = useState(false);

    useEffect(() => {
        if (value)
            setText(value);
    }, []);

    useEffect(() => {
        onChangeText(text);
    }, [text])

    const handleEmojiSelect = (emoji: string) => {
        setText(text + emoji);
        setIsPickerVisible(false);
    }

    return (
        <View>
            <HStack display="flex" alignItems="center">
                <Input flex={1}>
                    <InputField
                        value={text}
                        onChangeText={setText}
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    />
                </Input>
                <Button onPress={() => setIsPickerVisible(true)} size="sm" variant="solid" action="primary">
                    <ButtonText>😊</ButtonText>
                </Button>
            </HStack>
            <Modal isOpen={isPickerVisible} onClose={() => setIsPickerVisible(false)}>
                <ModalContent h="$96" w="$96">
                    <EmojiSelector
                        onEmojiSelected={handleEmojiSelect}
                        category={Categories.all}
                        showTabs={true}
                        showSearchBar={true}
                        showHistory={true}
                        columns={10}
                        placeholder="Search emoji..."
                    />
                </ModalContent>
            </Modal>
        </View>
    )
}

export default EmojiInput;