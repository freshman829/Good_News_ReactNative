import { useState, useEffect } from "react";
import { Heading, VStack, HStack, ButtonGroup, Button, ButtonText, Text, Divider, Pressable, Switch } from "@gluestack-ui/themed";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useUserInfoStore } from "../../../../store/UserStore";
import { PlanConstants } from "../../../../constants";
import { formatDateInYMD } from "../../../../utils/numberUtil";


const FinalGoals = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [picker, setPicker] = useState(false);
    const [appointPicker, setAppointPicker] = useState(false);
    const [showNextAppointment, setShowNextAppointment] = useState(false);
    
    useEffect(() => {
        setShowNextAppointment(userInfo.nextAppointment ? true : false);
    }, [userInfo.nextAppointment]);

    const toggleNextAppoint = () => {
        if (showNextAppointment) {
            setUserInfo({ ...userInfo, nextAppointment: undefined })
        }
        setShowNextAppointment(prev => !prev);
    };

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

    const SelectStartTime = (e: DateTimePickerEvent, date?: Date) => {
        if (e.type === 'dismissed') {
            setPicker(false);
        } else if (e.type === 'set' && date) {
            setPicker(false);
            setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, programStartDate: date } });
        }
    };

    const selectNextAppointment = (e: DateTimePickerEvent, date?: Date) => {
        if (e.type === 'dismissed') {
            setAppointPicker(false);
        }
        else if (e.type === 'set' && date) {
            setAppointPicker(false);
            setUserInfo({ ...userInfo, nextAppointment: date });
        }
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
    return (
        <VStack gap={4} mt={16}>
            <Heading size="sm">Goals & Program Info</Heading>
            <HStack display="flex" justifyContent="space-between" alignItems="center" mt={8}>
                <VStack>
                    <Text maxWidth="$4/5">How many days is your program? {userInfo.rotationPlan.programDays} days</Text>
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
            <Divider mt={6} />
            <VStack gap={8} mt={8}>
                <Text textAlign="center">When is your next appointment?</Text>
                {showNextAppointment ?
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text maxWidth="$1/2">Select a Date</Text>
                        <Pressable onPress={() => setAppointPicker(true)}>
                            <Text p="$2" rounded="$lg" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200" minWidth="$24">
                                {userInfo.nextAppointment ? formatDateInYMD(userInfo.nextAppointment) : "select a appointment"}
                            </Text>
                        </Pressable>
                        {appointPicker ? <RNDateTimePicker display="calendar" value={userInfo.nextAppointment || new Date()} onChange={selectNextAppointment} /> : ""}
                    </HStack>
                    : ""
                }
                <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$4">
                    <Text maxWidth="$2/3">I don't have an appointment</Text>
                    <Switch value={!showNextAppointment} onToggle={() => toggleNextAppoint()} />
                </HStack>
            </VStack>
            <Divider mt={6} />
            <VStack mt={6}>
                <Text textAlign="center">Are you in maintenance/after maintenance mode?</Text>
                <ButtonGroup isAttached mt="$4" alignContent="center" alignItems="center">
                    <Button
                        variant="outline"
                        rounded="$md"
                        borderColor="$backgroundLight300"
                        $dark-borderColor="$backgroundDark700"
                        $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.YES ? "$backgroundDefault" : "$backgroundLight200"}
                        backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.YES ? "$backgroundDefault" : "$backgroundDark200"}
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
                        $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.NO ? "$backgroundDefault" : "$backgroundLight200"}
                        backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.NO ? "$backgroundDefault" : "$backgroundDark200"}
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
                        $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.POST ? "$backgroundDefault" : "$backgroundLight200"}
                        backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.POST ? "$backgroundDefault" : "$backgroundDark200"}
                        size="xs" borderRightWidth='$0'
                        onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.POST)}
                    >
                        <ButtonText>After Maint</ButtonText>
                    </Button>
                </ButtonGroup>
            </VStack>
        </VStack>
    )
}

export default FinalGoals;