import { Box, Button, ButtonText, CloseIcon, FormControl, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";
import { useState } from "react";
import { loginUserWithApple } from "../../../api/userAPI";

const LoginButtonSection: React.FC = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("Kevin");
    const [email, setEmail] = useState<string>("");
    const [appleID, setAppleId] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const login = async () => {
        setLoading(true);
        const result = await loginUserWithApple({ fullName, email, appleID });
        setLoading(false);
        setUserInfo({ ...result, isLoggedIn: true });
    }
    return (
        <Box>
            <Button onPress={() => setShowModal(true)}>
                <ButtonText>Login</ButtonText>
            </Button>
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