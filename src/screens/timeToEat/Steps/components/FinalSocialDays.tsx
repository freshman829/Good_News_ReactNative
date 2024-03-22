import { Heading, VStack, Text, Modal, ModalBackdrop, ModalContent, ModalBody, ModalFooter, Button, ButtonText } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../../store/UserStore";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { convertDateString } from "../../../../utils/numberUtil";

const FinalSocialDays = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [isEditing, setIsEditing] = useState(false);

    const editSocialDays = () => {
        setIsEditing(true);
    }

    const selectDay = (date: string) => {
        if (userInfo.socialDays.includes(date)) {
            let filterDays = userInfo.socialDays.filter((item) => item !== date);
            setUserInfo({ ...userInfo, socialDays: [...filterDays] });
        } else {
            setUserInfo({ ...userInfo, socialDays: [...userInfo.socialDays, date] });
        }
    }

    return (
        <VStack mt={16} gap={6}>
            <Heading size="sm"> Social Days</Heading>
            <VStack mt={8}>
                {userInfo.socialDays.length > 0 && userInfo.socialDays.map((item, index) => (
                    <Text key={index}>{convertDateString(item)}</Text>
                ))}
            </VStack>
            <Text onPress={editSocialDays} color="blue">Edit Social Days</Text>
            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalBody pt="$4">
                        <Calendar
                            onDayPress={(day) => selectDay(day.dateString)}
                            markedDates={userInfo.socialDays.reduce((acc, date) => {
                                acc[date] = { selected: true, marked: true };
                                return acc;
                            }, {})}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setIsEditing(false)
                            }}
                        >
                            <ButtonText>Close</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    )
}

export default FinalSocialDays;