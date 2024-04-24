import { Box, Heading, Text, VStack, Divider, HStack, Switch, Input, InputSlot, InputIcon, SearchIcon, InputField } from "@gluestack-ui/themed";
import { FOOD_PLAN_BY_CONDITION } from "../../../constants/healthCondition";
import { useUserInfoStore } from "../../../store/UserStore";
import { useState } from "react";


const EHealthConditionStep = () => {
    const {
        userInfo,
        setUserInfo
    } = useUserInfoStore();
    const [isShowConditions, setIsShowConditions] = useState(userInfo.healthCondition.length > 0 ? true : false);
    const [conditions, setFilterConditions] = useState(FOOD_PLAN_BY_CONDITION);

    const toggleHandleCondition = () => {
        setIsShowConditions(!isShowConditions);
    }

    const toggleHandleConditionItem = (index: number, title: string) => {
        const conditionInfo = {
            id: index,
            title: title,
            isActive: true,
        };
        
        if (userInfo.healthCondition) {
            // Check if the condition with the same id already exists
            const existingConditionIndex = userInfo.healthCondition.findIndex(condition => condition.id === index);
        
            if (existingConditionIndex !== -1) {
                // Toggle isActive if the condition already exists
                userInfo.healthCondition[existingConditionIndex].isActive = !userInfo.healthCondition[existingConditionIndex].isActive;
            } else {
                // Add the new condition if it doesn't exist
                userInfo.healthCondition.push(conditionInfo);
            }
        } else {
            // If healthCondition is undefined, initialize it with an array containing conditionInfo
            userInfo.healthCondition = [conditionInfo];
        }
        
        // Update the state with the modified userInfo
        setUserInfo({ ...userInfo });
    }

    const getConditionActiveStatue = (index: number) => {
        const healthConditions = userInfo.healthCondition;
        if (healthConditions) {
            for (let i = 0; i < healthConditions.length; i++) {
                if (healthConditions[i].id === index) {
                    return healthConditions[i].isActive;
                }
            }
        }
        return false;
    }

    const filterConditions = (keyword: string) => {
        const filterConditions = FOOD_PLAN_BY_CONDITION.filter((item) => item.toLowerCase().includes(keyword.toLowerCase()));
        setFilterConditions(filterConditions);
    }

    return (
        <Box flex={1} h="$full">
            <VStack display="flex" flex={1}>
                <Heading>
                    Do you want to customize your food plan based on your health conditions
                </Heading>
                <Divider mt="$4" mb="$2" />
                <VStack flex={1} gap={5}>
                    <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$2">
                        <Text>Health Conditions</Text>
                        <Switch value={isShowConditions} defaultValue={userInfo.healthCondition.length > 0 ? true : false} onToggle={() => toggleHandleCondition()} />
                    </HStack>
                    {isShowConditions && (
                        <VStack>
                            <Input>
                                <InputSlot pl="$3">
                                    <InputIcon as={SearchIcon} />
                                </InputSlot>
                                <InputField placeholder="Search..." onChangeText={filterConditions} />
                            </Input>
                            {conditions.map((condition, index) => (
                                <HStack key={index} display="flex" justifyContent="space-between" alignItems="center" mt="$2">
                                    <Text>{condition}</Text>
                                    <Switch value={getConditionActiveStatue(index)} defaultValue={false} onToggle={() => toggleHandleConditionItem(index, condition)} />
                                </HStack>
                            ))}
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </Box>
    )
}

export default EHealthConditionStep;