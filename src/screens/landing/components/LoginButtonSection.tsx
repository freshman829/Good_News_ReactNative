import { Box, Button, ButtonText, CloseIcon, FormControl, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner, VStack } from "@gluestack-ui/themed";
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { Dimensions, Platform, TouchableOpacity } from "react-native";
interface LoginButtonSectionProps {
    isLoading: boolean,
    onAppleLogin: () => void;
    onGoogleLogin: () => void;
}
const LoginButtonSection: React.FC<LoginButtonSectionProps> = ({ isLoading, onAppleLogin, onGoogleLogin }) => {
    return (
        <Box>
            {isLoading ? (
                <Button
                    variant="outline"
                    style={{
                        alignSelf: 'center',
                        width: Dimensions.get('window').width / 1.5,
                        height: 45
                    }}>
                    <ButtonText>
                        <Spinner size="small" />
                    </ButtonText>
                </Button>
            ) : (
                <VStack gap={2}>
                    <TouchableOpacity>
                        <Button
                            variant="outline"
                            style={{
                                alignSelf: 'center',
                                width: Dimensions.get('window').width / 1.5,
                                height: 45
                            }}
                            onPress={() => onAppleLogin()}>
                            <ButtonText>Sign in with Apple</ButtonText>
                        </Button>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Button
                            variant="outline"
                            style={{
                                alignSelf: 'center',
                                width: Dimensions.get('window').width / 1.5,
                                height: 45
                            }}
                            onPress={() => onGoogleLogin()}>
                            <ButtonText>Sign in with Google</ButtonText>
                        </Button>
                    </TouchableOpacity>
                </VStack>
            )}
        </Box>
    )
};

export default LoginButtonSection;