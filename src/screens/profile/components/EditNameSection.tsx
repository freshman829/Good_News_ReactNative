import { Box, Button, ButtonText, Heading, Text, HStack, Icon, EditIcon, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, CloseIcon, ModalBody, FormControl, VStack, Input, InputField } from "@gluestack-ui/themed";
import { useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useUserInfoStore } from "../../../store/UserStore";
import { updateUserinfo } from "../../../api/userAPI";
import { useToastr } from "../../../providers/ToastProvider";

type EditNameSectionProps = {
    fullName: string
}
const EditNameSection: React.FC<EditNameSectionProps> = ({
    fullName
}) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState(fullName ?? "");
    const ref = useRef(null);
    const toast = useToastr();

    const handleClick = () => {
        setShowModal(true)
    }

    const handleSave = async () => {
        const result = await updateUserinfo({ ...userInfo, fullName: name });
        if (result.success) {
            setUserInfo({ ...userInfo, fullName: name });
            setShowModal(false);
            toast?.showToast({ title: "success", message: "Successfully", options: 'success' });
        }else {
            toast?.showToast({ title: "error", message: result.msg, options: 'error' });
        }
    }

    return (
        <>
            <HStack mt="$2">
                <Text>Name: {name!= "null null" ? name : ""}</Text>
                <TouchableOpacity onPress={handleClick}>
                    <Icon as={EditIcon} ml="$2" w="$4" h="$4"/>
                </TouchableOpacity>
            </HStack>
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
                        <Heading>Edit Profile Name</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <FormControl p="$4">
                            <VStack space="xl" mb="$4">
                                <Text lineHeight="$xs">
                                    User Name
                                </Text>
                                <Input>
                                    <InputField type="text" value={name} onChangeText={(e) => setName(e)}/>
                                </Input>
                            </VStack>
                            <Button ml="auto" onPress={handleSave}>
                                <ButtonText>Save</ButtonText>
                            </Button>
                        </FormControl>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditNameSection;