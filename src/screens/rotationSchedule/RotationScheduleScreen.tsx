import { Box, ChevronLeftIcon, Divider, FlatList, HStack, Heading, Icon, Switch, Text, VStack, View } from "@gluestack-ui/themed";
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
    const [special, setSpecial] = useState<number>(0);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let hasUpdated = false;
            if (mode !== userInfo.rotationPlan.mode) {
                hasUpdated = true;
            }
            if (special !== userInfo.rotationPlan.plan) {
                hasUpdated = true;
            }
            if (hasUpdated) {
                setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, mode, plan: special || 0 } });
            }
        }
    }, [mode, special]);

    useEffect(() => {
        if (!isInitialMount.current && userInfo.rotationPlan.mode > 0 && userInfo.rotationPlan.plan >= 2) {
            refreshAlarms();
        }
    }, [userInfo.rotationPlan.wakeTime, userInfo.rotationPlan.sleepTime]);

    useEffect(() => {
        const updateInfo = async () => {
            const result = await saveRotationSchedule(userInfo);
        }
        if (!isInitialMount.current) {
            updateInfo();
        }
    }, [userInfo.rotationPlan]);

    const refreshAlarms = async () => {
        await Notification.cancelAllNotifications();
        const today = new Date();
        let programEndDate = userInfo.rotationPlan.programStartDate || today;
        programEndDate.setDate(today.getDate() + userInfo.rotationPlan.programDays || 14);
        if (userInfo.rotationPlan.programStartDate && userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length) return;
        if (today > programEndDate) {
            
            // No alarms to generate if the end date is in the past
            setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: [] } });
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

        times.add(wakeTime);
        times.add(sleepTime);

        if (userInfo.rotationPlan.plan === 4) {
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
                console.log(error, "123123");
            }

            if (userInfo.rotationPlan.isConfirm) {
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
        let alrms = Array.from(alarmStatesSet).sort((a: any, b: any) => a.timeDate - b.timeDate);
        return alrms;
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
        let alarms = userInfo.rotationPlan.alarms;
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
        setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: alarms } })
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
                    <Switch value={item.item.isActive} onChange={() => updateAlarm(item.item)} />
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
                        value={userInfo.rotationPlan.mode}
                        items={maintenanceMode}
                        setOpen={setOpenMode}
                        setValue={setMode}
                        style={{ width: 100 }}
                        containerStyle={{ width: 100 }}
                    />
                </HStack>
                {(userInfo.rotationPlan.mode > 0) ? (
                    <VStack h="$full" gap="$3">
                        <HStack alignItems="center">
                            <Text maxWidth="$3/5">What are your special rotation times?</Text>
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
                        <HStack>
                            <Box flex={1}>
                                <Text maxWidth="$32">When do you wake up?</Text>
                                <TimePicker isWake={true}
                                    value={userInfo.rotationPlan.wakeTime}
                                    setTime={(time) =>
                                        {
                                            time && setUserInfo({
                                                ...userInfo,
                                                rotationPlan: { ...userInfo.rotationPlan, wakeTime: time }
                                            })
                                        }
                                    }
                                />
                            </Box>
                            <Box flex={1}>
                                <Text maxWidth="$32">When do you go to sleep?</Text>
                                <TimePicker isWake={false}
                                    value={userInfo.rotationPlan.sleepTime}
                                    setTime={(time) => {
                                        time && setUserInfo({
                                            ...userInfo,
                                            rotationPlan: { ...userInfo.rotationPlan, sleepTime: time }
                                        })
                                    }
                                    }
                                />
                            </Box>
                        </HStack>
                        <HStack alignItems="center" justifyContent="space-between">
                            <Text size="sm">Confirmation Alarm</Text>
                            <Switch value={userInfo?.rotationPlan.isConfirm} onToggle={() => setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: !userInfo.rotationPlan.isConfirm } })} />
                        </HStack>
                        <Divider my="$3" />
                        <Heading size="sm" textAlign="center">Your Rotation Schedule & Alarms</Heading>
                        <FlatList
                            data={userInfo.rotationPlan.alarms}
                            renderItem={renderAlarmItem}
                            keyExtractor={(item, index) => index.toString()}
                            px="$3"
                        />
                    </VStack>
                ) : (
                    <Text zIndex={-1}>You do not need to rotate on a schedule while in Maintenance Mode. If you feel a craving, feel free to rotate the spheres as needed.</Text>
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