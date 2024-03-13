import { Box, Card, Heading, Icon, Image, Toast, ToastDescription, ToastTitle, VStack, useToast } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useUserInfoStore } from "../../../store/UserStore";
const features = [
    {
        title: "WHEN TO ROTATE",
        src: require("../../../assets/when_to.png"),
        target: "RotationSchedule"

    },
    {
        title: "COME SEE US",
        src: require("../../../assets/come_see.png"),
        target: ""
    },
    {
        title: "TIME TO EAT",
        src: require("../../../assets/time_to.png"),
        target: ""
    },
    {
        title: "MY GOAL WEIGHT",
        src: require("../../../assets/my_goal.png"),
        target: "GoalWeightScreen"
    },
    {
        title: "HOW CAN WE HELP?",
        src: require("../../../assets/help.png"),
        target: ""
    },
    {
        title: "KID'S CORNER",
        src: require("../../../assets/kids.png"),
        target: ""
    },
]
const FeaturesSection: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const toast = useToast();

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap="$2" alignItems="center" justifyContent="center">
            {features.map((feature, index) => (
                <TouchableOpacity key={index} onPress={() => {
                    if (userInfo.isLoggedIn)
                        navigation.navigate(feature.target);
                    else {
                        toast.show({
                            placement: "top",
                            render: ({ id }) => {
                                const toastId = "toast-" + id;
                                return (
                                    <Toast nativeID={toastId} action="attention" variant="solid">
                                        <VStack space="xs">
                                            <ToastTitle>Alert!</ToastTitle>
                                            <ToastDescription>
                                                Please Login!
                                            </ToastDescription>
                                        </VStack>
                                    </Toast>
                                )
                            }
                        })
                    }
                }}>
                    <Card
                        size="sm" variant="elevated"
                        w="$40" p="$2" h="$40"
                        display="flex" flexDirection="column"
                        alignItems="center" justifyContent="space-around"
                    >
                        <Image source={feature.src} alt={feature.title} />
                        <Heading textAlign="center" lineHeight="$sm">{feature.title}</Heading>
                    </Card>
                </TouchableOpacity>
            ))}
        </Box>
    );
}

export default FeaturesSection;