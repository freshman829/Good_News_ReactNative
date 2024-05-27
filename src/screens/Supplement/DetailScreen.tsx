import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChevronLeftIcon, HStack, Icon, Image, ScrollView, Text, VStack, View, get } from "@gluestack-ui/themed";
import { RootStackParamList } from "../../types/data";
import SupplementInfo from "./components/SupplementInfo";
import SupplementAddToBasketContainer from "./components/AddToBasketContainer";
import FabButton from "../../components/common/FabButton";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Supplement } from "../../types/supplement";

type SupplementDetailScreenProps = NativeStackScreenProps<RootStackParamList, "SupplementDetail">;

const SupplementDetailScreen: React.FC<SupplementDetailScreenProps> = ({ navigation }) => {
    const [supplement, setSupplement] = useState<Supplement | null>(null);
    const [amount, setAmount] = useState<number>(1);

    useEffect(() => {
        const getSupplement = async () => {
            const selectedSupplement = await AsyncStorage.getItem("selectedSupplement");
            if (selectedSupplement !== null) {
                setSupplement(JSON.parse(selectedSupplement));
            }
        }
        getSupplement();
    }, []);

    const handleIncrease = () => {
        setAmount(amount + 1);
    };

    const handleDecrease = () => {
        if (amount > 1) {
            setAmount(amount - 1);
        }
    };

    const retriveBasket = async () => {
        let list: Supplement[] = [];
        const basket = await AsyncStorage.getItem("basket");
        if (basket !== null) {
            list = JSON.parse(basket);
        }

        if (!list.some((item) => item._id === supplement!._id)) {
            list.push(supplement!);
            await AsyncStorage.setItem("basket", JSON.stringify(list));
        }
        
        const addedSupplementAmountKey = `${supplement!._id}-amount`;
        const beforeAmount = await AsyncStorage.getItem(addedSupplementAmountKey);
        let afterAmount = 1;
        if (beforeAmount !== null) {
            afterAmount = parseInt(beforeAmount) + amount;
        }
        await AsyncStorage.setItem(addedSupplementAmountKey, afterAmount.toString());
    };

    const handleAddBasket = async () => {
        await retriveBasket();
        navigation.navigate("Basket");
    }
    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <HStack p="$4" alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>
            
            <ScrollView h="$full">
                <SupplementInfo supplement={supplement}/>
                <SupplementAddToBasketContainer amount={amount} onIncrease={handleIncrease} onDecrease={handleDecrease}/>
            </ScrollView>
            <FabButton buttonText="Add to Basket" onPress={handleAddBasket}/>
        </View>
    );
};

export default SupplementDetailScreen;