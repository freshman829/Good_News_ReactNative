import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View, HStack, Icon, ChevronLeftIcon, Text, ScrollView, Fab } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import BasketList from "./components/BasketList";
import FabButton from "../../components/common/FabButton";

type BasketScreenProps = NativeStackScreenProps<RootStackParamList, "Basket">;

const BasketScreen: React.FC<BasketScreenProps> = ({ navigation }) => {

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Basket" />
            </View>
        
            <ScrollView h="$full">
                <BasketList />
            </ScrollView>
            <FabButton buttonText="Checkout" onPress={() => navigation.navigate("PaymentMethod")} />
        </View>
    );
};

export default BasketScreen;
