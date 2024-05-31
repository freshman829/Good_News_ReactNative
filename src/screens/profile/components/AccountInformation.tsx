import { HStack, Image, View, Text, Button, ButtonText, Heading, Icon, Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, CloseIcon, ModalBody, FormControl, VStack, Input, InputField } from "@gluestack-ui/themed"
import { useRef, useState } from "react";
import { updateUserinfo } from "../../../api/userAPI";
import { useUserInfoStore } from "../../../store/UserStore";


interface AccountInformationProps {
    fullName: string
};

const AccountInformation: React.FC<AccountInformationProps> = ({ fullName }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [name, setName] = useState(fullName ?? "");
    const ref = useRef(null);

    const handleClickEdit = () => {
        setShowModal(true);
    };

    const handleSave = async () => {
        const result = await updateUserinfo({ ...userInfo, fullName: name });
        if (result.success) {
            setUserInfo({ ...userInfo, fullName: name });
            setShowModal(false);
        }else {
        }
    };
    return (
        <View borderRadius="$lg" w="$full" $dark-backgroundColor="$backgroundDark900" backgroundColor="$textLight50" borderColor="$textLight200" p="$4">
            <HStack justifyContent="space-between" w="$full" alignItems="center">
                <Image source={require("../../../assets/images/user_1.png")} w="$16" h="$16" borderRadius={10} alt="" />
                <View>
                    <Text fontWeight="bold">{ userInfo.fullName || "CodeWizard" }</Text>
                    <Text>{ userInfo.email }</Text>
                </View>
                <Button
                    borderRadius="$lg"
                    px="$4"
                    size="xs"
                    onPress={() => handleClickEdit()}
                >
                    <ButtonText fontSize="$xs" size="xs">Edit</ButtonText>
                </Button>
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
        </View>
    )
}

export default AccountInformation;