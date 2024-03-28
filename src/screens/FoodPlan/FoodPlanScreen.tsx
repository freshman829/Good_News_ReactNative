import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DayPlan, RootStackParamList } from "../../types/data";
import { Box, Divider, HStack, Heading, Text, VStack, ScrollView, Button, Spinner, Modal, Icon, ModalBody, ModalContent, ModalHeader, CloseIcon, ModalCloseButton, ModalBackdrop, ChevronLeftIcon, ButtonText, ModalFooter, Card } from "@gluestack-ui/themed";
import { useState, useEffect, useRef } from "react";
import { getFoodSuggestion, getPlanList, updateUserinfo } from "../../api/userAPI";
import { useUserInfoStore } from "../../store/UserStore";
import { useToastr } from "../../providers/ToastProvider";
import GEmotionalStep from "../timeToEat/Steps/GEmotionalStep";

type FoodPlanProps = NativeStackScreenProps<
    RootStackParamList,
    "FoodPlan"
>;

const FoodPlanScreen: React.FC<FoodPlanProps> = ({ navigation }) => {
    const [plans, setPlans] = useState<DayPlan[]>([]);
    const [suggests, setSuggests] = useState<any>();
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [init, setInit] = useState(false);
    const [showDepression, setShowDepression] = useState(false);
    const initRef = useRef(true);
    const toast = useToastr();

    useEffect(() => {
        const getPlans = async () => {
            const result = await getPlanList(userInfo._id);
            if (result.success) {
                setPlans(result.data);
            } else {
                toast?.showToast({ message: result.msg, options: "error" });
            }
        }
        const getSuggest = async () => {
            const result = await getFoodSuggestion(userInfo._id);
            if (result.success) {
                setSuggests(result.data);
            } else {
                toast?.showToast({ message: result.msg, options: "error" });
            }
        }

        if (userInfo.rotationPlan.mode === 0) {
            getPlans();
        } else {
            getSuggest();
        }
    }, [userInfo.emotions]);

    useEffect(() => {
        if ((userInfo.emotions?.depression?.status ||
            userInfo.emotions?.anxiety?.status || userInfo.emotions?.fatty?.status)
            && initRef.current) {
            initRef.current = false;
            setInit(true);
        }
    }, [userInfo.emotions?.depression, userInfo.emotions?.anxiety]);

    const saveUserInfo = async () => {
        const result = await updateUserinfo(userInfo);
        if (result.success) {
            setUserInfo(result.data);
        } else {
            toast?.showToast({ message: result.msg, options: "error" });
        }
    }

    return (
        <Box p="$2" h="$full">
            <Modal isOpen={showDepression} onClose={() => setShowDepression(false)}>
                <ModalBackdrop />
                <ModalContent>
                    <ModalBody>
                        <Box padding="$4">
                            <GEmotionalStep finalStep={true} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr="$2" variant="outline" onPress={() => setShowDepression(false)}>
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button onPress={saveUserInfo}>
                            <ButtonText>Save</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {userInfo.rotationPlan.mode === 0 ? (
                <>
                    <HStack alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.navigate("Home")}>Back</Text></HStack>
                    <Modal
                        isOpen={init}
                        onClose={() => setInit(false)}
                    >
                        <ModalBackdrop />
                        <ModalContent>
                            <ModalHeader>
                                <Heading size="lg">You Know?</Heading>
                                <ModalCloseButton>
                                    <Icon as={CloseIcon} />
                                </ModalCloseButton>
                            </ModalHeader>
                            <ModalBody>
                                <Text p="$4" textAlign="justify">
                                    {(userInfo.emotions?.depression?.status || userInfo.emotions?.anxiety?.status) ?
                                        `Did you know that cooking method is affects your mood as well? During stressful or depressed time, the best is to cook high fiber veggies and to eat it in smooth and warm form like a soup. During anxious time the best is to eat raw crunchy high fiber vegetable and fruits.`
                                        : ""
                                    }
                                    {userInfo.emotions?.fatty?.status ?
                                        `Craving fatty foods can be due to a lack of fat or fat-soluble vitamins (vitamins E, D, K, and A) in your diet. Avocado, carrot, papaya, cantaloupe, mango, red bell pepper, tomatoes, butternut squash, green leafy veggies`
                                        :
                                        ""}
                                </Text>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <VStack p="$4" flex={1}>
                        <Heading pt="$4">
                            Here is Food Suggestions based on your preference and Health Condition
                        </Heading>
                        <Button onPress={() => setShowDepression(true)} mb="$2">
                            <ButtonText>
                                Depression Today
                            </ButtonText>
                        </Button>
                        <ScrollView flex={1}>
                            {plans && plans.length ? plans.map((plan, index) => (
                                <Box p="$4" key={index}>
                                    <VStack>
                                        <HStack display="flex" justifyContent="space-between" alignItems="center" mb="$2">
                                            <Text p="$2" rounded="$lg" $dark-backgroundColor="$backgroundLight200" backgroundColor="$backgroundDark200">{plan.date}</Text>
                                            <Text>{plan.dayType === "SP" ? "Single Protein Day" : plan.dayType === "SD" ? "Social Day" : "Fruit and Vegetable Day"}</Text>
                                        </HStack>
                                        {plan.foods.map((suggest, index) => (
                                            <Card key={index} mb="$4" p="$4" rounded="$md" >
                                                <Heading alignSelf="center" size="lg" mb="$2">{suggest.name}</Heading>
                                                {suggest.reason ? <Text color="text.primary" mb="$1">{suggest.reason}</Text> : ""}
                                                {suggest.ingredients && suggest.ingredients.length ? (
                                                    <Heading size="md">Ingredients</Heading>
                                                ) : ""}
                                                {suggest.ingredients && suggest.ingredients.length ? suggest.ingredients.map((ing: any, i: number) => (
                                                    <Text key={i} color="text.secondary" mb="$0.5">
                                                        • {ing.count ?? ""} {ing.count && ing.unit ? ing.unit : ""} {ing.material}
                                                    </Text>
                                                )) : ""}
                                                {suggest.directions && suggest.directions.length ? (
                                                    <Box>
                                                        <Heading size="md">Directions</Heading>
                                                        {suggest.directions.map((ing: any, j: number) => (
                                                            <Text key={j} color="text.secondary" mb="$0.5" mt={j === 0 ? "$2" : "0"}>
                                                                {j + 1}. {ing}
                                                            </Text>
                                                        ))}
                                                    </Box>
                                                ) : ""}
                                                {suggest.extra ? <Text color="text.tertiary" mt="$2">{suggest.extra}</Text> : ""}
                                            </Card>
                                        ))}

                                    </VStack>
                                    {(index < plans.length - 1) ? <Divider my="$2" /> : ""}
                                </Box>
                            )) : (
                                <HStack space="xl" display="flex" justifyContent="center" alignItems="center" mt="$4">
                                    <Spinner size="large" />
                                    <Text size="md">
                                        Please Wait
                                    </Text>
                                </HStack>
                            )}
                        </ScrollView>
                    </VStack>
                </>
            ) : (
                <>
                    <HStack alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text color="$black" onPress={() => navigation.navigate("Home")}>Back</Text></HStack>
                    <VStack>
                        <Heading color="$black" pt="$4">
                            {userInfo.rotationPlan.mode === 0 ? (
                                "Congradulations on reaching the last step of the sadkhinTherapy Weight Loss Program!"
                            ) : (
                                "Congradulations! You have fully completed SadkhinTherapy Weight Loss Program."
                            )}
                        </Heading>
                        <Button onPress={() => setShowDepression(true)} mb="$2">
                            <ButtonText>
                                Depression Today
                            </ButtonText>
                        </Button>
                        <ScrollView>
                            {suggests && suggests.length ? suggests.map((suggest: any, index: number) => (
                                <Card key={index} mb="$4" p="$4" rounded="$md" >
                                    <Heading alignSelf="center" size="lg" mb="$2">{suggest.name}</Heading>
                                    {suggest.reason ? <Text color="text.primary" mb="$1">{suggest.reason}</Text> : ""}
                                    {suggest.ingredients && suggest.ingredients.length ? (
                                        <Heading size="md">Ingredients</Heading>
                                    ) : ""}
                                    {suggest.ingredients && suggest.ingredients.length ? suggest.ingredients.map((ing: any, i: number) => (
                                        <Text key={i} color="text.secondary" mb="$0.5">
                                            • {ing.count ?? ""} {ing.count && ing.unit ? ing.unit : ""} {ing.material}
                                        </Text>
                                    )) : ""}
                                    {suggest.directions && suggest.directions.length ? (
                                        <Box>
                                            <Heading size="md">Directions</Heading>
                                            {suggest.directions.map((ing: any, j: number) => (
                                                <Text key={j} color="text.secondary" mb="$0.5" mt={j === 0 ? "$2" : "0"}>
                                                    {j + 1}. {ing}
                                                </Text>
                                            ))}
                                        </Box>
                                    ) : ""}
                                    {suggest.extra ? <Text color="text.tertiary" mt="$2">{suggest.extra}</Text> : ""}
                                </Card>
                            )) : (
                                <HStack space="xl" display="flex" justifyContent="center" alignItems="center" mt="$4">
                                    <Spinner size="large" />
                                    <Text size="md">
                                        Please Wait
                                    </Text>
                                </HStack>
                            )}
                        </ScrollView>
                    </VStack>
                </>
            )}
        </Box>
    )

}
export default FoodPlanScreen;