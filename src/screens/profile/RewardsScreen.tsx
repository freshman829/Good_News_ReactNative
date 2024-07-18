import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Rewards, RootStackParamList } from "../../types/data";
import { RefreshControl, ScrollView, View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import { useEffect, useState } from "react";
import RewardsHistoryList from "./components/RewardsHistoryList";
import { getRewardsHistoryList } from "../../api/rewardAPI";
import { useUserInfoStore } from "../../store/UserStore";
import { useColorScheme } from "react-native";

type RewardsScreenProps = NativeStackScreenProps<RootStackParamList, "Rewards">;

const RewardsScreen: React.FC<RewardsScreenProps> = ({ navigation }) => {
    const { userInfo } = useUserInfoStore();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [rewardsHistory, setRewardsHistory] = useState<Rewards[]>([]);
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        getRewardsHistory();
    }, []);

    const getRewardsHistory = async () => {
        try {
            const result = await getRewardsHistoryList(userInfo._id);
            if (result.success) {
                setRewardsHistory(result.data);
            }
        } catch (error) {
            console.log("get rewards history error: ", error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        getRewardsHistory();
    }
    return (
        <View display="flex" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Rewards" /> 
            </View>

            <ScrollView
                h="100%"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <RewardsHistoryList rewardsHistory={rewardsHistory} />
            </ScrollView>
        </View>
    )
};

export default RewardsScreen;