import { HStack, Heading, Switch, VStack, Text } from "@gluestack-ui/themed";

const FinalOtherPreferences = () => {
    return (
        <VStack gap={8} mt={16}>
            <Heading size="sm">Other Preferences and Info</Heading>
            <HStack display="flex" justifyContent="space-between" alignItems="center" mt={8}>
                <VStack>
                    <Text maxWidth="$5/6">Prefers Single Protein over Fruits & Vegatables Day</Text>
                </VStack>
                <Switch />
            </HStack>
        </VStack>
    )
}

export default FinalOtherPreferences;