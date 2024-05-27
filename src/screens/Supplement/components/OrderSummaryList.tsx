import { Divider, HStack, Text, VStack, View } from "@gluestack-ui/themed";
import SupplementRowItem from "../../../components/supplement/ListItem";
import { useEffect, useState } from "react";
import { Supplement } from "../../../types/supplement";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrderSummaryListProps {

};

const OrderSummaryList: React.FC<OrderSummaryListProps> = ({}) => {
    const [basket, setBasket] = useState<Supplement[]>([]);
    const [amounts, setAmounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const getBasket = async () => {
            const basket = await AsyncStorage.getItem("basket");
            if (basket !== null) {
                setBasket(JSON.parse(basket));
            }
        }
        getBasket();
    }, []);

    useEffect(() => {
        const getAmounts = async () => {
            const amounts: { [key: string]: number } = {};
            for (const item of basket) {
              const amount = await AsyncStorage.getItem(`${item._id}-amount`);
              if (amount !== null) {
                amounts[item._id] = parseInt(amount);
              }
            }
            setAmounts(amounts);
        };
        if (basket.length > 0) {
        getAmounts();
        }
    }, [basket])

    return (
        <VStack gap="$3" pb="$6">
            {basket.length > 0 && basket.map((item: Supplement, index: number) => (
                <View key={index}>
                    <VStack gap="$2" px="$4" mt="$2">
                        <SupplementRowItem supplement={item}/>
                        <HStack justifyContent="space-between" px="$6">
                            <Text fontSize="$md" fontWeight="bold">Currency</Text>
                            <Text fontSize="$sm">USD</Text>
                        </HStack>
                        <HStack justifyContent="space-between" px="$6">
                            <Text fontSize="$md" fontWeight="bold">Amount</Text>
                            <Text fontSize="$sm">{amounts[item._id] || 1}</Text>
                        </HStack>
                    </VStack>
                    <Divider mt="$2"/>
                </View>
            ))}
        </VStack>
    );
};

export default OrderSummaryList;