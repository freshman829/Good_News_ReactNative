import { HStack, Heading, VStack, Text, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, Icon, CloseIcon, ModalBody, Button, Box } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../../store/UserStore";
import { useRef, useState } from "react";
import FWeightStep from "../FWeightStep";


const FinalSocialDays = () => {
    const {userInfo, setUserInfo} = useUserInfoStore();
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);

    const handleClick = () => {
        setShowModal(true);
    }
    return (
        <Box>
            <VStack mt={16} gap={6}>
                <Heading size="sm"> Social Days</Heading>
                <VStack mt={8}>
                    {userInfo.socialDays.length > 0 && userInfo.socialDays.map((item) => (
                        <Text>{item}</Text>
                    ))}
                </VStack>
                <Text color="blue" onPress={() => handleClick()}>Edit Social Days</Text>
            </VStack>
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false)
                }}
                size="lg"
                finalFocusRef={ref}
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading>Social Days</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <FWeightStep finalStep={true} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default FinalSocialDays;