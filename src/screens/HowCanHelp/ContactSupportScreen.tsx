import { Box, VStack, View, ScrollView, KeyboardAvoidingView } from "@gluestack-ui/themed";
import { RefreshControl, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Message, RootStackParamList } from "../../types/data";
import CenterGoBack from "../../components/common/CenterGoBack";
import MessageInput from "../../components/howcanhelp/MessageInput";
import { useEffect, useState } from "react";
import ChatContainer from "./components/ChatContainer";
import { useUserInfoStore } from "../../store/UserStore";
import { fetchMessages, sendMessage } from "../../api/contactSupportAPI";

type ContactSupportScreenProps = NativeStackScreenProps<RootStackParamList, "Contact">;

const ContactSupportScreen: React.FC<ContactSupportScreenProps> = ({ navigation, route }) => {
    const { userInfo } = useUserInfoStore();
    const message = route?.params?.message || "";
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);   
    const isDarkMode = useColorScheme() === 'dark';
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMessagesHandler();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchMessagesHandler = async () => {
        try {
            const result = await fetchMessages(userInfo._id);
            if (result.success)
                setMessages(result.data);
        } catch (error) {
            
        }
    };

    useEffect(() => {
        if (message) {
            handleSendMessage(message);
        }
    }, [message])

    const handleSendMessage = async (value: string) => {
        if (value === "") return;
        try {
            const result = await sendMessage(userInfo._id, value);
            setMessages([...messages, { id: Math.floor(Math.random() * 99999999999999999 + 1), message: value, createdAt: new Date().toISOString(), sent: true }])
        } catch (error) {
            
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View display="flex" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
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