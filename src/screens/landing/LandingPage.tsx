import { Box, Fab, StarIcon, VStack, FabIcon, GlobeIcon, ScrollView } from "@gluestack-ui/themed";
import uuid from 'react-native-uuid';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GreetingSection from "./components/GreetingSection";
import PostSection from "./components/PostSection";
import FeaturesSection from "./components/FeaturesSection";
import LoginButtonSection from "./components/LoginButtonSection";
import { useUserInfoStore } from "../../store/UserStore";

import { loginUserWithApple, loginUserWithGoogle } from "../../api/userAPI";
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { Platform } from "react-native";
import { jwtDecode } from 'jwt-decode';
import ProgramDateSelect from "./components/ProgramDateSelect";
import { useEffect, useState } from "react";
import { UserIcon } from "../../assets/icon/UserIcon";


const LandingPage: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [isLoading, setIsLoading] = useState(false);

    
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '384184289674-9u5tfbot2cf4eli2dfcjg4j58kohg2p8.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            //webClientId: '1072354006907-3e714aeo627nna8bt3cfru4htmub0u6p.apps.googleusercontent.com',
            iosClientId: '384184289674-it96tc41nvnpdsrhgeg0prvpfisi8hfq.apps.googleusercontent.com',
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });
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

    const loginWithGoogle = async (userId: string, userName: string, userEmail: string) => {
        const result = await loginUserWithGoogle({ userId, userName, userEmail });
        setUserInfo({ ...result, isLoggedIn: true });
        await AsyncStorage.setItem("UserStoreDate", new Date().toString());
        setIsLoading(false);
        return true;
    };

    async function onAppleButtonPress(): Promise<Boolean> {
        setIsLoading(true);
        if (Platform.OS === "android") {
            const res = handleAndroidAppleLogin();
            return res;
        } else {
            const res = await handleIOSAppleLogin();
            return res;
        }
    }
    
    const handleAndroidAppleLogin = async () => {
        const rawNonce = uuid.v4().toString();
        const state = uuid.v4().toString();
        // Configure the request
        appleAuthAndroid.configure({
            //The Service ID you registered with Apple
            //clientId: 'com.vocco.client-android',
            clientId: 'com.voiceden.client-android',

            // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
            // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
            redirectUri: 'https://vocco.ai',

            // The type of response requested - code, id_token, or both.
            responseType: appleAuthAndroid.ResponseType.ALL,

            // The amount of user information requested from Apple.
            scope: appleAuthAndroid.Scope.ALL,

            // Random nonce value that will be SHA256 hashed before sending to Apple.
            nonce: rawNonce,

            // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
            state,
        });
        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn();

        const { id_token, user, code } = response;
        
        let fullName = "";
        if (user?.name?.firstName && user?.name?.lastName) {
            fullName = `${user?.name?.firstName} ${user?.name?.lastName}`;
        }
        let res = login(code, fullName, id_token);
        return res;
    };
    
    const handleIOSAppleLogin = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
        if (credentialState === appleAuth.State.AUTHORIZED) {
            let fullName = "";
            if (appleAuthRequestResponse.fullName?.givenName && appleAuthRequestResponse.fullName?.familyName) {
                fullName = `${appleAuthRequestResponse.fullName?.givenName} ${appleAuthRequestResponse.fullName?.familyName}`;
            }
            let res = login(appleAuthRequestResponse.user, fullName, appleAuthRequestResponse.identityToken)
            return res;
        }
        return false;
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log("userInfo::", userInfo);
            const tokens = await GoogleSignin.getTokens();
            let fullName = "";
            if (userInfo?.user?.givenName && userInfo?.user?.familyName) {
                fullName = `${userInfo?.user?.givenName} ${userInfo?.user?.familyName}`;
            }
            const res = loginWithGoogle(userInfo.user.id, fullName, userInfo.user.email);
            return res;
        } catch (error) {
            console.log("error::", error)
            // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            //     // user cancelled the login flow
            // } else if (error.code === statusCodes.IN_PROGRESS) {
            //     // operation (e.g. sign in) is in progress already
            // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            //     // play services not available or outdated
            // } else {
            //     // some other error happened
            // }
            return false;
        }
    };

    return (
        <Box h="$full" display="flex" w="$full" backgroundColor="$backgroundDefault">
            <ScrollView flex={1}>
                <VStack space="md" display="flex" justifyContent="space-between">
                    <GreetingSection />
                    <PostSection />
                    <FeaturesSection onLogin={onAppleButtonPress} navigation={navigation} />
                    {!userInfo._id ? <LoginButtonSection isLoading={isLoading} onAppleLogin={onAppleButtonPress} onGoogleLogin={handleGoogleLogin} /> : ""}
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