import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { View } from "@gluestack-ui/themed";
import CenterGoBack from "../../components/common/CenterGoBack";

type ComeSeeUsScreenProps = NativeStackScreenProps<RootStackParamList, "ComeSeeUs">;
const ComeSeeUsScreen: React.FC<ComeSeeUsScreenProps> = ({ navigation }) => {

    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <View p="$4">
                <CenterGoBack navigation={navigation} title="Come See Us" />
            </View>

        </View>
    )
};

export default ComeSeeUsScreen;