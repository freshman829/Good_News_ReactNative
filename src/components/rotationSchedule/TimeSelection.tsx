import React from 'react';
import { Box, HStack, Text } from '@gluestack-ui/themed';
import TimePicker from '../../components/TimePicker';
import { saveRotationSchedule, updateInfo } from '../../api/userAPI';
import { UserInterface } from '../../store/UserStore';

interface TimeSelectionProps {
  userInfo: UserInterface;
  setUserInfo: (userInfo: UserInterface) => void;
  setIsWakeDropdownOpen: (isOpen: boolean) => void;
  setIsSleepDropdownOpen: (isOpen: boolean) => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({ userInfo, setUserInfo, setIsWakeDropdownOpen, setIsSleepDropdownOpen }) => {
  const updateTime = async (time: string, isWake: boolean) => {
    const updatedData = await saveRotationSchedule({
      ...userInfo,
      rotationPlan: {
        ...userInfo.rotationPlan,
        [isWake ? 'wakeTime' : 'sleepTime']: time,
      },
    });

    if (updatedData) setUserInfo(updatedData);
  };

  return (
    <HStack>
      <Box flex={1}>
        <Text size="sm">When do you wake up?</Text>
        <TimePicker 
          isWake={true}
          value={userInfo.rotationPlan.wakeTime}
          setTime={(time) => time && updateTime(time, true)}
          setIsOpen={setIsWakeDropdownOpen}
        />
      </Box>
      <Box flex={1}>
        <Text size="sm">When do you go to sleep?</Text>
        <TimePicker 
          isWake={false}
          value={userInfo.rotationPlan.sleepTime}
          setTime={(time) => time && updateTime(time, false)}
          setIsOpen={setIsSleepDropdownOpen}
        />
      </Box>
    </HStack>
  );
};

export default TimeSelection;
