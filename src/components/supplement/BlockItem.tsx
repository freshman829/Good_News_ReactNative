import { Box, Text, View, Card, Image, HStack } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { Supplement } from "../../types/supplement";
import { formatNumber } from "../../utils/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SupplementBlockItemProps {
    onClick?: () => void;
    supplement: Supplement;
};
const SupplementBlockItem: React.FC<SupplementBlockItemProps> = ({ onClick, supplement }) => {
    
    const handleClick = async (item: Supplement) => {
        await AsyncStorage.setItem("selectedSupplement", JSON.stringify(item));
        onClick && onClick();
    }

    return (
        <TouchableOpacity
            onPress={() => handleClick(supplement)}
        >
            <Card p="$4" borderRadius="$lg">
                <Image
                    mb="$2"
                    h={140}
                    w="$full"
                    borderRadius={5}
                    source={{
                        uri: supplement?.image || "",
                    }}
                    alt=""
                />

                <HStack
                    justifyContent="space-between"
                >
                    <Text
                        fontSize="$md"
                        fontStyle="normal"
                        fontFamily="$heading"
                        fontWeight="$bold"
                        bold={true}
                        lineHeight="$sm"
                        mb="$2"
                        sx={{
                        color: "$textLight700",
                        _dark: {
                            color: "$textDark200",
                        },
                        }}
                    >
                        {supplement?.name}
                    </Text>
                    <Text
                        fontSize="$sm"
                        fontStyle="normal"
                        fontFamily="$heading"
                        fontWeight="$light"
                        lineHeight="$sm"
                        mb="$2"
                        sx={{
                        color: "$textLight700",
                        _dark: {
                            color: "$textDark200",
                        },
                        }}
                    >
                        {formatNumber(supplement?.price, 2, true, false, true, true)}
                    </Text>
                </HStack>
                <Text
                    fontSize="$sm"
                    fontStyle="normal"
                    fontFamily="$heading"
                    fontWeight="$normal"
                    lineHeight="$sm"
                    sx={{
                    color: "$textLight700",
                    _dark: {
                        color: "$textDark200",
                    },
                    }}
                >
                    {supplement?.category}
                </Text>
                <HStack>

                </HStack>

            </Card>
        </TouchableOpacity>
    );
};

export default SupplementBlockItem;