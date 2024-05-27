import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View, ScrollView } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import FabButton from "../../components/common/FabButton";
import OrderSummaryList from "./components/OrderSummaryList";

type OrderSummaryScreenProps = NativeStackScreenProps<RootStackParamList, "OrderSummary">;

const OrderSummaryScreen: React.FC<OrderSummaryScreenProps> = ({ navigation }) => {

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Order Summary" />
            </View>
            <ScrollView h="$full">
                <OrderSummaryList />
            </ScrollView>
            <FabButton buttonText="Confirm Payment" onPress={() => navigation.navigate("OrderSuccess")} />
        </View>
    );
};

export default OrderSummaryScreen;