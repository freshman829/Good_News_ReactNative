import { Divider, VStack, View } from "@gluestack-ui/themed";
import SupplementRowItem from "../../../components/supplement/ListItem";
import SupplementIncreaseAmount from "../../../components/supplement/IncreaseAmount";
import { useEffect, useState } from "react";
import { Supplement } from "../../../types/supplement";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface BasketListProps {
    setIsEmptyBasket: (isEmpty: boolean) => void;
};

const BasketList: React.FC<BasketListProps> = ({setIsEmptyBasket}) => {
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
            setIsEmptyBasket(false);
        } else {
            setIsEmptyBasket(true);
        }
    }, [basket])

    const handleIncrease = ( id: string ) => {
        increaseAmount(id);
    };

    const increaseAmount = async (id: string) => {
        const amount = amounts[id] || 1;
        await AsyncStorage.setItem(`${id}-amount`, (amount + 1).toString());
        setAmounts({ ...amounts, [id]: amount + 1 });
    }; 

    const handleDecrease = ( id: string ) => {
        decreaseAmount(id);
    };

    const decreaseAmount = async (id: string) => {
        const amount = amounts[id] || 1;
        if (amount >= 1) {
            await AsyncStorage.setItem(`${id}-amount`, (amount - 1).toString());
            setAmounts({ ...amounts, [id]: amount - 1 });
        }
    };

    const handleDelete = async (item: Supplement) => {
        const newBasket = basket.filter((i) => i._id !== item._id);
        await AsyncStorage.setItem("basket", JSON.stringify(newBasket));
        setBasket(newBasket);
        await AsyncStorage.removeItem(`${item._id}-amount`);
    };

    return (
        <VStack gap="$4">
            {basket && basket.map((item: Supplement, index: number) => (
                <View key={index}>
                    <VStack gap="$3" px="$4" key={index}>
                        <SupplementRowItem supplement={item} isBasketContent={true} handleDelete={handleDelete}/>
                        <SupplementIncreaseAmount amount={amounts[item._id] || 1} onIncrease={() => handleIncrease(item._id)} onDecrease={() => handleDecrease(item._id)}/>
                    </VStack>
                    <Divider mt="$2" />
                </View>
            ))}
        </VStack>
    );
};

export default BasketList;