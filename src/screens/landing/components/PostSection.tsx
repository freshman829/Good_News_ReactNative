import { Box, Button, ButtonText, Heading, Text } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";

const PostSection: React.FC = () => {

    return (
        <TouchableOpacity>
            {/* <Box p="$5" alignItems="center" backgroundColor="#fff" rounded="$md" >
                <Text>🤔What's on your mind?</Text>
            </Box> */}
            <Button variant="outline" action="secondary" isFocusVisible={false} p="$3" h="auto">
                <Heading color="$textDark700">🤔What's on your mind?</Heading>
            </Button>
        </TouchableOpacity>
    );
}

export default PostSection;