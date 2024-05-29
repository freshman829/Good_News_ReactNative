import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RefreshControl, TouchableOpacity } from 'react-native';
import { OrderHistory, RootStackParamList } from "../../types/data";
import { ScrollView, View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import { useEffect, useState } from "react";
import { getOrderHistoryList } from "../../api/orderHistoryAPI";
import OrderHistorylist from "./components/OrderHistorylist";

type OrderHistoryScreen = NativeStackScreenProps<RootStackParamList, "OrderHistory">;

const OrderHistoryScreen: React.FC<OrderHistoryScreen> = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);

    useEffect(() => {
        getOrderHistory();
    }, []);

    const getOrderHistory = async () => {
        try {
            const result = await getOrderHistoryList();
            if (result.success)
                setOrderHistory(result.data);
        } catch (error) {
            console.log("get order history error: ", error);
        } finally {
            setRefreshing(false);
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getOrderHistory();
    }
    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Order History" /> 
            </View>
            
            <View>
                <ScrollView
                    h="100%"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <OrderHistorylist  orders={orderHistory} />   
                </ScrollView>
            </View>
        </View>
    )
};

export default OrderHistoryScreen;