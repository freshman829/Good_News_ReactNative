import React, { useEffect, useRef, useState } from 'react';
import { Box, VStack, Heading, Spinner, HStack, ScrollView, Switch, FlatList, Divider } from '@gluestack-ui/themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/data';
import { UserInterface, useUserInfoStore } from '../../store/UserStore';
import { updateInfo, saveRotationSchedule } from '../../api/userAPI';
import Notification from '../../utils/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CenterGoBack from '../../components/common/CenterGoBack';
import RotationAccordion from '../../components/rotationSchedule/RotationAccordion';
import AlarmList from './components/AlarmList';

type Props = NativeStackScreenProps<RootStackParamList, 'RotationSchedule'>;

const RotationScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { userInfo, setUserInfo } = useUserInfoStore();
  const [isWakeDropdownOpen, setIsWakeDropdownOpen] = useState(false);
  const [isSleepDropdownOpen, setIsSleepDropdownOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (userData) {
          setUserInfo(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Box>
    );
  }

  console.log("userInfo::", userInfo);

  return (
    <Box p="$4" h="$full" backgroundColor="$backgroundDefault">
      <CenterGoBack navigation={navigation} title="Rotation Schedule" />
      <VStack mt="$6">
        <RotationAccordion
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isWakeDropdownOpen={isWakeDropdownOpen}
          setIsWakeDropdownOpen={setIsWakeDropdownOpen}
          isSleepDropdownOpen={isSleepDropdownOpen}
          setIsSleepDropdownOpen={setIsSleepDropdownOpen}
        />

        {!userInfo.rotationPlan.alarmTurn && (
          <VStack h="$full" mt="$10" overflow="scroll">
            <Box>
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
