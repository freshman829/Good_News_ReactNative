import { HStack, Heading, Switch, VStack, Text } from "@gluestack-ui/themed"
import { useUserInfoStore } from "../../../../store/UserStore";

const FinalPersonalPreference = () => {
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
        <VStack gap={8} mt={16}>
            <Heading color="$black" size="sm">
                Personal Preferences
            </Heading>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text color="$black">Ate fruits and veggies today</Text>
                <Switch value={userInfo.dietToday?.eatSomthing} onToggle={updateEatSomething} />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text color="$black">Ate dairy today</Text>
                <Switch value={userInfo.dietToday?.alternatives} onToggle={updateAlternatives} />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text color="$black">Kosher</Text>
                <Switch value={userInfo.dietaryRestrictions?.kosher} onToggle={updateKosher} />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text color="$black">Vegan</Text>
                <Switch value={userInfo.dietaryRestrictions?.vegan} onToggle={updateVegan} />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text color="$black">Halal</Text>
                <Switch value={userInfo.dietaryRestrictions?.halal} onToggle={updateHalal} />
            </HStack>
            <HStack mt={6} display="flex" justifyContent="space-between" alignItems="center">
                <Text color="$black">Female</Text>
                <Switch value={userInfo?.female} onToggle={updateFemale} />
            </HStack>
        </VStack>
    )
}

export default FinalPersonalPreference;