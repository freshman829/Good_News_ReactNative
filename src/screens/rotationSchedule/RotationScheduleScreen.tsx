import { Box, ChevronLeftIcon, Divider, FlatList, HStack, Heading, Icon, Switch, Text, VStack, View } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import SelectDropdown from "react-native-select-dropdown";
import { StyleSheet, Platform } from "react-native";
import TimePicker from "../../components/TimePicker";
import { useEffect, useRef, useState } from "react";
import { useUserInfoStore } from "../../store/UserStore";
import Notification from "../../utils/Notification";
import { saveRotationSchedule } from "../../api/userAPI";
import DropDownPicker from "react-native-dropdown-picker";
import { extractTime } from "../../utils/numberUtil";

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
    const { userInfo, setUserInfo } = useUserInfoStore();
    const isInitialMount = useRef(true);
    const [openMode, setOpenMode] = useState(false);
    const [mode, setMode] = useState(0);
    const [openSpecial, setOpenSpecial] = useState(false);
    const [special, setSpecial] = useState<number | undefined>();

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (userInfo.mode !== 0 && userInfo.plan >= 2) {
                refreshAlarms();
            }
        }
    }, [userInfo.mode, userInfo.plan, userInfo.isConfirm, userInfo.wakeTime, userInfo.sleepTime]);
    useEffect(() => {
        if (mode) {
            setUserInfo({ ...userInfo, mode });
        }
    }, [mode]);
    useEffect(() => {
        if (special) {
            setUserInfo({ ...userInfo, mode });
        }
    }, [special]);
    useEffect(() => {
        const updateInfo = async () => {
            const result = await saveRotationSchedule(userInfo);
        }
        if (!isInitialMount.current) {
            updateInfo();
        }
    }, [userInfo]);

    const refreshAlarms = async () => {
        await Notification.cancelAllNotifications();
        const today = new Date();
        let programEndDate = userInfo.programStartDate || today;
        programEndDate.setDate(today.getDate() + userInfo.programDays);

        if (today > programEndDate) {
            // No alarms to generate if the end date is in the past
            setUserInfo({ ...userInfo, alarms: [] });
            return;
        }

        let generatedAlarms: any[] = [];

        // Logic to generate alarms from today until the end date, inclusive
        let currentDate = new Date();
        while (currentDate <= programEndDate) {
            generatedAlarms = generatedAlarms.concat(generateAlarms(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Update user alarm states with the generated alarms
        setUserInfo({ ...userInfo, alarms: generatedAlarms });
    };
    const generateAlarms = async (day: Date) => {
        const times = new Set();
        const alarmStatesSet = new Set();

        const defaultWakeTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 7, 0, 0);
        const defaultSleepTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 22, 0, 0);

        let wakeTime = userInfo.wakeTime ?
            new Date(defaultWakeTime.getFullYear(),
                defaultWakeTime.getMonth(),
                defaultWakeTime.getDate(),
                extractTime(userInfo.wakeTime).hours,
                extractTime(userInfo.wakeTime).minutes, 0
            ) : defaultWakeTime;
        let sleepTime = userInfo.sleepTime ?
            new Date(defaultSleepTime.getFullYear(),
                defaultSleepTime.getMonth(),
                defaultSleepTime.getDate(),
                extractTime(userInfo.sleepTime).hours,
                extractTime(userInfo.sleepTime).minutes, 0
            ) : defaultSleepTime;

        if (wakeTime.getMinutes() !== 0) {
            wakeTime.setMinutes(0);
        }
        if (sleepTime.getMinutes() !== 0) {
            sleepTime.setMinutes(0);
        }

        times.add(wakeTime);
        times.add(sleepTime);

        if (userInfo.plan === 4) {
            let nextAlarm = new Date(wakeTime);
            while (nextAlarm < sleepTime) {
                times.add(new Date(nextAlarm));
                nextAlarm.setMinutes(nextAlarm.getMinutes() + 90);
            }
        } else {
            let nextAlarm = new Date(wakeTime);
            while (nextAlarm < sleepTime) {
                times.add(new Date(nextAlarm));
                nextAlarm.setMinutes(nextAlarm.getMinutes() + 120);
            }
        }

        for (const time of times) {
            let isSpecial = false;
            switch (userInfo.plan) {
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
                id: alarmStatesSet.size,
                time: formatDate(time as Date),
                timeDate: time,
                isSpecial,
                isActive: true
            };
            alarmStatesSet.add(newAlarm);
            try {
                await Notification.scheduleNotification({
                    id: (newAlarm.id - 1).toString(),
                    reminder: isSpecial ? "It's special time to rotate" : "It's time to rotate",
                    date: (newAlarm.timeDate) as Date
                });
            } catch (error) {
                console.log(error);
            }

            if (userInfo.isConfirm) {
                const confirmationTime = new Date(time as Date);
                confirmationTime.setMinutes(confirmationTime.getMinutes() + 5);
                const confirmationAlarm = {
                    id: alarmStatesSet.size,
                    time: formatDate(confirmationTime),
                    timeDate: confirmationTime,
                    isSpecial,
                    isActive: true
                };
                try {
                    await Notification.scheduleNotification({
                        id: (confirmationAlarm.id - 1).toString(),
                        reminder: isSpecial ? "It's special time to rotate" : "It's time to rotate",
                        date: (confirmationAlarm.timeDate) as Date
                    });
                } catch (error) {
                    console.log(error);
                }
                alarmStatesSet.add(confirmationAlarm);
            }
        }

        return Array.from(alarmStatesSet).sort((a: any, b: any) => a.timeDate - b.timeDate);
    }

    function formatDate(date: Date) {
        return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', weekday: "short" });
    }

    async function updateAlarm(item: {
        id: number,
        time: string,
        timeDate: unknown,
        isSpecial: boolean,
        isActive: boolean
    }) {
        let alarms = userInfo.alarms;
        alarms.forEach(alarm => {
            if (alarm.id === item.id) {
                alarm.isActive = !alarm.isActive;
            }
        });
        if (item.isActive) {
            await Notification.toggleNotification({ id: item.id.toString() });
        } else {
            await Notification.toggleNotification({
                id: item.id.toString(),
                reminder: item.isSpecial ? "It's special time to rotate" : "It's time to rotate",
                date: item.timeDate as Date
            })
        }
        setUserInfo({ ...userInfo, alarms: alarms })
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
                    <Text size="md" color="$secondary800" bold={item.item.isSpecial}>{item.item.time}</Text>
                    <Switch value={true} onChange={() => updateAlarm(item.item)} />
                </HStack>
            </Box>
        )
    }


    return (
        <View p="$5" pb="$0" display="flex" justifyContent="space-between" h="$full">
            <HStack alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>
            <VStack flex={1} overflow="scroll">
                <Heading textAlign="center" my="$10">Rotation Schedule</Heading>
                <HStack pb="$2">
                    <Heading size="sm" maxWidth="$4/5">Are you on maintenance / post maintenance mode?</Heading>
                    <DropDownPicker
                        open={openMode}
                        value={userInfo.mode}
                        items={maintenanceMode}
                        setOpen={setOpenMode}
                        setValue={setMode}
                        style={{ width: 150 }}
                        containerStyle={{ width: 150 }}
                    />
                </HStack>
                {(userInfo.mode > 0) ? (
                    <VStack h="$full" gap="$3">
                        <HStack alignItems="center">
                            <Text maxWidth="$3/5">What are your special rotation times?</Text>
                            <DropDownPicker
                                open={openSpecial}
                                value={userInfo.plan}
                                items={specialRotations}
                                setOpen={setOpenSpecial}
                                setValue={setSpecial}
                                style={{ width: 150 }}
                                containerStyle={{ width: 150 }}
                            />
                        </HStack>
                        <HStack>
                            <Box flex={1}>
                                <Text maxWidth="$32">When do you wake up?</Text>
                                <TimePicker isWake={true}
                                    value={userInfo.wakeTime}
                                    setTime={(time) =>
                                        time && setUserInfo({
                                            ...userInfo,
                                            wakeTime: time
                                        })
                                    }
                                />
                            </Box>
                            <Box flex={1}>
                                <Text maxWidth="$32">When do you go to sleep?</Text>
                                <TimePicker isWake={false}
                                    value={userInfo.sleepTime}
                                    setTime={(time) =>
                                        time && setUserInfo({
                                            ...userInfo,
                                            sleepTime: time
                                        })
                                    }
                                />
                            </Box>
                        </HStack>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text size="sm">Confirmation Alarm</Text>
                            <Switch value={userInfo?.isConfirm} onToggle={() => setUserInfo({ ...userInfo, isConfirm: !userInfo.isConfirm })} />
                        </HStack>
                        <Divider my="$3" />
                        <Heading size="sm" textAlign="center">Your Rotation Schedule & Alarms</Heading>
                        <FlatList
                            data={userInfo.alarms}
                            renderItem={renderAlarmItem}
                            keyExtractor={(item, index) => index.toString()}
                            px="$3"
                        />
                    </VStack>
                ) : (
                    <Text>You do not need to rotate on a schedule while in Maintenance Mode. If you feel a craving, feel free to rotate the spheres as needed.</Text>
                )}
            </VStack>
            <Box p="$2">
                <Text textAlign="center">Book Appointment</Text>
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