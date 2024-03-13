import { Box, Button, ButtonText, CloseIcon, FormControl, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";
import { useState } from "react";
import { loginUserWithApple } from "../../../api/userAPI";
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { Dimensions } from "react-native";

const LoginButtonSection: React.FC = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("Kevin");
    const [email, setEmail] = useState<string>("");
    const [appleID, setAppleId] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);

    const login = async (userId:string, userName: string, identityToken:any) => {
        setLoading(true);
        const result = await loginUserWithApple({ userId, userName, identityToken });
        console.log('AAA', result)
        setLoading(false);
        setUserInfo({ ...result, isLoggedIn: true });
    }

    async function onAppleButtonPress() {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });
        console.log('USER', appleAuthRequestResponse)
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
            {showModal ? (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                >
                    <ModalBackdrop />
                    <ModalContent>
                        <ModalHeader>
                            <Heading size="lg">Login with Apple ID</Heading>
                            <ModalCloseButton>
                                <Icon as={CloseIcon} />
                            </ModalCloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <Box>
                                <FormControl
                                    size="md"
                                    isRequired={true}
                                    mb="$2"
                                >
                                    <Input>
                                        <InputField type="text" onChangeText={(e) => setAppleId(e)} placeholder="Apple ID" />
                                    </Input>
                                </FormControl>
                                <FormControl
                                    size="md"
                                    isRequired={true}
                                >
                                    <Input>
                                        <InputField type="text" placeholder="email" onChangeText={(e) => setEmail(e)} />
                                    </Input>
                                </FormControl>
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="outline"
                                size="sm"
                                action="secondary"
                                mr="$3"
                                onPress={() => setShowModal(false)}
                                disabled={isLoading}
                            >
                                <ButtonText>Cancel</ButtonText>
                            </Button>
                            <Button
                                size="sm"
                                action="positive"
                                borderWidth="$0"
                                onPress={login}
                                disabled={isLoading}
                            >
                                <ButtonText>{isLoading ? <Spinner size="small" color="$white500" /> : "Login"}</ButtonText>
                            </Button>
                        </ModalFooter>

                    </ModalContent>
                </Modal>
            ) : ""}
        </Box>
    )
};

export default LoginButtonSection;