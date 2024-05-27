import { HStack, Button, Text, View } from "@gluestack-ui/themed";

interface SupplementIncreaseAmountProps {
    amount: number;
    onIncrease: () => void;
    onDecrease: () => void;
};
const SupplementIncreaseAmount: React.FC<SupplementIncreaseAmountProps> = ({ amount, onIncrease, onDecrease }) => {
    
    return (
        <HStack justifyContent="space-between" px="$6">
            <Text
                fontSize="$md"
                fontWeight="$bold"
                sx={{
                    color: "$textLight700",
                    _dark: {
                        color: "$textDark200",
                    }
                }}
            >
                Amount:
            </Text>
            <HStack gap="$3">
                <Button
                    onPress={() => onDecrease()}
                    variant="outline"
                    size="xs"
                    borderRadius="$full"
                >
                    <Text fontSize="$md">-</Text>
                </Button>
                <Text fontSize="$lg">{amount}</Text>
                <Button
                    onPress={() => onIncrease()}
                    variant="outline"
                    size="xs"
                    borderRadius="$full"
                >
                    <Text fontSize="$md">+</Text>
                </Button>
            </HStack>
        </HStack>
    );
};

export default SupplementIncreaseAmount;