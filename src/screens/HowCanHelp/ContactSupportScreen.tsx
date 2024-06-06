import { Box, VStack, View, ScrollView, KeyboardAvoidingView } from "@gluestack-ui/themed";
import { RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Message, RootStackParamList } from "../../types/data";
import CenterGoBack from "../../components/common/CenterGoBack";
import MessageInput from "../../components/howcanhelp/MessageInput";
import { useEffect, useState } from "react";
import { sendMessage } from "../../api/contactSupportAPI";
import ChatContainer from "./components/ChatContainer";

type ContactSupportScreenProps = NativeStackScreenProps<RootStackParamList, "Contact">;

const ContactSupportScreen: React.FC<ContactSupportScreenProps> = ({ navigation, route }) => {
    const message = route?.params?.message || "";
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);    

    useEffect(() => {
        if (message) {
            handleSendMessage(message);
        }
    }, [message])

    const handleSendMessage = async (value: string) => {
        if (value === "") return;
        setMessages([...messages, { id: Math.floor(Math.random() * 99999999999999999 + 1), message: value, sender: "user", createdAt: new Date().toISOString(), sent: false }])
        try {
            // const result = await sendMessage(value);
        } catch (error) {
            
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View display="flex" h="$full" backgroundColor="$backgroundDefault">
                <View p="$4">
                    <CenterGoBack navigation={navigation} title="Contact Support" />
                </View>
                <ScrollView
                    h="80%"
                    mb="$2"
                >
                    <ChatContainer messages={messages} />
                </ScrollView>
                <Box 
                    display="flex" 
                    flexDirection="row-reverse" 
                    justifyContent="space-between" 
                    alignItems="center"
                    px="$4"
                    mb="$4"
                >
                    <MessageInput handleSend={handleSendMessage} />
                </Box>
            </View>
        </KeyboardAvoidingView>
    )
};

export default ContactSupportScreen;