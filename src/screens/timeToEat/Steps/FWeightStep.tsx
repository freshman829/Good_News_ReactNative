import { Box, Center, Divider, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack, ScrollView} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { useUserInfoStore } from "../../../store/UserStore";

const FWeightStep = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [currentWeight, setCurrentWeight] = useState(0);
    const [targetWeight, setTargetWeight] = useState(userInfo.weightLogs.target || 0);
    const [socialDays, setSocialDays] = useState(Array.isArray(userInfo.socialDays) ? userInfo.socialDays : []);
    const [targetWeightWarning, setTargetWeightWarning] = useState(false);

    useEffect(() => {
        const lastLog = userInfo.weightLogs.logs[userInfo.weightLogs.logs.length - 1];
        if (lastLog) {
            setCurrentWeight(lastLog.weight);
        }
    }, [userInfo.weightLogs.logs]);

    const selectDay = (date: string) => {
        if (socialDays.includes(date)) {
            // remove the socialDays
            let filterDays = socialDays.filter((item) => item !== date);
            setSocialDays(filterDays);
            setUserInfo({ ...userInfo, socialDays: { ...filterDays }});
        } else {
            socialDays.push(date);
            setSocialDays([...socialDays]);
            setUserInfo({ ...userInfo, socialDays: { ...socialDays }});
        }
    }

    const markedDates = socialDays.reduce((acc, date) => {
        acc[date] = { selected: true, marked: true };
        return acc;
    }, {});

    const handleCurrentWeightChange = (value: number) => {
        setCurrentWeight(value);

        const updatedLogs = [...userInfo.weightLogs.logs];
        // Update the weight of the last log
        if (updatedLogs.length > 0) {
            updatedLogs[updatedLogs.length - 1].weight = value;
        } else {
            updatedLogs.push({weight: value});
        }

        setUserInfo({ 
            ...userInfo, 
            weightLogs: { 
              ...userInfo.weightLogs, 
              logs: updatedLogs
            } 
        });
    }

    const handleTargetWeightChange = (value: number) => {
        setTargetWeight(value);
        if (currentWeight < value ) setTargetWeightWarning(true);
        else setTargetWeightWarning(false);

        setUserInfo({ 
            ...userInfo, 
            weightLogs: { 
              ...userInfo.weightLogs, 
              target: value 
            } 
        });
    }

    return (
        <Box flex={1} h="$full" p="$4">
            <VStack display="flex" flex={1}>
                <Heading>
                    Weight & Goals
                </Heading>
                <Divider mt="$4" mb="$2"/>
                <VStack flex={1} justifyContent="space-between" gap={8}>
                    <VStack gap={5}>
                        <Heading size="sm">Select Your Current Weight</Heading>
                        <Text size="sm">{currentWeight.toString()} lbs</Text>
                        <Center mt={8}>
                            <Slider onChange={handleCurrentWeightChange} maxValue={500} value={currentWeight}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Center>
                    </VStack>
                    <VStack gap={5} mt={5}>
                        <Heading size="sm">Select Your Target Weight</Heading>
                        <Text size="sm">{targetWeight.toString()} lbs</Text>
                        <Center mt={8}>
                            <Slider onChange={handleTargetWeightChange} maxValue={500} value={targetWeight}>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </Center>
                    </VStack>
                    <Text size="sm" mt={5} color={targetWeightWarning ? "red" : "green"}>You selected {socialDays.length.toString()} Social Days. You're on track for weight loss!</Text>
                    <VStack gap={6}>
                        <Heading>Social Days</Heading>
                        <Text size="sm">The more social days you select, the slower your progress will be.</Text>
                    </VStack>

                    <VStack mt={8}>
                        <Calendar 
                            onDayPress={(day) => selectDay(day.dateString)}
                            markedDates={markedDates}
                        />
                    </VStack>
                </VStack>
            </VStack>
        </Box>
    )
}

export default FWeightStep;