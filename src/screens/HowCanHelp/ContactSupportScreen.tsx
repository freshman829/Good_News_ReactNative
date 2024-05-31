import { Box, VStack, View, ScrollView } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import CenterGoBack from "../../components/common/CenterGoBack";
import MessageInput from "../../components/howcanhelp/MessageInput";
import { useEffect, useState } from "react";
import { sendMessage } from "../../api/contactSupportAPI";

type ContactSupportScreenProps = NativeStackScreenProps<RootStackParamList, "Contact">;
const ContactSupportScreen: React.FC<ContactSupportScreenProps> = ({ navigation, route }) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [message, setMessage] = useState<string>( route?.params?.message || "");

    useEffect(() => {
        if (message) {
            handleSendMessage(message);
        }
    }, [message])

    const handleSendMessage = async (value: string) => {
        try {
            // const result = await sendMessage(value);
        } catch (error) {
            
        }
    };

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Contact Support" />
            </View>
            <VStack px="$4">
                <ScrollView
                    h="85%"
                    mb="$2"
                >
                </ScrollView>
                <Box
                    display="flex" 
                    flexDirection="row-reverse" 
                    justifyContent="space-between" 
                    alignItems="center"
                >
                    <MessageInput handleSend={handleSendMessage} />
                </Box>
            </VStack>
        </View>
    )
};

export default ContactSupportScreen;