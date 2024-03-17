import { Box, VStack } from "@gluestack-ui/themed";
import GreetingSection from "./components/GreetingSection";
import PostSection from "./components/PostSection";
import FeaturesSection from "./components/FeaturesSection";
import LoginButtonSection from "./components/LoginButtonSection";
import { useUserInfoStore } from "../../store/UserStore";

import { loginUserWithApple } from "../../api/userAPI";
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from "react-native";
import ProgramDateSelect from "./components/ProgramDateSelect";


const LandingPage: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();

    const login = async (userId: string, userName: string, identityToken: any) => {
        const result = await loginUserWithApple({ userId, userName, identityToken });
        setUserInfo({ ...result, isLoggedIn: true });
    }

    async function onAppleButtonPress() {
        if (Platform.OS === "android") {
            login("001083.6bedd928a5e74b47a623b8375c0a6b06.0900", "Code Wizard", "sdfsdfsdfsdfsdf");
        } else {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
                login(appleAuthRequestResponse.user, `${appleAuthRequestResponse.fullName?.givenName} ${appleAuthRequestResponse.fullName?.familyName}`, appleAuthRequestResponse.identityToken)
            }
        }
    }
    return (
        <Box p="$3" h="$full">
            <VStack space="md" display="flex" justifyContent="space-between">
                {/* {userInfo._id ? <Heading>{`Hello, ${userInfo.fullName}`}</Heading> : ""} */}
                <GreetingSection />
                <PostSection />
                <FeaturesSection onLogin={onAppleButtonPress} navigation={navigation} />
                {!userInfo._id ? <LoginButtonSection onLogin={onAppleButtonPress} /> : ""}
                {userInfo._id && !userInfo.rotationPlan.programStartDate && <ProgramDateSelect />}
            </VStack>
        </Box>
    );
}

export default LandingPage;