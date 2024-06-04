import React, { useEffect, useRef, useState } from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionTitleText, AccordionIcon, AccordionTrigger, AccordionContent, ChevronUpIcon, ChevronDownIcon, Box, HStack, Text, Switch, VStack } from '@gluestack-ui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import TimeSelection from './TimeSelection';
import { saveRotationSchedule } from '../../api/userAPI';
import { UserInterface } from '../../store/UserStore';

const specialRotations = [
    { label: "2/7", value: 2 },
    { label: "3/7", value: 3 },
    { label: "4/7", value: 4 },
];

interface RotationAccordionProps {
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
  isWakeDropdownOpen: boolean;
  setIsWakeDropdownOpen: (isOpen: boolean) => void;
  isSleepDropdownOpen: boolean;
  setIsSleepDropdownOpen: (isOpen: boolean) => void;
}

const RotationAccordion: React.FC<RotationAccordionProps> = ({ userInfo, setUserInfo, isWakeDropdownOpen, setIsWakeDropdownOpen, isSleepDropdownOpen, setIsSleepDropdownOpen }) => {
  const [openSpecial, setOpenSpecial] = useState(false);
  const [special, setSpecial] = useState<number>(userInfo.rotationPlan.plan);

  useEffect(() => {
    const saveUpdate = async () => {
      if (special !== userInfo.rotationPlan.plan) {
          const updatedUser = await saveRotationSchedule({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, plan: special || 0 } });
          if (updatedUser) {
              setUserInfo(updatedUser);
          }
      }
    }

    saveUpdate();
  }, [special]);

  return (
    <Accordion borderRadius="$lg">
      <AccordionItem value="item-1" borderRadius="$lg">
        <AccordionHeader>
          <AccordionTrigger>
            {({ isExpanded }) => (
              <>
                <AccordionTitleText>Rotation Schedule</AccordionTitleText>
                <AccordionIcon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} />
              </>
            )}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <Box zIndex={9999}>
            <HStack justifyContent="space-between" pb="$2">
              <Text size="sm" maxWidth="$5/6">Are you on maintenance / post maintenance mode?</Text>
              <Switch 
                value={userInfo?.rotationPlan.alarmTurn} 
                onToggle={() => setUserInfo({ ...userInfo, rotationPlan: { ...userInfo.rotationPlan, alarmTurn: !userInfo.rotationPlan.alarmTurn } })} 
              />
            </HStack>
          </Box>
          {!userInfo.rotationPlan.alarmTurn && (
            <VStack h={isWakeDropdownOpen ? 350 : isSleepDropdownOpen ? 350 : special > 1 ? '$full' : 200} gap="$3">
              <Box zIndex={8888}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text size="sm" maxWidth="$4/6">What are your special rotation times?</Text>
                  <DropDownPicker
                    open={openSpecial}
                    value={special}
                    items={specialRotations}
                    setOpen={setOpenSpecial}
                    setValue={setSpecial}
                    style={{ width: 100 }}
                    containerStyle={{ width: 100 }}
                  />
                </HStack>
              </Box>
              {userInfo.rotationPlan.plan >= 2 && (
                <TimeSelection 
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  setIsWakeDropdownOpen={setIsWakeDropdownOpen}
                  setIsSleepDropdownOpen={setIsSleepDropdownOpen}
                />
              )}
            </VStack>
          )}
          {userInfo.rotationPlan.alarmTurn && (
            <Text size="sm" zIndex={-1}>You do not need to rotate on a schedule while in Maintenance Mode. If you feel a craving, feel free to rotate the spheres as needed.</Text>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RotationAccordion;
