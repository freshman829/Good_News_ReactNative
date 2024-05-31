import { useEffect } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/data";
import { useUserInfoStore } from "../../store/UserStore";
import { Box, Button, ButtonText, Card, Center, ChevronLeftIcon, CloseIcon, FlatList, FormControl, HStack, Heading, Icon, Input, InputField, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ScrollView, Text, VStack, View } from "@gluestack-ui/themed";
import { useState } from "react";
import { registerNewTarget, saveNewWeightLog } from "../../api/userAPI";
import { Dimensions } from "react-native";
import moment from 'moment';
import { LineChart } from 'react-native-chart-kit';
import EmojiInput from '../../components/EmojiInput';
import CenterGoBack from '../../components/common/CenterGoBack';

type GoalWeightScreenProps = NativeStackScreenProps<
    RootStackParamList,
    "GoalWeightScreen"
>;

const GoalWeightScreen: React.FC<GoalWeightScreenProps> = ({ navigation }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [target, setTarget] = useState("0");
    const [current, setCurrent] = useState("0");
    const [comment, setComment] = useState("");
    const [labels, setlabels] = useState<string[]>([]);
    const [values, setvalues] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        setCurrent("0");
    }, [isOpen]);

    useEffect(() => {
        if (userInfo?.weightLogs?.logs?.length) {
            const formattedData = userInfo.weightLogs.logs.map(entry => ({
                label: moment(entry.date).format('MM/DD'),
                value: entry.weight
            }));
            setlabels(formattedData.map(d => d.label));
            setvalues(formattedData.map(d => d.value));
        }
    }, [userInfo.weightLogs.logs]);
    const saveTarget = async () => {
        const data = {
            id: userInfo._id,
            value: {
                target: parseInt(target),
                log: { weight: parseInt(current), date: new Date() }
            }
        }
        const result = await registerNewTarget(data);
        setUserInfo(result);
    }

    const saveWeightLog = async () => {
        const saveData = {
            id: userInfo._id,
            log: {
                weight: parseInt(current),
                comment,
                date: new Date()
            }
        };
        const result = await saveNewWeightLog(saveData);
        setUserInfo(result);
        setIsOpen(false);
        setComment("");
    }

    if (!userInfo.weightLogs.target)
        return (
            <Box p="$4" flex={1} bg="$backgroundDefault">
                <HStack alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>
                <Heading textAlign="center" my="$10">
                    My Goal Weight
                </Heading>
                <Box>
                    <Center>
                        <Card size="lg" variant="elevated" m="$5">
                            <FormControl
                                p="$4"
                            >
                                <VStack space="xl" mb="$4">
                                    <Heading mb="$1" size="md">
                                        Set Goal Weight
                                    </Heading>
                                    <VStack space="xs">
                                        <Text lineHeight="$xs">Target Weight</Text>
                                        <Input>
                                            <InputField type="text" value={target} onChangeText={(e) => setTarget(e)} />
                                        </Input>
                                    </VStack>
                                    <VStack space="xs">
                                        <Text lineHeight="$xs">Current Weight</Text>
                                        <Input>
                                            <InputField type="text" value={current} onChangeText={(e) => setCurrent(e)} />
                                        </Input>
                                    </VStack>
                                </VStack>
                                <Button
                                    ml="auto"
                                    onPress={saveTarget}
                                >
                                    <ButtonText>Save</ButtonText>
                                </Button>
                            </FormControl>
                        </Card>
                    </Center>
                </Box>
            </Box>
        )
    function renderLog(item: any) {
        return (
            <Box
                borderBottomWidth="$1"
                borderColor="$trueGray300"
                $dark-borderColor="$trueGray100"
                $base-pl="$0"
                $base-pr="$0"
                $sm-pl="$4"
                $sm-pr="$4"
                py="$2"
            >
                <HStack justifyContent="space-between">
                    <Text size="md" >{moment(item.item.date).format("MM/DD/YYYY")}</Text>
                    {item.item.comment ? <Text size='md' >{item.item.comment}</Text> : ""}
                    <Text size='md' >{item.item.weight} lbs</Text>
                </HStack>
            </Box>
        )
    }

    return (
        <Box p="$4" flex={1} bg="$backgroundDefault">
            <View>
                <CenterGoBack navigation={navigation} title="My Goal Weight" />
            </View>
            <Heading mt="$4">
                My Goal Weight {userInfo?.weightLogs?.target ? `(${userInfo?.weightLogs?.target} lbs)` : ""}
            </Heading>
            <VStack display='flex' flex={1} flexDirection='column' justifyContent='space-between'>
                {labels?.length && values?.length ?
                    <Box>
                        <LineChart
                            data={{
                                labels: labels,
                                datasets: [{ data: values }]
                            }}
                            width={screenWidth - 32} // from react-native
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="lbs"
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "#e1eff7",
                                backgroundGradientFrom: "#003f5c",
                                backgroundGradientTo: "#f5f5f5",
                                decimalPlaces: 1, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffffff", // white border for dots
                                    fill: "#4f97a3"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                        />
                    </Box>
                    : ""
                }
                <Box flex={1}
                    backgroundColor='$backgroundDarkMuted'
                    $light-backgroundColor='$backgroundLightMuted'
                    p="$4"
                    mb="$2"
                    borderRadius="$lg"
                    overflow='scroll'
                >
                    <Text>weight logs</Text>
                    <FlatList
                        data={userInfo.weightLogs.logs}
                        renderItem={renderLog}
                        keyExtractor={(item, index) => index.toString()}
                        px="$3"
                    />
                </Box>
                <Box>
                    <Button onPress={() => setIsOpen(prev => !prev)}>
                        <ButtonText>
                            Set New Weight
                        </ButtonText>
                    </Button>
                </Box>
            </VStack>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg">Set New Weight</Heading>
                        <ModalCloseButton>
                            <Icon as={CloseIcon} />
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <VStack space="xs">
                            <Text lineHeight="$xs">Current Weight</Text>
                            <Input>
                                <InputField type="text" value={current} onChangeText={(e) => setCurrent(e)} />
                            </Input>
                        </VStack>
                        <VStack space="xs" mt="$2">
                            <Text lineHeight="$xs">Comment</Text>
                            <EmojiInput value={comment} onChangeText={(text) => setComment(text)} />
                            {/* <Input>
                                <InputField type="text" value={comment} onChangeText={(text) => setComment(text)} />
                            </Input> */}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="outline"
                            size="sm"
                            action="secondary"
                            mr="$3"
                            onPress={() => {
                                setIsOpen(false)
                            }}
                        >
                            <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button
                            size="sm"
                            action="positive"
                            borderWidth="$0"
                            onPress={saveWeightLog}
                        >
                            <ButtonText>Set</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default GoalWeightScreen;