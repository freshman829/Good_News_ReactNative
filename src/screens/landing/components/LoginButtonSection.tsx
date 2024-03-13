import { Box, Button, ButtonText, CloseIcon, FormControl, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";
import { useState } from "react";
import { loginUserWithApple } from "../../../api/userAPI";
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { Dimensions } from "react-native";

const LoginButtonSection: React.FC = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [isLoading, setLoading] = useState<boolean>(false);

    const login = async (userId:string, userName: string, identityToken:any) => {
        setLoading(true);
        const result = await loginUserWithApple({ userId, userName, identityToken });
        setLoading(false);
        setUserInfo({ ...result, isLoggedIn: true });
    }

    async function onAppleButtonPress() {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
        if (credentialState === appleAuth.State.AUTHORIZED) {
            login(appleAuthRequestResponse.user, `${appleAuthRequestResponse.fullName?.givenName} ${appleAuthRequestResponse.fullName?.familyName}` appleAuthRequestResponse.identityToken)
        }
    }
    return (
        <Box>
            <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                    alignSelf: 'center',
                    width: Dimensions.get('window').width / 1.2,
                    height: 45,
                }}
                onPress={() => onAppleButtonPress()}
            />
        </Box>
    )
};

export default LoginButtonSection;