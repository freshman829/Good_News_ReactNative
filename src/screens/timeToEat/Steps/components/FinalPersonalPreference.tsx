import { HStack, Heading, Switch, VStack, Text } from "@gluestack-ui/themed"

const FinalPersonalPreference = () => {

    return (
        <VStack gap={8} mt={16}>
            <Heading size="sm">
                Personal Preferences
            </Heading>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text>Ate fruits and veggies today</Text>
                <Switch />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text>Ate dairy today</Text>
                <Switch />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text>Kosher</Text>
                <Switch />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text>Vegan</Text>
                <Switch />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text>Halal</Text>
                <Switch />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text>Female</Text>
                <Switch />
            </HStack>
        </VStack>
    )
}

export default FinalPersonalPreference;