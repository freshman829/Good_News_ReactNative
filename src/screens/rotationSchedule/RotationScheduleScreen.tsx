import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack, Heading, Spinner, HStack, ScrollView, Switch, FlatList, Divider } from '@gluestack-ui/themed';
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

type Props = NativeStackScreenProps<RootStackParamList, 'RotationSchedule'>;

const RotationScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const init = useRef(true);
  const [loading, setLoading] = useState(true);
  const { userInfo, setUserInfo } = useUserInfoStore();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isConfirm, setIsConfirm] = useState(userInfo.rotationPlan.isConfirm || false);

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
  }, [])

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
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, programStartDate: new Date(), programDays: 14, alarms: generatedAlarms } });
      await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: generatedAlarms } });
    }
    
    updateStoreDate(StorageDatesNames.alarm);
    setLoading(false);
  };

  // Confirm Alarm generation
  useEffect(() => {
    refreshConfirmAlarm();
  }, [isConfirm])

  const refreshConfirmAlarm = async () => {
    const alarms = [...userInfo.rotationPlan.alarms];
    if (isConfirm) {
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
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: true, alarms: alarms.concat(append).sort((a: any, b: any) => new Date(a.timeDate) - new Date(b.timeDate)) } });
      await saveRotationSchedule({
        ...userInfo,
        rotationPlan: {
          ...userInfo.rotationPlan,
          alarms: alarms
            .concat(append)
            .sort((a: any, b: any) => new Date(a.timeDate) - new Date(b.timeDate))
        }
      });
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
      setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, isConfirm: false, alarms: newAlarms } });
      await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarms: newAlarms } });
    }
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
    <Box p="$4" h="$full" backgroundColor="$backgroundDefault">
      <CenterGoBack navigation={navigation} title="Rotation Schedule" />
      <VStack mt="$6">
        <RotationAccordion
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />

        {!userInfo.rotationPlan.alarmTurn && (
          <VStack h="$full" mt="$10" overflow="scroll">
            <Box>
              {userInfo.rotationPlan.alarms && userInfo.rotationPlan.alarms.length ?
                    <HStack alignItems="center" justifyContent="space-between" px="$4">
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
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default RotationScheduleScreen;
