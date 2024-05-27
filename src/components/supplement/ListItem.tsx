import { Card, HStack, Icon, Image, Text, TrashIcon, VStack } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { Supplement } from "../../types/supplement";
import { formatNumber } from "../../utils/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SupplementRowItemProps {
    onClick?: () => void;
    supplement: Supplement;
    isBasketContent?: boolean;
    handleDelete?: (item: Supplement) => void;
};

const SupplementRowItem:React.FC<SupplementRowItemProps> = ({ onClick, supplement, isBasketContent = false, handleDelete }) => {

    const handleClick = async (item: Supplement) => {
        await AsyncStorage.setItem("selectedSupplement", JSON.stringify(item));
        onClick && onClick();
    }

    return (
        <TouchableOpacity onPress={() => handleClick(supplement)}>
            <Card p="$4" borderRadius="$lg" w="$full">
                <HStack alignItems="center">
                    <Image
                        h="$full"
                        w="$1/3"
                        borderRadius={5}
                        source={{
                            uri: supplement?.image || "",
                        }}
                        alt=""
                    />
                    <VStack ml="$6" w="$2/3">
                        <HStack justifyContent="space-between" alignItems="center" alignContent="center">
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
                            {isBasketContent && handleDelete && 
                                <TouchableOpacity onPress={() => handleDelete(supplement)}>
                                    <Icon as={TrashIcon}  mb="$3" mr="$4" w="$4" h="$4"/> 
                                </TouchableOpacity>
                            }
                        </HStack>
                        <HStack justifyContent="flex-end" mr="$6">
                            <Text
                                fontSize="$md"
                                fontStyle="normal"
                                fontFamily="$heading"
                                fontWeight="$normal"
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
                            fontSize="$md"
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
                    </VStack>
                </HStack>
            </Card>
        </TouchableOpacity>
    );
}

export default SupplementRowItem;