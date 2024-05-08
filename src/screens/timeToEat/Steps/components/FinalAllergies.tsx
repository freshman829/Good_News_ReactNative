import { HStack, Heading, VStack, Text, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, Icon, CloseIcon, ModalBody, Button, Box } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../../store/UserStore";
import { useRef, useState } from "react";
import DAllergyStep from "../DAllergyStep";


const FinalAllergies = () => {
    const {userInfo, setUserInfo} = useUserInfoStore();
    const [showModal, setShowModal] = useState(false);
    const ref = useRef(null);

    const fvs = userInfo.allergies.fv.join(', ');
    const proteins = userInfo.allergies.protein.join(', ');

    const handleClick = () => {
        setShowModal(true);
    }

    return (
        <Box>
            <VStack mt={16} gap={7}>
                <Heading size="sm">
                    Allergies
                </Heading>
                <VStack mt={8} ml={6}>
                    <Text bold>Allergy to Fruits & Veggies:</Text>
                    <Text ml={16} minWidth="$1"> {fvs === "" ? "None" : fvs}</Text>
                </VStack>
                <VStack ml={6}>
                    <Text bold>Allergy to Single Protein:</Text>
                    <Text ml={16} minWidth="$1"> {proteins === "" ? "None" : proteins}</Text>
                </VStack>
                <Text color="$blue500" onPress={() => handleClick()} >Edit Allergies</Text>
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
                        <Heading></Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <DAllergyStep finalStep={true}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default FinalAllergies;