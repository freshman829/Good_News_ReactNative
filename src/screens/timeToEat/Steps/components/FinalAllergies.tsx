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
                <Heading color="$black" size="sm">
                    Allergies
                </Heading>
                <HStack mt={8}>
                    <Text color="$black" maxWidth="$2/3">Allergy to Fruits & Veggies:</Text>
                    <Text color="$black" maxWidth="$1/2"> {fvs === "" ? "None" : fvs}</Text>
                </HStack>
                <HStack>
                    <Text color="$black" maxWidth="$2/3">Allergy to Single Protein:</Text>
                    <Text color="$black" maxWidth="$1/2"> {proteins === "" ? "None" : proteins}</Text>
                </HStack>
                <Text color="blue" onPress={() => handleClick()} >Edit Allergies</Text>
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