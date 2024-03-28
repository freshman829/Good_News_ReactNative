import { HStack, Heading, VStack, Text, Switch } from "@gluestack-ui/themed";


const FinalHelthCondition = () => {
    return (
        <VStack mt={8} gap={4}>
            <Heading>
                Health Conditions
            </Heading>
            <HStack display="flex" justifyContent="space-between" alignItems="center">
                <Text>Customize Based on Health Conditions</Text>
                <Switch />
            </HStack>
            <Text>Diabetes</Text>
            <Text>High Blood Pressure</Text>
            <Text color="blue">Edit Health Conditions</Text>
        </VStack>
    )
}

export default FinalHelthCondition;