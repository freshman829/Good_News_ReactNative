import { Divider, HStack, Text, VStack, View } from "@gluestack-ui/themed";
import SupplementRowItem from "../../../components/supplement/ListItem";
import { useEffect, useState } from "react";
import { Supplement } from "../../../types/supplement";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatNumber } from "../../../utils/common";

interface OrderSummaryListProps {
    basket: Supplement[];
    amounts: { [key: string]: number };
    totalPrice: number;
};

const OrderSummaryList: React.FC<OrderSummaryListProps> = ({ basket, amounts, totalPrice }) => {
    

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

            <HStack justifyContent="space-between" mt="$4" p="$10">
                <Text fontSize="$lg" fontWeight="bold">Total Cost</Text>
                <Text fontSize="$md" fontWeight="bold" $dark-color="blue" color="red">{formatNumber(totalPrice, 2, true, false, true, true)}</Text>
            </HStack>
        </VStack>
    );
};

export default OrderSummaryList;