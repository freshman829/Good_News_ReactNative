import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { RefreshControl, TouchableOpacity } from 'react-native';
import { View, HStack, Text, ChevronLeftIcon, Icon, VStack, ScrollView, Fab, Box } from "@gluestack-ui/themed";
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
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="How Can We Help" />
            </View>
            <VStack px="$4">
                <SearchInput value={search} onChangeText={handleSearch} />
                <ScrollView
                    h="75%"
                    mb="$1"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <FaqList faqs={faqs} />
                </ScrollView>
                <Box 
                    display="flex" 
                    flexDirection="row-reverse" 
                    justifyContent="space-between" 
                    alignItems="center"
                    mb="$4"
                >
                    <MessageInput handleSend={handleSendMessage} />
                </Box>
            </VStack>
        </View>
    );
};

export default HowCanHelpScreen;