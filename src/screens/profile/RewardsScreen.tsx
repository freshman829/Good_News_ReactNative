import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";

type RewardsScreenProps = NativeStackScreenProps<RootStackParamList, "Rewards">;

const RewardsScreen: React.FC<RewardsScreenProps> = ({ navigation }) => {
    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Rewards" /> 
            </View>
        </View>
    )
};

export default RewardsScreen;