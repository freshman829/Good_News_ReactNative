import { HStack, Heading, Switch, VStack, Text } from "@gluestack-ui/themed";

const FinalOtherPreferences = () => {
    return (
        <VStack gap={8} mt={8}>
            <Heading>Other Preferences and Info</Heading>
            <HStack display="flex" justifyContent="space-between" alignItems="center">
                <Text>Prefers Single Protein over Fruits & Vegatables Day</Text>
                <Switch />
            </HStack>
        </VStack>
    )
}

export default FinalOtherPreferences;