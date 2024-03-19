import { HStack, Heading, VStack, Text } from "@gluestack-ui/themed";


const FinalAllergies = () => {

    return (
        <VStack mt={8} gap={4}>
            <Heading>
                Allergies
            </Heading>
            <HStack mt={8}>
                <Text>Allergy to Fruits & Veggies:</Text>
                <Text> None</Text>
            </HStack>
            <HStack>
                <Text>Allergy to Single Protein:</Text>
                <Text> None</Text>
            </HStack>
            <Text color="blue">Edit Allergies</Text>
        </VStack>
    )
}

export default FinalAllergies;