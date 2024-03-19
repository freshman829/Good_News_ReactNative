import { Heading, VStack, Text } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../../store/UserStore";


const FinalSocialDays = () => {
    const {userInfo, setUserInfo} = useUserInfoStore();
    return (
        <VStack mt={16} gap={6}>
            <Heading size="sm"> Social Days</Heading>
            <VStack mt={8}>
                {userInfo.socialDays && userInfo.socialDays.map((item) => (
                    <Text>{item}</Text>
                ))}
            </VStack>
            <Text color="blue">Edit Social Days</Text>
        </VStack>
    )
}

export default FinalSocialDays;