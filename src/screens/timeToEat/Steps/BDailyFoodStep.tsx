import { Box, Divider, HStack, Heading, Switch, Text, VStack } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";
import { SwitchChangeEvent } from "react-native";

const BDailyFoodStep = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const updateEatSomething = () => {
        setUserInfo({ ...userInfo, dietToday: { ...userInfo.dietToday, eatSomthing: !userInfo.dietToday?.eatSomthing } })
    };

    const updateAlternatives = () => {
        setUserInfo({ ...userInfo, dietToday: { ...userInfo.dietToday, alternatives: !userInfo.dietToday.alternatives } })
    };

    const updateFemale = () => {
        setUserInfo({ ...userInfo, female: !userInfo.female });
    };

    const updateKosher = () => {
        setUserInfo({ ...userInfo, dietaryRestrictions: { ...userInfo.dietaryRestrictions, kosher: !userInfo.dietaryRestrictions?.kosher } });
    }

    const updateVegan = () => {
        setUserInfo({ ...userInfo, dietaryRestrictions: { ...userInfo.dietaryRestrictions, vegan: !userInfo.dietaryRestrictions?.vegan } });
    }

    const updateHalal = () => {
        setUserInfo({ ...userInfo, dietaryRestrictions: { ...userInfo.dietaryRestrictions, halal: !userInfo.dietaryRestrictions?.halal } });
    }

    return (
        <Box>
            <VStack display="flex" flex={1}>
                <Heading>
                    We are Customizing Your personal daily food schedule
                </Heading>
                <Divider mt="$4" mb="$2" />
                <VStack>
                    <Heading size="sm" mb="$4">
                        Diet Today
                    </Heading>
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Did you eat something beside fruits and veggies today?</Text>
                        <Switch value={userInfo.dietToday?.eatSomthing} onToggle={updateEatSomething} />
                    </HStack>
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Any diary or alternatives today?</Text>
                        <Switch value={userInfo.dietToday?.alternatives} onToggle={updateAlternatives} />
                    </HStack>
                    <Divider mb="$4" mt="$2" />
                </VStack>
                <VStack>
                    <Heading size="sm" mb="$4">
                        Personal Preferences
                    </Heading>
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Are you female?</Text>
                        <Switch value={userInfo?.female} onToggle={updateFemale} />
                    </HStack>
                    <Divider mb="$4" mt="$2" />
                </VStack>
                <VStack>
                    <Heading size="sm" mb="$4">
                        Dietary Restrictions
                    </Heading>
                    <HStack mb="$2" display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Kosher?</Text>
                        <Switch value={userInfo.dietaryRestrictions?.kosher} onToggle={updateKosher} />
                    </HStack>
                    <HStack mb="$2" display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Vegan?</Text>
                        <Switch value={userInfo.dietaryRestrictions?.vegan} onToggle={updateVegan} />
                    </HStack>
                    <HStack mb="$2" display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Halal?</Text>
                        <Switch value={userInfo.dietaryRestrictions?.halal} onToggle={updateHalal} />
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    );
}

export default BDailyFoodStep;