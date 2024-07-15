import { Dimensions } from "react-native";
import { Box, Card, Heading, Image, useToast } from "@gluestack-ui/themed";
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
        target: "ComeSeeUs"
    },
    {
        title: "TIME TO EAT",
        src: require("../../../assets/time_to.png"),
        target: "WhenToEat"
    },
    {
        title: "MY GOAL WEIGHT",
        src: require("../../../assets/my_goal.png"),
        target: "GoalWeightScreen"
    },
    {
        title: "HOW CAN WE HELP?",
        src: require("../../../assets/help.png"),
        target: "HowCanHelp"
    },
    {
        // title: "KID'S CORNER",
        title: "SUPPLEMENTS",
        src: require("../../../assets/kids.png"),
        target: "Supplement"
    },
];

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 16;

const FeaturesSection: React.FC<{ navigation: any, onLogin: () => Promise<Boolean | undefined> }> = ({ navigation, onLogin }) => {
    const { userInfo } = useUserInfoStore();

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap="$2" alignItems="center" justifyContent="center">
            {features.map((feature, index) => (
                <TouchableOpacity key={index} onPress={async () => {
                    if (userInfo._id) {
                        if (feature.title === "TIME TO EAT" && userInfo.isFinishInterview) {
                            navigation.navigate("FoodPlan");
                        } else {
                            navigation.navigate(feature.target);
                        }
                    } else {
                        let res = await onLogin();
                        setTimeout(() => {
                            if (res) {
                                if (feature.title === "TIME TO EAT" && userInfo.isFinishInterview) {
                                    navigation.navigate("FoodPlan");
                                } else {
                                    navigation.navigate(feature.target);
                                }
                            }
                        }, 500);
                    }
                }}>
                    <Card
                        size="sm" variant="elevated"
                        w={cardWidth} p="$2" h="$40"
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