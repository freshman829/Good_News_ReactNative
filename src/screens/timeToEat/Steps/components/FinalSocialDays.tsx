import { Heading, VStack, Text } from "@gluestack-ui/themed";


const FinalSocialDays = () => {
    return (
        <VStack mt={8} gap={6}>
            <Heading> Social Days</Heading>
            <VStack mt={8}>
                <Text>2024-03-01</Text>
                <Text>2024-03-03</Text>
                <Text>2024-03-08</Text>
            </VStack>
            <Text color="blue">Edit Social Days</Text>
        </VStack>
    )
}

export default FinalSocialDays;