import { Box, ChevronLeftIcon, Divider, FlatList, HStack, Heading, Icon, Switch, Text, VStack, View } from "@gluestack-ui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import SelectDropdown from "react-native-select-dropdown";
import { StyleSheet, Platform } from "react-native";
import TimePicker from "../../components/TimePicker";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { UserInterface, useUserInfoStore } from "../../store/UserStore";
import PushNotification from "react-native-push-notification";
import { createAlarm } from "react-native-simple-alarm";

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
    useEffect(() => {
        if (userInfo.mode !== 0 && userInfo.plan >= 2) {
            refreshAlarms();
        }
    }, [userInfo.mode, userInfo.plan, userInfo.isConfirm, userInfo.wakeTime, userInfo.sleepTime]);


    const refreshAlarms = () => {
        const today = new Date();
        let programEndDate = today;
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

        // Schedule new notifications
        // generatedAlarms.forEach((alarm) => {
        //   if (alarm.isOn) {
        //     const dateComponents = {
        //       year: alarm.timeDate.getFullYear(),
        //       month: alarm.timeDate.getMonth(),
        //       day: alarm.timeDate.getDate(),
        //       hour: alarm.timeDate.getHours(),
        //       minute: alarm.timeDate.getMinutes(),
        //     };

        //     PushNotification.localNotificationSchedule({
        //       date: new Date(Date.UTC(dateComponents.year, dateComponents.month, dateComponents.day, dateComponents.hour, dateComponents.minute)),
        //       title: 'Rotation Alarm',
        //       message: "It's time to rotate!",
        //     });
        //   }
        // });

        // Update user alarm states with the generated alarms
        setUserInfo({ ...userInfo, alarms: generatedAlarms });
    };
    const generateAlarms = (day: Date) => {
        const times = new Set();
        const calender = new Date();
        const alarmStatesSet = new Set();

        const defaultWakeTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 7, 0, 0);
        const defaultSleepTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 22, 0, 0);

        let wakeTime = userInfo.wakeTime ?
            new Date(defaultWakeTime.getFullYear(),
                defaultWakeTime.getMonth(),
                defaultWakeTime.getDate(),
                userInfo.wakeTime.getHours(),
                userInfo.wakeTime.getMinutes(), 0
            ) : defaultWakeTime;
        let sleepTime = userInfo.sleepTime ?
            new Date(defaultSleepTime.getFullYear(),
                defaultSleepTime.getMonth(),
                defaultSleepTime.getDate(),
                userInfo.sleepTime.getHours(),
                userInfo.sleepTime.getMinutes(), 0
            ) : defaultSleepTime;

        if (wakeTime.getMinutes() !== 0) {
            wakeTime.setMinutes(0);
        }
        if (sleepTime.getMinutes() !== 0) {
            sleepTime.setMinutes(0);
        }

        // times.add(wakeTime);
        // times.add(sleepTime);

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
                time: formatDate(time as Date),
                timeDate: time,
                isSpecial
            };
            alarmStatesSet.add(newAlarm);
            let i = 0;
            if (i < 1) {
                createAlarm({
                    active: true,
                    date: `${time}`,
                    message: "alarm!!!",
                    snooze: 1
                });
                i++;
            }
            // push notification
            // PushNotification.localNotificationSchedule({
            //     id: alarmStatesSet.size - 1,
            //     message: `Time to Rotate`,
            //     date: newAlarm.timeDate as Date,
            //     allowWhileIdle: true
            // })

            if (userInfo.isConfirm) {
                const confirmationTime = new Date(time as Date);
                confirmationTime.setMinutes(confirmationTime.getMinutes() + 5);
                const confirmationAlarm = {
                    time: formatDate(confirmationTime),
                    timeDate: confirmationTime,
                    isSpecial
                };
                alarmStatesSet.add(confirmationAlarm);
            }
        }

        return Array.from(alarmStatesSet).sort((a: any, b: any) => a.timeDate - b.timeDate);
    }

    function formatDate(date: Date) {
        return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', weekday: "short" });
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
                    <Switch value={true} />
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
                    {/* <Picker
                        selectedValue={userInfo?.mode}
                        style={styles.picker}
                        onValueChange={(itemvalue) => {
                            setUserInfo({ ...userInfo, mode: itemvalue })
                        }}
                    >
                        <Picker.Item label="No" value={0} />
                        <Picker.Item label="Yes" value={1} />
                        <Picker.Item label="Post-Maintenance" value={2} />
                    </Picker> */}
                    <SelectDropdown
                        data={maintenanceMode}
                        buttonStyle={styles.dropwdownBtnStyle}
                        buttonTextStyle={styles.dropdownBtnTxtStyle}
                        dropdownStyle={styles.dropdownDropdownStyle}
                        onSelect={(selectedItem, index) => {
                            setUserInfo({ ...userInfo, mode: selectedItem.value })
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.label;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.label;
                        }}
                    >

                    </SelectDropdown>
                </HStack>
                {(userInfo.mode > 0) ? (
                    <VStack h="$full">
                        <HStack alignItems="center">
                            <Text maxWidth="$4/5">What are your special rotation times?</Text>
                            <SelectDropdown
                                data={specialRotations}
                                buttonStyle={styles.dropwdownBtnStyle}
                                buttonTextStyle={styles.dropdownBtnTxtStyle}
                                dropdownStyle={styles.dropdownDropdownStyle}
                                onSelect={(selectedItem, index) => {
                                    setUserInfo({ ...userInfo, plan: selectedItem.value })
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.label;
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.label;
                                }}
                            />
                        </HStack>
                        <HStack>
                            <Box flex={1}>
                                <Text maxWidth="$32">When do you wake up?</Text>
                                <TimePicker isWake={true}
                                    setTime={(time) =>
                                        setUserInfo({
                                            ...userInfo,
                                            wakeTime: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), parseInt(time.split(':')[0]), 0, 0)
                                        })
                                    }
                                />
                            </Box>
                            <Box flex={1}>
                                <Text maxWidth="$32">When do you go to sleep?</Text>
                                <TimePicker isWake={false}
                                    setTime={(time) =>
                                        setUserInfo({
                                            ...userInfo,
                                            sleepTime: new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), parseInt(time.split(':')[0]), 0, 0)
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
                        {/* <VStack>
                            {userInfo.alarms.map((item, index) => (
                                <Text color="$secondary800" key={index}>{item.time}</Text>
                            ))}
                        </VStack> */}
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