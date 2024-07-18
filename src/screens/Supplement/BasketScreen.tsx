import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View, HStack, Icon, ChevronLeftIcon, Text, ScrollView, Fab } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";
import BasketList from "./components/BasketList";
import FabButton from "../../components/common/FabButton";
import { useState } from "react";
import { useColorScheme } from "react-native";

type BasketScreenProps = NativeStackScreenProps<RootStackParamList, "Basket">;

const BasketScreen: React.FC<BasketScreenProps> = ({ navigation }) => {
    const [emptyBasket, setEmptyBasket] = useState<boolean>(true);
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View display="flex" h="$full" backgroundColor={isDarkMode ? "#1C1C1E" : "#FFFFFF"}>
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Basket" />
            </View>
        
            <ScrollView h="$full">
                <BasketList setIsEmptyBasket={setEmptyBasket}/>
            </ScrollView>
            {!emptyBasket && 
                <FabButton buttonText="Checkout" onPress={() => navigation.navigate("PaymentMethod")} />
            }
        </View>
    );
};

export default BasketScreen;
