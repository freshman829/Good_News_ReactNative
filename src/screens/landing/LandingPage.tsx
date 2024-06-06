import { Box, Fab, StarIcon, VStack, FabIcon, GlobeIcon, ScrollView } from "@gluestack-ui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GreetingSection from "./components/GreetingSection";
import PostSection from "./components/PostSection";
import FeaturesSection from "./components/FeaturesSection";
import LoginButtonSection from "./components/LoginButtonSection";
import { useUserInfoStore } from "../../store/UserStore";

import { loginUserWithApple } from "../../api/userAPI";
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { Platform } from "react-native";
import { jwtDecode } from 'jwt-decode';
import ProgramDateSelect from "./components/ProgramDateSelect";
import { useEffect, useState } from "react";
import { UserIcon } from "../../assets/icon/UserIcon";


const LandingPage: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [isLoading, setIsLoading] = useState(false);

    
    useEffect(() => {
        const getUserInfo = async () => {
            await AsyncStorage.getItem("userInfo").then(async (value) => {
                if (value) {
                    await AsyncStorage.getItem("UserStoreDate").then((storeDate) => {
                        if (storeDate) {
                            const date = new Date(storeDate);
                            const now = new Date();
                            const diff = now.getTime() - date.getTime();
                            if (diff > 1000 * 60 * 60 * 24) {
                                setUserInfo({ ...userInfo, _id: "" })
                            } else {
                                setUserInfo(JSON.parse(value));
                            }
                        }
                    });
                }
            });
        };
        getUserInfo();
    }, []);


    const login = async (userId: string, userName: string, identityToken: any) => {
        const result = await loginUserWithApple({ userId, userName, identityToken });
        setUserInfo({ ...result, isLoggedIn: true });
        await AsyncStorage.setItem("UserStoreDate", new Date().toString());
        setIsLoading(false);
        return true;
    }

    async function onAppleButtonPress(): Promise<Boolean> {
        setIsLoading(true);
        if (Platform.OS === "android") {
            let res = login("001083.6bedd928a5e74b47a623b8375c0a6b06.0900", "Code Wizard", "test");
            return res;
        } else {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
                // const { identityToken } = appleAuthRequestResponse;
                // if (identityToken) {
                //     const jwt = jwtDecode(identityToken);
                //     console.log("-------------", jwt);
                // }
                let fullName = "";
                if (appleAuthRequestResponse.fullName?.givenName && appleAuthRequestResponse.fullName?.familyName) {
                    fullName = `${appleAuthRequestResponse.fullName?.givenName} ${appleAuthRequestResponse.fullName?.familyName}`;
                }
                let res = login(appleAuthRequestResponse.user, fullName, appleAuthRequestResponse.identityToken)
                return res;
            }
            return false;
        }
    }
    return (
        <Box p="$3" h="$full" display="flex" w="$full" backgroundColor="$backgroundDefault">
            <ScrollView flex={1}>
                <VStack space="md" display="flex" justifyContent="space-between">
                    <GreetingSection />
                    <PostSection />
                    <FeaturesSection onLogin={onAppleButtonPress} navigation={navigation} />
                    {!userInfo._id ? <LoginButtonSection isLoading={isLoading} onLogin={onAppleButtonPress} /> : ""}
                    {userInfo._id && !userInfo.rotationPlan.programStartDate && <ProgramDateSelect />}
                </VStack>
                {userInfo._id && 
                    <Fab size="lg" placement="bottom right" bottom="$6" height="$12" onPress={() => navigation.navigate("Profile")}>
                        <FabIcon as={UserIcon} size="sm"/>
                    </Fab>
                }
            </ScrollView>
        </Box>
    );
}

export default LandingPage;