import { Divider, Fab, VStack, View } from "@gluestack-ui/themed";
import SupplementIncreaseAmount from "../../../components/supplement/IncreaseAmount";
import { useState } from "react";
import { Supplement } from "../../../types/supplement";

interface SupplementAddToBasketContainerProps { 
    amount: number;
    onIncrease: () => void;
    onDecrease: () => void;
};
const SupplementAddToBasketContainer: React.FC<SupplementAddToBasketContainerProps> = ({ amount, onIncrease, onDecrease }) => {
    
    return (
        <VStack mt="$8">
            <SupplementIncreaseAmount amount={amount} onIncrease={onIncrease} onDecrease={onDecrease}/>
            <Divider mt="$4" />
        </VStack>
    );
};

export default SupplementAddToBasketContainer;