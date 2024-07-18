
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View, ScrollView, VStack, Image, Text } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import FabButton from "../../components/common/FabButton";
import OrderSummaryList from "./components/OrderSummaryList";
import { useColorScheme } from "react-native";

type OrderSuccessScreenProps = NativeStackScreenProps<RootStackParamList, "OrderSuccess">;

const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View display="flex" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
            <VStack p="$20">
                <View px="$8" py="$4">
                    <Image 
                        source={require("../../assets/images/pay_success.png")} 
                        alt="Success" 
                        w="$full" 
                        h="$3/4"
                    />
                </View>
                <Text fontSize="$lg" fontWeight="bold" textAlign="center">Order Placed!</Text> 
                <View mt="$3">
                    <Text fontSize="$md" textAlign="center">Your Order is Successfully placed.</Text> 
                    <Text fontSize="$md" textAlign="center">the seller has been notified</Text> 
                </View>
            </VStack>
            <FabButton buttonText="Back to Home Page" onPress={() => navigation.navigate("Home")} />
        </View>
    );
};

export default OrderSuccessScreen;