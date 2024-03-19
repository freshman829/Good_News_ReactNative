import React from 'react';

import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, ButtonText, Divider, HStack, Heading, Pressable, Switch, Text, VStack } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";
import { formatDateInYMD } from "../../../utils/numberUtil";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
// import { MAINTAINENCE_MODE } from '../../../constants/plans';
import { PlanConstants } from '../../../constants';
const AWelcomeStep = () => {
    const {
        userInfo,
        setUserInfo
    } = useUserInfoStore();
    const [picker, setPicker] = useState(false);
    const [appointPicker, setAppointPicker] = useState(false);

    const changeNumber = (isPlus: boolean) => {
        let days = userInfo.rotationPlan.programDays;
        let afterChange = isPlus ? days + 1 : days - 1 || 0;
        setUserInfo({
            ...userInfo,
            rotationPlan: {
                ...userInfo.rotationPlan,
                programDays: afterChange
            }
        });
    };
    const toggleNextAppoint = () => {
        setUserInfo({
            ...userInfo,
            nextAppointment: undefined
        });
    };
    const SelectStartTime = (e: DateTimePickerEvent, date?: Date) => {
        if (e.type === 'dismissed') {
            setPicker(false);
        }
         else if (e.type === 'set' && date) {
            setPicker(false);
            setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, programStartDate: date } });
        }
    };

    const toggleNew = () => {
        setUserInfo({
            ...userInfo,
            firstRun: !userInfo.firstRun
        });
    };

    const changeMode = (mode: number) => {
        setUserInfo({
            ...userInfo,
            rotationPlan: {
                ...userInfo.rotationPlan,
                mode
            }
        })
    };

    return <Box p="$4">
        <VStack >
            <Heading>
                Welcome to the Sadkhin Program and the Good News App! We are customizing your personal daily food schedule
            </Heading>
            <Divider mt="$4" mb="$2" />
            <VStack >
                <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$2">
                    <Text maxWidth="$1/2">New To Program</Text>
                    <Switch value={userInfo.firstRun} onToggle={() => toggleNew()} />
                </HStack>
                {userInfo.firstRun ?
                    <VStack>
                        <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$2">
                            <Text maxWidth="$1/2">When is your program start date?</Text>
                            <Pressable onPress={() => setPicker(true)}>
                                <Text p="$2" rounded="$lg" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200">
                                    {userInfo.rotationPlan.programStartDate ? formatDateInYMD(userInfo.rotationPlan.programStartDate) : ""}
                                </Text>
                            </Pressable>
                            {picker ? <RNDateTimePicker display="calendar" value={new Date(userInfo.rotationPlan.programStartDate)} onChange={SelectStartTime} /> : ""}
                        </HStack>
                        <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$8">
                            <VStack>
                                <Text maxWidth="$2/3">How many days is your program?</Text>
                                <Text>{userInfo.rotationPlan.programDays} days</Text>
                            </VStack>
                            <ButtonGroup isAttached>
                                <Button mr="$0" variant="outline" borderColor="$backgroundLight300" $dark-borderColor="$backgroundDark700" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200" size="xs" borderRightWidth='$0' onPress={() => changeNumber(false)}>
                                    <ButtonText>-</ButtonText>
                                </Button>
                                <Button variant="outline" borderColor="$backgroundLight300" $dark-borderColor="$backgroundDark700" size="xs" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200" onPress={() => changeNumber(true)}>
                                    <ButtonText>+</ButtonText>
                                </Button>
                            </ButtonGroup>
                        </HStack>
                    </VStack> :
                    <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$2">
                        <Text maxWidth="$1/2">Are you on maintenance/post maintenance mode?</Text>

                        <ButtonGroup size={"sm"} isDisabled={false} isAttached

                        >
                            <Button
                                variant="outline"
                                rounded="$md"
                                borderColor="$backgroundLight300"
                                $dark-borderColor="$backgroundDark700"
                                $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.NO ? "$backgroundDefault" : "$backgroundLight200" }
                                backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.NO ? "$backgroundDefault" : "$backgroundDark200" }
                                size="xs" borderRightWidth='$0'
                                onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.NO)}
                            >
                                <ButtonText>No</ButtonText>
                            </Button>
                            <Button
                                variant="outline"
                                rounded="$md"
                                borderColor="$backgroundLight300"
                                $dark-borderColor="$backgroundDark700"
                                $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.YES ? "$backgroundDefault" : "$backgroundLight200" }
                                backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.YES ? "$backgroundDefault" : "$backgroundDark200" }
                                size="xs" borderRightWidth='$0'
                                onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.YES)}
                            >
                                <ButtonText>Yes</ButtonText>
                            </Button>
                            <Button
                                variant="outline"
                                rounded="$md"
                                borderColor="$backgroundLight300"
                                $dark-borderColor="$backgroundDark700"
                                $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.POST ? "$backgroundDefault" : "$backgroundLight200" }
                                backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.POST ? "$backgroundDefault" : "$backgroundDark200" }
                                size="xs" borderRightWidth='$0'
                                onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.POST)}
                            >
                                <ButtonText>Post-M...</ButtonText>
                            </Button>
                        </ButtonGroup>
                    </HStack>}
                <Text textAlign="center" my="$8">When is your next appointment?</Text>
                <HStack display="flex" justifyContent="space-between" alignItems="center">
                    <Text maxWidth="$1/2">Select a Date</Text>
                    <Pressable>
                        <Text p="$2" rounded="$lg" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200" minWidth="$24">
                            {"select a appointment"}
                        </Text>
                    </Pressable>
                    {appointPicker ? <RNDateTimePicker display="calendar" value={userInfo.rotationPlan.programStartDate} onChange={SelectStartTime} /> : ""}
                </HStack>
                {/* <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$4">
                        <Text maxWidth="$2/3">I don't have an appointment</Text>
                        <Switch value={userInfo.nextAppointment} onToggle={() => toggleNextAppoint()} />
                     </HStack> */}
            </VStack>
        </VStack>
    </Box>;
};
export default AWelcomeStep;