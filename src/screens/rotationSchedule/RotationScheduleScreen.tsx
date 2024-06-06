import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack, Heading, Spinner, HStack, ScrollView, Switch, FlatList, Divider, View } from '@gluestack-ui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid'
import { RootStackParamList } from '../../types/data';
import { UserInterface, useUserInfoStore } from '../../store/UserStore';
import { updateInfo, saveRotationSchedule } from '../../api/userAPI';
import Notification from '../../utils/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CenterGoBack from '../../components/common/CenterGoBack';
import RotationAccordion from '../../components/rotationSchedule/RotationAccordion';
import AlarmList from './components/AlarmList';
import { StorageDatesNames } from '../../constants';
import { updateStoreDate } from '../../utils/common';
import { extractTime } from "../../utils/numberUtil";
import { getSettingInfo } from '../../api/settingAPI';
type Props = NativeStackScreenProps<RootStackParamList, 'RotationSchedule'>;
const RotationScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const init = useRef(true);
  const { userInfo, setUserInfo } = useUserInfoStore();
  const [loading, setLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isConfirm, setIsConfirm] = useState(userInfo.rotationPlan.isConfirm || false);
  const [isTeaTime, setIsTeaTime] = useState(userInfo.rotationPlan.isTeaTime || false);
  const [teaTimeAlarmText, setTeaTimeAlarmText] = useState("It's tea time");

  useEffect(() => {
    const checkRefreshAlarm = async () => {
      await AsyncStorage.getItem(StorageDatesNames.alarm).then((value) => {
        if (value) {
          const alarmDate = new Date(value);
          const today = new Date();
            if (today > alarmDate) {
                setIsRefresh(true);
            }
        } else {
            setIsRefresh(true);
        }
      });
    };
    checkRefreshAlarm();
    getSetting();
  }, [])

  const getSetting = async () => {
    const result = await getSettingInfo("TeaTime Alarm");
    if (result.success)
      setTeaTimeAlarmText(result.data);
  };

  useEffect(() => {
    if (isRefresh) {
      refreshAlarms();
    } else {
      if (init.current) {
        init.current = false;
        setLoading(false);
      } else {
        if (!userInfo.rotationPlan.alarmTurn
          && userInfo.rotationPlan.plan >= 2
          && userInfo.rotationPlan.wakeTime
          && userInfo.rotationPlan.sleepTime
        ) {
          refreshAlarms();
        }
      }
    }
  }, [userInfo.rotationPlan.wakeTime, userInfo.rotationPlan.sleepTime, userInfo.rotationPlan.alarmTurn, userInfo.rotationPlan.plan, isRefresh]);

  const refreshAlarms = async () => {
    await Notification.cancelAllNotifications();
    const today = new Date();
    let programEndDate = new Date(userInfo.rotationPlan.programStartDate || today);
    programEndDate.setDate(today.getDate() + (userInfo.rotationPlan.programDays || 14));
    if (today > programEndDate) {
      // No alarms to generate if the end date is in the past
      const updatedData = await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: [] } });
      setUserInfo(updatedData);
      return;
    } else {
      let generatedAlarms: any[] = [];
      while (today <= programEndDate) {
        let alarmTemp = await generateAlarms(today);
        generatedAlarms = generatedAlarms.concat(alarmTemp);
        today.setDate(today.getDate() + 1);
      }
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: generatedAlarms } });
      await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: generatedAlarms } });
    }
    
    updateStoreDate(StorageDatesNames.alarm);
    setLoading(false);
  };
  
  const generateAlarms = async (day: Date) => {
    const times = new Set();
    const alarmStatesSet = new Set();
    let wakeTime = 
          new Date(day.getFullYear(),
            day.getMonth(),
            day.getDate(),
            extractTime(userInfo.rotationPlan.wakeTime).hours,
            extractTime(userInfo.rotationPlan.wakeTime).minutes, 0
          );
    let sleepTime =
        new Date(day.getFullYear(),
            day.getMonth(),
            day.getDate(),
            extractTime(userInfo.rotationPlan.sleepTime).hours,
            extractTime(userInfo.rotationPlan.sleepTime).minutes, 0
        );
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
    // console.log("nowDate;;", day);
    // day.setMinutes(day.getMinutes() + 2);
    // const newAlarm = {
    //   id: uuid.v4(),
    //   time: formatDate(day as Date),
    //   timeDate: day,
    //   isSpecial: false,
    //   isActive: true
    // };
    // console.log("day::", day.getMinutes());
    // try {
    //     await Notification.scheduleNotification({
    //         id: (newAlarm.id).toString(),
    //         reminder: "It's time to rotate",
    //         date: (newAlarm.timeDate) as Date
    //     });
    // } catch (error) {
    //     console.error(error);
    // }
    let alrms = Array.from(alarmStatesSet).sort((a: any, b: any) => a.timeDate - b.timeDate);
    return alrms;
  }
  // Confirm Alarm generation
  useEffect(() => {
    if (userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length > 0)
      refreshConfirmAlarm();
  }, [isConfirm])

  const refreshConfirmAlarm = async () => {
    const alarms = [...userInfo.rotationPlan.alarms];
    const newAlarms = alarms.filter((alarm) => !alarm.isTeaTime);
    if (isConfirm) {
      let append = [];
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
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: true, alarms: newAlarms.concat(append).sort((a: any, b: any) => a.timeDate - b.timeDate) } });
      await saveRotationSchedule({
        ...userInfo,
        rotationPlan: {
          ...userInfo.rotationPlan,
          alarms: alarms
            .concat(append)
            .sort((a: any, b: any) => a.timeDate - b.timeDate)
        }
      });
    } else {
      const newAlarms = alarms.filter((alarm) => !alarm.isConfirm);
      for (const alarm of alarms) {
        if (alarm.isConfirm) {
          try {
            await Notification.cancelNotification(alarm.id);
          } catch (error) {
            console.error(error);
          }
        }
      }
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: false, alarms: newAlarms } });
      await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: false, alarms: newAlarms } });
    }
  };

  // Confirm Tea Time generation
  useEffect(() => {
    if (userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length > 0)
      refreshTeaTime();
  }, [isTeaTime]);

  const refreshTeaTime = async () => {
    const alarms = [...userInfo.rotationPlan.alarms];
    const newAlarms = alarms.filter((alarm) => !alarm.isTeaTime);
  
    if (isTeaTime) {
      // Generate tea time alarms
      const generatedTeaTimeAlarms = [];
      const programStartDate = new Date();
      const programEndDate = new Date(programStartDate.getTime() + userInfo.rotationPlan.programDays * 24 * 60 * 60 * 1000); // Adding program days to start date
      for (let date = new Date(programStartDate); date <= programEndDate; date.setDate(date.getDate() + 1)) {
        let wakeTime = 
          new Date(date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          extractTime(userInfo.rotationPlan.wakeTime).hours,
          extractTime(userInfo.rotationPlan.wakeTime).minutes, 0
        );
        let sleepTime =
          new Date(date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                extractTime(userInfo.rotationPlan.sleepTime).hours,
                extractTime(userInfo.rotationPlan.sleepTime).minutes, 0
        );
            
        // Calculate tea time slots
        const sleepToWakeDiff = sleepTime.getTime() - wakeTime.getTime(); // difference in hours
        const teaTimeSlots = Math.round(sleepToWakeDiff / 4); // 4 slots for 3 times a day
        for (let i = 1; i <= 3; i++) {
          const teaTime = new Date(wakeTime.getTime() + teaTimeSlots * i); // Adding tea time slot hours
          if (teaTime > new Date()) {
            const teaTimeAlarm = {
              id: uuid.v4(),
              time: formatDate(teaTime),
              timeDate: teaTime,
              isSpecial: true,
              isActive: true,
              isConfirm: false,
              isTeaTime: true
            };
  
            generatedTeaTimeAlarms.push(teaTimeAlarm);
            try {
              await Notification.scheduleNotification({
                id: (teaTimeAlarm.id).toString(),
                reminder: teaTimeAlarmText,
                date: teaTime as Date
              });
            } catch (error) {
              console.error(error);
            }
          }
        }
      }

      // console.log("generated::", generatedTeaTimeAlarms);
      // Update state with new tea time alarms
      const updatedAlarms = newAlarms.concat(generatedTeaTimeAlarms).sort((a, b) => a.timeDate - b.timeDate);
      await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isTeaTime: true, alarms: updatedAlarms } });
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isTeaTime: true, alarms: updatedAlarms } });
    } else {
      // Remove tea time alarms if tea time is turned off
      const newAlarms = alarms.filter((alarm) => !alarm.isTeaTime);
      for (const alarm of alarms) {
        if (alarm.isTeaTime) {
          try {
            await Notification.cancelNotification(alarm.id);
          } catch (error) {
            console.error(error);
          }
        }
      }
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isTeaTime: false, alarms: newAlarms } });
      await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isTeaTime: false, alarms: newAlarms } });
    }
  };
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', weekday: "short" });
  };

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Box>
    );
  }
  
  return (
    <Box display='flex' p="$4" h="$full" backgroundColor="$backgroundDefault">
      <CenterGoBack navigation={navigation} title="Rotation Schedule" />
      <VStack mt="$6" display="flex" h="$full">
        <RotationAccordion
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
        {!userInfo.rotationPlan.alarmTurn && (
          <VStack flex={1} mt="$10">
            <HStack alignItems="center" justifyContent="space-between" px="$4">
                <Heading size="sm">Tea Time</Heading>
                <Switch value={isTeaTime} onToggle={() => setIsTeaTime(!isTeaTime)} />
            </HStack>
            {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ?
              <HStack alignItems="center" justifyContent="space-between" px="$4" mt="$2">
                  <Heading size="sm">Confirmation Alarm</Heading>
                  <Switch value={isConfirm} onToggle={() => setIsConfirm(!isConfirm)} />
              </HStack> : ""
            }
            {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ? <Divider my="$3" /> : ""}
            {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ?
                <Heading size="sm" textAlign="center">Your Rotation Schedule & Alarms</Heading> : ""
            }
            {(userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length > 0) &&
              <AlarmList alarms={userInfo.rotationPlan.alarms} userInfo={userInfo} setUserInfo={setUserInfo}/>
            }
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
export default RotationScheduleScreen;
