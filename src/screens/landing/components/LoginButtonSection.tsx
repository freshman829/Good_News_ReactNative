import { Box, Button, ButtonText, CloseIcon, FormControl, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner } from "@gluestack-ui/themed";
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { Dimensions } from "react-native";
interface LoginButtonSectionProps {
    onLogin: () => void;
}
const LoginButtonSection: React.FC<LoginButtonSectionProps> = ({ onLogin }) => {
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
                onPress={() => onLogin()}
            />
        </Box>
    )
};

export default LoginButtonSection;