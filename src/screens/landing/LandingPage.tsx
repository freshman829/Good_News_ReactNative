import { Box, Heading, VStack, View } from "@gluestack-ui/themed";
import GreetingSection from "./components/GreetingSection";
import PostSection from "./components/PostSection";
import FeaturesSection from "./components/FeaturesSection";
import LoginButtonSection from "./components/LoginButtonSection";
import { useUserInfoStore } from "../../store/UserStore";



const LandingPage: React.FC<{navigation: any}> = ({navigation}) => {
    const { userInfo } = useUserInfoStore();
    console.log(userInfo);
    return (
        <Box p="$3" h="$full">
            <VStack space="md" display="flex" justifyContent="space-between">
                {userInfo.isLoggedIn ? <Heading>{`Hello, ${userInfo.fullName}`}</Heading> : ""}
                <GreetingSection />
                <PostSection />
                <FeaturesSection navigation={navigation} />
                {!userInfo.isLoggedIn ? <LoginButtonSection /> : ""}
            </VStack>
        </Box>
    );
}

export default LandingPage;