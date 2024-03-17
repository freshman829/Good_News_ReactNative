import React, { useState } from "react";
import { Box, Text, CloseIcon, FormControl, FormControlLabel, FormControlLabelText, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Pressable, VStack, View, ButtonGroup, Button, ButtonText, ModalFooter } from "@gluestack-ui/themed";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { formatDateInYMD } from "../../../utils/numberUtil";
import { useUserInfoStore } from '../../../store/UserStore';
import { saveProgramDuration } from "../../../api/userAPI";
import { useToastr } from "../../../providers/ToastProvider";
const ProgramDateSelect = () => {
    const [isShowProgramModal, setShowModal] = useState(true);
    const [pickerShow, setPickerShow] = useState(false);
    const [startDate, setDate] = useState<Date>(new Date());
    const [duration, setDuration] = useState<number>(14);
    const { userInfo, setUserInfo } = useUserInfoStore();
    const toastr = useToastr();

    const SelectStartTime = (e: DateTimePickerEvent, date?: Date) => {
        if (e.type === 'dismissed') {
            setPickerShow(false);
        } else if (e.type === 'set' && date) {
            setPickerShow(false);
            setDate(date);
        }
    };

    const saveProgramDate = async () => {
        const data = {
            id: userInfo._id,
            program: {
                start: startDate,
                duration
            }
        };
        const result = await saveProgramDuration(data);
        if (!result.success) {
            toastr?.showToast({ message: result.msg, options: "error" });
        } else {
            setUserInfo(result.data);
        }
    }

    return <Modal isOpen={isShowProgramModal}>
        <ModalBackdrop />
        <ModalContent>
            <ModalHeader>
                <Heading size="lg">Welcome to Good News</Heading>
                <ModalCloseButton>
                    <Icon as={CloseIcon} />
                </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
                <FormControl mb="$2">
                    <FormControlLabel mb="$1">
                        <FormControlLabelText>When is your program start date?</FormControlLabelText>
                    </FormControlLabel>
                    <View>
                        <Pressable onPress={() => setPickerShow(true)}>
                            <Text padding="$2" borderWidth="$1" $dark-borderColor="$backgroundLight200" borderColor="$backgroundDark200" rounded="$lg">{formatDateInYMD(startDate)}</Text>
                        </Pressable>
                    </View>
                    {pickerShow ? <RNDateTimePicker display="calendar" value={startDate} onChange={SelectStartTime} /> : ""}
                </FormControl>
                <FormControl>
                    <FormControlLabel mb="$1">
                        <FormControlLabelText>How many days is your program?</FormControlLabelText>
                    </FormControlLabel>
                    <View>
                        <Box
                            padding="$2" borderWidth="$1"
                            $dark-borderColor="$backgroundLight200"
                            borderColor="$backgroundDark200"
                            rounded="$lg"
                            display="flex" flexDirection="row"
                            alignItems="center" justifyContent="space-between">
                            <Text>{`${duration} days`}</Text>
                            <ButtonGroup isAttached>
                                <Button
                                    mr="$0" variant="outline"
                                    borderColor="$backgroundLight300"
                                    $dark-borderColor="$backgroundDark700"
                                    size="xs" borderRightWidth='$0'
                                    onPress={() => setDuration(prev => ((prev - 1) | 0))}>
                                    <ButtonText>-</ButtonText>
                                </Button>
                                <Button
                                    variant="outline" borderColor="$backgroundLight300"
                                    $dark-borderColor="$backgroundDark700" size="xs"
                                    onPress={() => setDuration(prev => prev + 1)}>
                                    <ButtonText>+</ButtonText>
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </View>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button
                    action={"primary"}
                    variant={"solid"}
                    size={"lg"}
                    isDisabled={!startDate || !duration}
                    onPress={saveProgramDate}
                >
                    <ButtonText>
                        Save
                    </ButtonText>
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>;
};
export default ProgramDateSelect;