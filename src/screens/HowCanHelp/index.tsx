import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { RefreshControl, TouchableOpacity } from 'react-native';
import { View, HStack, Text, ChevronLeftIcon, Icon, VStack, ScrollView, Fab } from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import SearchInput from "../../components/common/SearchInput";
import { getFaqList } from "../../api/faqAPI";
import { Faq } from "../../types/faq";
import FaqList from "./components/FaqList";
import CenterGoBack from "../../components/common/CenterGoBack";

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

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="How Can We Help" />
            </View>
            <VStack px="$4">
                <SearchInput value={search} onChangeText={handleSearch} />
                <ScrollView
                    h="90%"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <FaqList faqs={faqs} />
                </ScrollView>

                
            </VStack>
        </View>
    );
};

export default HowCanHelpScreen;