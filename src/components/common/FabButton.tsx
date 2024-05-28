import { Fab, Icon, AddIcon, Button, ButtonText, Text } from "@gluestack-ui/themed";

interface FabButtonProps {
    onPress: () => void;
    buttonText: string;
};

const FabButton: React.FC<FabButtonProps> = ({ onPress, buttonText }) => {

    return (
        <Fab
            onPress={onPress}
            position="absolute"
            placement="bottom center"
            bottom="$8"
            px="$8"
            py="$3.5"
        >
            <Text
                color="white"
                fontSize="$md"
            >
                {buttonText}
            </Text>
        </Fab>
    );
};


export default FabButton;
