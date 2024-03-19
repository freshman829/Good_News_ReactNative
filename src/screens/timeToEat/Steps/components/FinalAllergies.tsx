import { HStack, Heading, VStack, Text } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../../store/UserStore";


const FinalAllergies = () => {
    const {userInfo, setUserInfo} = useUserInfoStore();

    const fvs = userInfo.allergies.fv.join(',');
    const proteins = userInfo.allergies.protein.join(',');

    return (
        <VStack mt={16} gap={7}>
            <Heading size="sm">
                Allergies
            </Heading>
            <HStack mt={8}>
                <Text>Allergy to Fruits & Veggies:</Text>
                <Text> {fvs === "" ? "None" : fvs}</Text>
            </HStack>
            <HStack>
                <Text>Allergy to Single Protein:</Text>
                <Text> {proteins === "" ? "None" : proteins}</Text>
            </HStack>
            <Text color="blue">Edit Allergies</Text>
        </VStack>
    )
}

export default FinalAllergies;