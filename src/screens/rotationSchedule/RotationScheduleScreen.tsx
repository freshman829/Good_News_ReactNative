import { Box, ChevronLeftIcon, Divider, FlatList, HStack, Heading, Icon, Switch, Text, VStack, View, Spinner, AccordionItem, AccordionHeader, AccordionTitleText, AccordionIcon, AccordionTrigger, AddIcon, RemoveIcon, AccordionContent, AccordionContentText, Accordion, ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon, ScrollView } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import SelectDropdown from "react-native-select-dropdown";
import { StyleSheet, Platform } from "react-native";
import TimePicker from "../../components/TimePicker";
import { useEffect, useRef, useState } from "react";
import { UserInterface, useUserInfoStore } from "../../store/UserStore";
import Notification from "../../utils/Notification";
import { saveRotationSchedule } from "../../api/userAPI";
import DropDownPicker from "react-native-dropdown-picker";
import { extractTime } from "../../utils/numberUtil";
import uuid from 'react-native-uuid'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageDatesNames } from "../../constants";
import { updateStoreDate } from "../../utils/common";

type RotationScheduleProps = NativeStackScreenProps<
    RootStackParamList,
    "RotationSchedule"
>;

const specialRotations = [
    { label: "2/7", value: 2 },
    { label: "3/7", value: 3 },
    { label: "4/7", value: 4 },
];

const maintenanceMode = [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 },
    { label: "Post-Maintenance", value: 2 }
];

interface AlarmPlan {
    plan?: number;
    mode?: number;
    wakeTime?: string;
    sleepTime?: string;
    isConfirm?: boolean;
    alarms?: [];
}

const RotationScheduleScreen: React.FC<RotationScheduleProps> = ({ navigation }) => {
    const init = useRef(true);
    const { userInfo, setUserInfo } = useUserInfoStore();
    const isInitialMount = useRef(true);
    const [openSpecial, setOpenSpecial] = useState(false);
    const [special, setSpecial] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFirst, setIsFirst] = useState(true);
    const [expanded, setIsExpanded] = useState(false);
    const [isWakeDropdownOpen, setIsWakeDropdownOpen] = useState(false);
    const [isSleepDropdownOpen, setIsSleepDropdownOpen] = useState(false);

    useEffect(() => {
        setSpecial(userInfo.rotationPlan.plan);
    }, []);

    useEffect(() => {
        const saveUpdate = async () => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            } else {
                let hasUpdated = false;
                if (special !== userInfo.rotationPlan.plan) {
                    hasUpdated = true;
                }
                if (hasUpdated) {
                    const updatedUser = await updateInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, plan: special || 0 } });
                    if (updatedUser) {
                        setUserInfo(updatedUser);
                    }
                }
            }
        }
        if (init.current) {
            init.current = false;
        } else {
            saveUpdate();
        }
    }, [special]);

    useEffect(() => {
        if (!userInfo.rotationPlan.alarmTurn
            && userInfo.rotationPlan.plan >= 2
            && userInfo.rotationPlan.wakeTime
            && userInfo.rotationPlan.sleepTime
        ) {
            if (isFirst) {
                setIsFirst(false);
            } else {
                refreshAlarms();
            }
        }
    }, [userInfo.rotationPlan.wakeTime, userInfo.rotationPlan.sleepTime, userInfo.rotationPlan.alarmTurn, userInfo.rotationPlan.plan]);

    useEffect(() => {
        const checkExpiredTime = async () => {
            await AsyncStorage.getItem(StorageDatesNames.alarm).then((value) => {
                console.log("alrm date: ", value);
                if (value) {
                    const alarmDate = new Date(value);
                    const today = new Date();
                    if (today > alarmDate) {
                        console.log("Alarm date is expired", alarmDate);
                        refreshAlarms();
                    }
                } else {
                    refreshAlarms();
                }
            });
        };

        checkExpiredTime();
    }, []);

    useEffect(() => {
        renderConfirmAlarm();
    }, [userInfo.rotationPlan.isConfirm]);

    const updateInfo = async (updateData: UserInterface): Promise<UserInterface> => {
        const result = await saveRotationSchedule(updateData);
        return result;
    }

    const renderConfirmAlarm = async () => {
        const alarms = [...userInfo.rotationPlan.alarms];
        if (userInfo.rotationPlan.isConfirm) {
            let append = [];
            if (alarms.find((alarm) => alarm.isConfirm)) return;
            for (let i = 0; i < alarms.length; i++) {
                let alarm = { ...alarms[i] };
                let confirmationTime = new Date(alarm.timeDate);
                confirmationTime.setMinutes(confirmationTime.getMinutes() + 5);

                if (confirmationTime > new Date()) {
                    let confirmationAlarm = {
                        id: uuid.v4(),
                        time: formatDate(confirmationTime),
                        timeDate: confirmationTime,
                        isSpecial: alarm.isConfirm,
                        isActive: true,
                        isConfirm: true
                    };
                    try {
                        await Notification.scheduleNotification({
                            id: (confirmationAlarm.id).toString(),
                            reminder: confirmationAlarm.isSpecial ? "It's special time to rotate" : "It's time to rotate",
                            date: (confirmationAlarm.timeDate) as Date
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    append.push(confirmationAlarm);
                }
            }

            const updatedData = await updateInfo({
                ...userInfo,
                rotationPlan: {
                  ...userInfo.rotationPlan,
                  alarms: alarms
                    .concat(append)
                    .sort((a: any, b: any) => new Date(a.timeDate) - new Date(b.timeDate))
                }
            });

            setUserInfo(updatedData);
        } else {
            const newAlarms = [];
            for (let i = 0; i < alarms.length; i++) {
                const alarm = alarms[i];
                if (!alarm.isConfirm) {
                    newAlarms.push(alarm);
                } else {
                    try {
                        await Notification.cancelNotification(alarm.id);
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            const updatedData = await updateInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: newAlarms } });
            setUserInfo(updatedData);
        }
    }

    const refreshAlarms = async () => {
        setIsLoading(true);
        await Notification.cancelAllNotifications();

        setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: [] } });

        const today = new Date();
        let programEndDate = new Date(userInfo.rotationPlan.programStartDate || today);
        programEndDate.setDate(today.getDate() + (userInfo.rotationPlan.programDays || 14));

        if (today > programEndDate) {
            // No alarms to generate if the end date is in the past
            const updatedData = await updateInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: [] } });
            updateStoreDate(StorageDatesNames.alarm);
            setUserInfo(updatedData);
            return;
        }

        let generatedAlarms: any[] = [];

        // Logic to generate alarms from today until the end date, inclusive
        let currentDate = new Date();
        while (currentDate <= programEndDate) {
            let temp = await generateAlarms(currentDate);
            generatedAlarms = generatedAlarms.concat(temp);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, programStartDate: new Date(), programDays: 14, alarms: generatedAlarms } });
        const updatedData = await updateInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, programStartDate: new Date(), programDays: 14, alarms: generatedAlarms } });
        updateStoreDate(StorageDatesNames.alarm);
        setIsLoading(false);
    };
    const generateAlarms = async (day: Date) => {
        const times = new Set();
        const alarmStatesSet = new Set();

        const defaultWakeTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 7, 0, 0);
        const defaultSleepTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 22, 0, 0);
        let wakeTime = userInfo.rotationPlan.wakeTime ?
            new Date(defaultWakeTime.getFullYear(),
                defaultWakeTime.getMonth(),
                defaultWakeTime.getDate(),
                extractTime(userInfo.rotationPlan.wakeTime).hours,
                extractTime(userInfo.rotationPlan.wakeTime).minutes, 0
            ) : defaultWakeTime;
        let sleepTime = userInfo.rotationPlan.sleepTime ?
            new Date(defaultSleepTime.getFullYear(),
                defaultSleepTime.getMonth(),
                defaultSleepTime.getDate(),
                extractTime(userInfo.rotationPlan.sleepTime).hours,
                extractTime(userInfo.rotationPlan.sleepTime).minutes, 0
            ) : defaultSleepTime;

        if (wakeTime.getMinutes() !== 0) {
            wakeTime.setMinutes(0);
        }
        if (sleepTime.getMinutes() !== 0) {
            sleepTime.setMinutes(0);
        }

        // times.add(wakeTime);
        // times.add(sleepTime);
        if (userInfo.rotationPlan.plan === 4) {
            let nextAlarm = new Date(wakeTime);
            while (nextAlarm <= sleepTime) {
                times.add(new Date(nextAlarm));
                nextAlarm.setMinutes(nextAlarm.getMinutes() + 90);
            }
        } else {
            let nextAlarm = new Date(wakeTime);
            while (nextAlarm <= sleepTime) {
                times.add(new Date(nextAlarm));
                nextAlarm.setMinutes(nextAlarm.getMinutes() + 120);
            }
        }

        for (const time of times) {
            let isSpecial = false;
            switch (userInfo.rotationPlan.plan) {
                case 2:
                    if ((time as Date).getHours() === 14) isSpecial = true;
                    else if ((time as Date).getHours() === 19) isSpecial = true;
                    break;
                case 3:
                    if ((time as Date).getHours() === 15) isSpecial = true;
                    else if ((time as Date).getHours() === 19) isSpecial = true;
                    break;
                case 4:
                    if ((time as Date).getHours() === 16) isSpecial = true;
                    else if ((time as Date).getHours() === 19) isSpecial = true;
                    break;

                default:
                    break;
            }
            const newAlarm = {
                id: uuid.v4(),
                time: formatDate(time as Date),
                timeDate: time,
                isSpecial,
                isActive: true
            };
            
            if (new Date() < ((newAlarm.timeDate) as Date)) {
                alarmStatesSet.add(newAlarm);
                try {
                    await Notification.scheduleNotification({
                        id: (newAlarm.id).toString(),
                        reminder: isSpecial ? "It's special time to rotate" : "It's time to rotate",
                        date: (newAlarm.timeDate) as Date
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
        let alrms = Array.from(alarmStatesSet).sort((a: any, b: any) => a.timeDate - b.timeDate);
        return alrms;
    }

    function formatDate(date: Date) {
        return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', weekday: "short" });
    }

    async function updateAlarm(item: {
        id: string,
        time: string,
        timeDate: unknown,
        isSpecial: boolean,
        isActive: boolean
    }) {
        let alarms = userInfo.rotationPlan.alarms;
        alarms.forEach(alarm => {
            if (alarm.id === item.id) {
                alarm.isActive = !alarm.isActive;
            }
        });
        setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: alarms } });
        if (item.isActive) {
            await Notification.toggleNotification({ id: item.id });
        } else {
            await Notification.toggleNotification({
                id: item.id,
                reminder: item.isSpecial ? "It's special time to rotate" : "It's time to rotate",
                date: new Date(item.timeDate)
            })
        }
        await updateInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: alarms } });
    }

    const renderAlarmItem = (item: any) => {
        return (
            <Box
                borderBottomWidth="$1"
                borderColor="$trueGray300"
                $dark-borderColor="$trueGray100"
                $base-pl="$0"
                $base-pr="$0"
                $sm-pl="$4"
                $sm-pr="$4"
                py="$2"
            >
                <HStack justifyContent="space-between">
                    <Text size="md" bold={item.item.isSpecial}>{item.item.time}</Text>
                    <Switch value={item.item.isActive} onChange={() => updateAlarm(item.item)} />
                </HStack>
            </Box>
        )
    }

    const updateTime = async (time: string, isWake: boolean) => {
        let dataToBeUpdate;
        if (isWake) {
            dataToBeUpdate = { ...userInfo, rotationPlan: { ...userInfo.rotationPlan, wakeTime: time } };
        } else {
            dataToBeUpdate = { ...userInfo, rotationPlan: { ...userInfo.rotationPlan, sleepTime: time } };
        }

        const updatedData = await updateInfo(dataToBeUpdate);
        setUserInfo(updatedData);
    }

    return (
        <View p="$5" pb="$0" display="flex" justifyContent="space-between" h="$full" backgroundColor="$backgroundDefault">
            <HStack alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>
            <VStack flex={1} overflow="scroll">
                <Accordion>
                    <AccordionItem
                        value="item-1"
                    >
                        <AccordionHeader>
                            <AccordionTrigger>
                                {({ isExpanded }) => {
                                    setIsExpanded(isExpanded);
                                    return (
                                        <>
                                            <AccordionTitleText>
                                                Rotation Schedule
                                            </AccordionTitleText>
                                            {isExpanded ? (
                                                <AccordionIcon as={ChevronUpIcon} />
                                            ) : (
                                                <AccordionIcon as={ChevronDownIcon} />
                                            )}
                                        </>
                                    )
                                }}
                            </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionContent>
                            <View style={{ zIndex: 9999 }}>
                                <HStack justifyContent="space-between" pb="$2">
                                    <Text size="sm" maxWidth="$5/6">Are you on maintenance / post maintenance mode?</Text>
                                    <Switch 
                                        value={userInfo?.rotationPlan.alarmTurn} 
                                        onToggle={() => setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarmTurn: !userInfo.rotationPlan.alarmTurn } })} 
                                    />
                                </HStack>
                            </View>
                            {!userInfo.rotationPlan.alarmTurn ? (
                                <VStack h={isWakeDropdownOpen ? 350 : isSleepDropdownOpen ? 350 : "$full"} gap="$3">
                                    <View style={{ zIndex: 8888 }}>
                                        <HStack justifyContent="space-between" alignItems="center">
                                            <Text size="sm" maxWidth="$4/6">What are your special rotation times?</Text>
                                            <DropDownPicker
                                                open={openSpecial}
                                                value={userInfo.rotationPlan.plan}
                                                items={specialRotations}
                                                setOpen={setOpenSpecial}
                                                setValue={setSpecial}
                                                style={{ width: 100 }}
                                                containerStyle={{ width: 100 }}
                                            />
                                        </HStack>
                                    </View>
                                    {userInfo.rotationPlan.plan >= 2 ? <View style={{ zIndex: 7777 }}>
                                        <HStack>
                                            <Box flex={1}>
                                                <Text size="sm">When do you wake up?</Text>
                                                <TimePicker isWake={true}
                                                    value={userInfo.rotationPlan.wakeTime}
                                                    setTime={(time) => {
                                                        time && updateTime(time, true)
                                                    }
                                                    }
                                                    setIsOpen={(open) => setIsWakeDropdownOpen(open)}
                                                />
                                            </Box>
                                            <Box flex={1}>
                                                <Text size="sm">When do you go to sleep?</Text>
                                                <TimePicker isWake={false}
                                                    value={userInfo.rotationPlan.sleepTime}
                                                    setTime={(time) => {
                                                        time && updateTime(time, false)
                                                    }
                                                    }
                                                    setIsOpen={(open) => setIsSleepDropdownOpen(open)}
                                                />
                                            </Box>
                                        </HStack>
                                    </View> : ""}
                                </VStack>
                            ) : (
                                <Text zIndex={-1}>You do not need to rotate on a schedule while in Maintenance Mode. If you feel a craving, feel free to rotate the spheres as needed.</Text>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                {!userInfo.rotationPlan.alarmTurn ? (
                    <VStack h="$full" pb={expanded ? 360 : 120} mt="$10" overflow="scroll">
                        {isLoading ? (
                            <Spinner size="small" />
                        ) : (
                            <>
                                {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ?
                                    <HStack alignItems="center" justifyContent="space-between">
                                        <Heading size="sm">Confirmation Alarm</Heading>
                                        <Switch value={userInfo?.rotationPlan.isConfirm} onToggle={() => setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: !userInfo.rotationPlan.isConfirm } })} />
                                    </HStack> : ""
                                }
                                {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ? <Divider my="$3" /> : ""}
                                {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ?
                                    <Heading size="sm" textAlign="center">Your Rotation Schedule & Alarms</Heading> : ""
                                }
                                {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ?
                                    <FlatList
                                        data={userInfo.rotationPlan.alarms}
                                        renderItem={renderAlarmItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        px="$3"
                                    /> : ""
                                }
                            </>
                        )}
                    </VStack>
                ) : (
                    <></>
                )}
            </VStack>
            <Box p="$2">
                <Text mb="$4" textAlign="center">Book Appointment</Text>
            </Box>

        </View>
    )
};

const styles = StyleSheet.create({
    dropwdownBtnStyle: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdownBtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdownDropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdownRowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdownRowTxtStyle: { color: '#444', textAlign: 'left' },
    picker: {
        height: 50,
        width: 120,
    },
})

export default RotationScheduleScreen;