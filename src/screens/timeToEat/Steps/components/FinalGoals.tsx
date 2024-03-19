import { Heading, VStack, HStack, ButtonGroup, Button, ButtonText, Text, Divider, Pressable, Switch } from "@gluestack-ui/themed";
import RNDateTimePicker from "@react-native-community/datetimepicker";


const FinalGoals = () => {
    return (
        <VStack gap={4} mt={8}>
            <Heading size="sm">Goals & Program Info</Heading>
            <HStack display="flex" justifyContent="space-between" alignItems="center" mt="$8">
                <VStack>
                    <Text maxWidth="$2/3">How many days is your program?</Text>
                    <Text>14 days</Text>
                </VStack>
                <ButtonGroup isAttached>
                    <Button mr="$0" variant="outline" borderColor="$backgroundLight300" $dark-borderColor="$backgroundDark700" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200" size="xs" borderRightWidth='$0'>
                        <ButtonText>-</ButtonText>
                    </Button>
                    <Button variant="outline" borderColor="$backgroundLight300" $dark-borderColor="$backgroundDark700" size="xs" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200">
                        <ButtonText>+</ButtonText>
                    </Button>
                </ButtonGroup>
            </HStack>
            <Divider mt={6}/>
            <VStack gap={8}>
                <Text textAlign="center">When is your next appointment?</Text>
                <VStack>
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text maxWidth="$1/2">Select a Date</Text>
                        <Pressable>
                            <Text p="$2" rounded="$lg" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200" minWidth="$24">
                                {"select a appointment"}
                            </Text>
                        </Pressable>
                        <RNDateTimePicker display="calendar"/>
                    </HStack>
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>I don't have an appointment</Text>
                        <Switch />
                    </HStack>
                </VStack>
            </VStack>
            <Divider mt={6} />
            <VStack mt={6}>
                <Text maxWidth="$1/2" textAlign="center">Are you in maintenance/after maintenance mode?</Text>
                <ButtonGroup>
                    <Button
                        variant="outline"
                        rounded="$md"
                        borderColor="$backgroundLight300"
                        $dark-borderColor="$backgroundDark700"
                        // $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.NO ? "$backgroundDefault" : "$backgroundLight200" }
                        // backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.NO ? "$backgroundDefault" : "$backgroundDark200" }
                        size="xs" borderRightWidth='$0'
                        // onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.NO)}
                    >
                        <ButtonText>No</ButtonText>
                    </Button>
                    <Button
                        variant="outline"
                        rounded="$md"
                        borderColor="$backgroundLight300"
                        $dark-borderColor="$backgroundDark700"
                        // $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.YES ? "$backgroundDefault" : "$backgroundLight200" }
                        // backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.YES ? "$backgroundDefault" : "$backgroundDark200" }
                        size="xs" borderRightWidth='$0'
                        // onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.YES)}
                    >
                        <ButtonText>Yes</ButtonText>
                    </Button>
                    <Button
                        variant="outline"
                        rounded="$md"
                        borderColor="$backgroundLight300"
                        $dark-borderColor="$backgroundDark700"
                        // $dark-backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.POST ? "$backgroundDefault" : "$backgroundLight200" }
                        // backgroundColor={userInfo.rotationPlan.mode === PlanConstants.MAINTAINENCE_MODE.POST ? "$backgroundDefault" : "$backgroundDark200" }
                        size="xs" borderRightWidth='$0'
                        // onPress={() => changeMode(PlanConstants.MAINTAINENCE_MODE.POST)}
                    >
                        <ButtonText>After Maint</ButtonText>
                    </Button>
                </ButtonGroup>
            </VStack>
        </VStack>
    )
}

export default FinalGoals;