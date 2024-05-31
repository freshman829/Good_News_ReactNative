import { FlatList, Image, View, Text, HStack, Card } from "@gluestack-ui/themed"
import { Message } from "../../../types/data";

interface ChatContainerProps {
    messages: Message[]
};

const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {

    const renderItem = ({ item }: { item: Message }) => {
        if (item.sent === false) {
            return (
                <HStack mt="$3" gap="$4" alignItems="flex-end">
                    <Image source={require("../../../assets/images/user_1.png")} w="$7" h="$7" borderRadius={10} alt="" />
                    <Card borderRadius="$md" p="$2" shadowRadius="$2" w={220} mb="$1">
                        <Text size="sm" fontWeight="600" color="$textDark500">{item.message}</Text>
                    </Card>
                </HStack>
            )
        } else {
            return (
                <HStack mt="$3" justifyContent="flex-end" gap="$4" alignItems="flex-end">
                    <Card borderRadius="$md" p="$2" shadowRadius="$2" backgroundColor="#97c163" w={220}>
                        <Text size="sm" fontWeight="600" color="$textDark500">{item.message}</Text>
                    </Card>
                    <Image source={require("../../../assets/images/user_1.png")} w="$7" h="$7" borderRadius={10} alt="" />
                </HStack>
            )
        }
    };
    return (
        <View>
            <FlatList
                mb="$2"
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
};

export default ChatContainer;