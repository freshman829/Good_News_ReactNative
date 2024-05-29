import { HStack, Image, View, Text, Button, ButtonText } from "@gluestack-ui/themed"


interface AccountInformationProps {

};

const AccountInformation: React.FC<AccountInformationProps> = ({}) => {

    return (
        <View borderRadius="$lg" w="$full" $dark-backgroundColor="$backgroundDark900" backgroundColor="$textLight50" borderColor="$textLight200" p="$4">
            <HStack justifyContent="space-between" w="$full" alignItems="center">
                <Image source={require("../../../assets/images/user_1.png")} w="$16" h="$16" borderRadius={10} alt="" />
                <View>
                    <Text fontWeight="bold">John Doe</Text>
                    <Text>Email: johndoe@gmail.com</Text>
                </View>
                <Button
                    borderRadius="$lg"
                    px="$4"
                    size="xs"
                >
                    <ButtonText fontSize="$xs" size="xs">Edit</ButtonText>
                </Button>
            </HStack>
        </View>
    )
}

export default AccountInformation;