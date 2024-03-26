import { HStack, VStack, Text, Heading, Slider, Center, SliderThumb, SliderTrack, SliderFilledTrack } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../../store/UserStore";
import { useEffect, useState } from "react";

const FinalWeight = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [currentWeight, setCurrentWeight] = useState(0);
    const [targetWeight, setTargetWeight] = useState(userInfo.weightLogs.target || 0);

    useEffect(() => {
        const lastLog = userInfo.weightLogs.logs[userInfo.weightLogs.logs.length - 1];
        if (lastLog) {
            setCurrentWeight(lastLog.weight);
        }
    }, [userInfo.weightLogs.logs]);

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

        setUserInfo({ 
            ...userInfo, 
            weightLogs: { 
              ...userInfo.weightLogs, 
              target: value 
            } 
        });
    }

    return (
        <VStack mt={16} gap={8}>
            <HStack display="flex" justifyContent="space-between" alignItems="center" gap={16}>
                <Text color="$black" textAlign="center" flex={1}>Current Weight</Text>
                <VStack flex={2}>
                    <Heading color="$black"  size="sm">
                        Select Your Current Weight
                    </Heading>
                    <Text color="$black" size="sm">{currentWeight.toString()} lbs</Text>
                    <Center mt={8}>
                        <Slider onChange={handleCurrentWeightChange} maxValue={500} value={currentWeight} >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Center>
                </VStack>
            </HStack>
            <HStack display="flex" justifyContent="space-between" alignItems="center" gap={16}>
                <Text color="$black" textAlign="center" flex={1}>Target Weight</Text>
                <VStack flex={2}>
                    <Heading size="sm">
                        Select Your Target Weight
                    </Heading>
                    <Text color="$black" size="sm">{targetWeight.toString()} lbs</Text>
                    <Center mt={8}>
                        <Slider onChange={handleTargetWeightChange} maxValue={500} value={targetWeight} >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Center>
                </VStack>
            </HStack>
        </VStack>
    )
}

export default FinalWeight;