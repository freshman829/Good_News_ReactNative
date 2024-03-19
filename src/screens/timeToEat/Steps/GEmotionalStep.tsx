import { Box, Divider, HStack, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, VStack } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";

const GEmotionalStep = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    console.log(userInfo.emotions);
    
    const list = [
        "depression",
        "anxiety",
        "stress",
        "fatigue",
        "insomnia"
    ];

    const toggle = (item: string) => {
        setUserInfo({
            ...userInfo,
            emotions: {
                ...userInfo.emotions,
                [item]: {
                    ...userInfo.emotions?.[item as keyof typeof userInfo.emotions],
                    status: !userInfo.emotions?.[item as keyof typeof userInfo.emotions]?.status
                }
            }
        });
    }
    const changeSeverity = (value: number, item: string) => {
        setUserInfo({
            ...userInfo,
            emotions: {
                ...userInfo.emotions,
                [item]: {
                    ...userInfo.emotions?.[item as keyof typeof userInfo.emotions],
                    severity: value,
                    updated: new Date()
                }
            }
        });
    }
    // const toggleDepression = () => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             depression: {
    //                 ...userInfo.emotions?.depression,
    //                 status: !userInfo.emotions?.depression?.status
    //             }
    //         }
    //     });
    // }

    // const changeDepressionSeverity = (value: number) => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             depression: {
    //                 ...userInfo.emotions.depression,
    //                 severity: value,
    //                 updated: new Date()
    //             }
    //         }
    //     });
    // }

    // const toggleAnxiety = () => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             anxiety: {
    //                 ...userInfo.emotions.anxiety,
    //                 status: !userInfo.emotions.anxiety.status
    //             }
    //         }
    //     });
    // }

    // const changeAnxietySeverity = (value: number) => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             anxiety: {
    //                 ...userInfo.emotions.anxiety,
    //                 severity: value,
    //                 updated: new Date()
    //             }
    //         }
    //     });
    // }

    // const toggleStress = () => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             stress: {
    //                 ...userInfo.emotions.stress,
    //                 status: !userInfo.emotions.stress.status
    //             }
    //         }
    //     });
    // }
    // const changeStressSeverity = (value: number) => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             stress: {
    //                 ...userInfo.emotions.stress,
    //                 severity: value,
    //                 updated: new Date()
    //             }
    //         }
    //     });
    // }
    // const toggleFatigue = () => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             fatigue: {
    //                 ...userInfo.emotions.fatigue,
    //                 status: !userInfo.emotions.fatigue.status
    //             }
    //         }
    //     });
    // }

    // const changeFatigueSeverity = (value: number) => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             fatigue: {
    //                 ...userInfo.emotions.fatigue,
    //                 severity: value,
    //                 updated: new Date()
    //             }
    //         }
    //     });
    // }
    // const toggleInsomnia = () => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             insomnia: {
    //                 ...userInfo.emotions.insomnia,
    //                 status: !userInfo.emotions.insomnia.status
    //             }
    //         }
    //     });
    // }
    // const changeInsomniaSeverity = (value: number) => {
    //     setUserInfo({
    //         ...userInfo,
    //         emotions: {
    //             ...userInfo.emotions,
    //             insomnia: {
    //                 ...userInfo.emotions.insomnia,
    //                 severity: value,
    //                 updated: new Date()
    //             }
    //         }
    //     });
    // }

    return (
        <Box>
            <VStack>
                <Heading>
                    Set Emotional & Health Conditions and Goals For Today?
                </Heading>
                <Divider my="$4" />
                {list.map((item, index) => (
                    <Box py="$2" key={index}>
                        <HStack display="flex" justifyContent="space-between" alignItems="center">
                            <Text>Did you experience {item} today?</Text>
                            <Switch value={userInfo.emotions?.[item as keyof typeof userInfo.emotions]?.status} onToggle={() => toggle(item)} />
                        </HStack>
                        {userInfo.emotions?.[item as keyof typeof userInfo.emotions]?.status ? (
                            <VStack p="$4">
                                <Slider
                                    value={userInfo.emotions?.[item as keyof typeof userInfo.emotions]?.severity}
                                    onChange={(value) => changeSeverity(value, item)}
                                    size="md"
                                    maxValue={10}
                                    orientation="horizontal"
                                    isDisabled={false}
                                    isReversed={false}
                                >
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                                <Text mt="$4">Depression Severity: {userInfo.emotions?.[item as keyof typeof userInfo.emotions]?.severity}</Text>
                                {
                                    userInfo.emotions?.[item as keyof typeof userInfo.emotions]?.updated
                                        ? <Text mt="$2">Last Updated: {new Date(userInfo.emotions[item as keyof typeof userInfo.emotions].updated).toLocaleDateString()}</Text>
                                        : ""
                                }

                            </VStack>
                        ) : ""}
                    </Box>
                ))}
                {/* <Box py="$2">
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Did you experience anxiety today?</Text>
                        <Switch value={userInfo.emotions?.anxiety?.status} onToggle={toggleAnxiety} />
                    </HStack>
                    {userInfo.emotions?.anxiety?.status ? (
                        <VStack p="$4">
                            <Slider
                                value={userInfo.emotions?.anxiety?.severity}
                                onChange={changeAnxietySeverity}
                                size="md"
                                orientation="horizontal"
                                isDisabled={false}
                                isReversed={false}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text mt="$4">Anxiety Severity: {userInfo.emotions?.anxiety?.severity}</Text>
                            {userInfo.emotions?.anxiety?.updated ?
                                <Text mt="$2">Last Updated: {userInfo.emotions?.anxiety?.updated.toLocaleDateString()}</Text> : ""
                            }
                        </VStack>
                    ) : ""}
                </Box>
                <Box py="$2">
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Did you experience stress today?</Text>
                        <Switch value={userInfo.emotions?.stress?.status} onToggle={toggleStress} />
                    </HStack>
                    {userInfo.emotions?.stress?.status ? (
                        <VStack p="$4">
                            <Slider
                                value={userInfo.emotions?.stress?.severity}
                                onChange={changeStressSeverity}
                                size="md"
                                orientation="horizontal"
                                isDisabled={false}
                                isReversed={false}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text mt="$4">Stress Severity: {userInfo.emotions?.stress?.severity}</Text>
                            {userInfo.emotions?.stress?.updated ?
                                <Text mt="$2">Last Updated: {userInfo.emotions?.stress?.updated.toLocaleDateString()}</Text> : ""
                            }
                        </VStack>
                    ) : ""}
                </Box>
                <Box py="$2">
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Did you experience fatigue today?</Text>
                        <Switch value={userInfo.emotions?.fatigue.status} onToggle={toggleFatigue} />
                    </HStack>
                    {userInfo.emotions?.fatigue.status ? (
                        <VStack p="$4">
                            <Slider
                                value={userInfo.emotions?.fatigue.severity}
                                onChange={changeFatigueSeverity}
                                size="md"
                                orientation="horizontal"
                                isDisabled={false}
                                isReversed={false}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text mt="$4">Fatigue Severity: {userInfo.emotions?.fatigue.severity}</Text>
                            {userInfo.emotions?.fatigue.updated ?
                                <Text mt="$2">Last Updated: {userInfo.emotions?.fatigue.updated.toLocaleDateString()}</Text> : ""
                            }
                        </VStack>
                    ) : ""}
                </Box>
                <Box py="$2">
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Did you experience insomnia today?</Text>
                        <Switch value={userInfo.emotions?.insomnia.status} onToggle={toggleInsomnia} />
                    </HStack>
                    {userInfo.emotions?.insomnia.status ? (
                        <VStack p="$4">
                            <Slider
                                value={userInfo.emotions?.insomnia.severity}
                                onChange={changeInsomniaSeverity}
                                size="md"
                                orientation="horizontal"
                                isDisabled={false}
                                isReversed={false}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                            <Text mt="$4">Insomnia Severity: {userInfo.emotions?.insomnia.severity}</Text>
                            {userInfo.emotions?.insomnia.updated ?
                                <Text mt="$2">Last Updated: {userInfo.emotions?.insomnia.updated.toLocaleDateString()}</Text> : ""
                            }
                        </VStack>
                    ) : ""}
                </Box> */}
            </VStack>
        </Box>
    );
}

export default GEmotionalStep;