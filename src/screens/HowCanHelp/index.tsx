import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { RefreshControl, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import { View, HStack, Text, ChevronLeftIcon, Icon, VStack, ScrollView, Fab, Box, KeyboardAvoidingView } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import SearchInput from "../../components/common/SearchInput";
import { getFaqList } from "../../api/faqAPI";
import { Faq } from "../../types/faq";
import FaqList from "./components/FaqList";
import CenterGoBack from "../../components/common/CenterGoBack";
import MessageInput from "../../components/howcanhelp/MessageInput";

type HowCanHelpScreenProps = NativeStackScreenProps<RootStackParamList, "HowCanHelp">; 

const HowCanHelpScreen: React.FC<HowCanHelpScreenProps> = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        getFaqs();
    }, [search]);

    const getFaqs = async () => {
        try {
            const result = await getFaqList(search);
            if (result.success)
                setFaqs(result.data);
        
            setRefreshing(false);
        } catch (error) {
            console.log("getFaqs error", error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        getFaqs();
    };

    const handleSearch = (text: string) => {
        setSearch(text);
    };

    const handleSendMessage = (value: string) => {
        if (value === "") return;
        navigation.navigate("Contact", { message: value });
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View display="flex" gap="$4" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
                <View p="$4">
                    <CenterGoBack navigation={navigation} title="How Can We Help" />
                </View>
                <View px="$4">
                    <SearchInput value={search} onChangeText={handleSearch} />
                </View>
                <ScrollView
                    h="75%"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <FaqList faqs={faqs} />
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
    );
};

export default HowCanHelpScreen;