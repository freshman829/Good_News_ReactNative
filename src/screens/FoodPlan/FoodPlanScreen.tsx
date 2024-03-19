import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { Box, Text } from "@gluestack-ui/themed";

type FoodPlanProps = NativeStackScreenProps<
    RootStackParamList,
    "FoodPlan"
>;

const FoodPlanScreen: React.FC<FoodPlanProps> = ({ navigation }) => {
    
    return (
        <Box>
            <Text>Comming soon</Text>
        </Box>
    );
}
export default FoodPlanScreen;