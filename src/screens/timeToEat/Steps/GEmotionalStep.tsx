import React from "react";
import { Box, Divider, HStack, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text, VStack } from "@gluestack-ui/themed";
import { useUserInfoStore } from "../../../store/UserStore";

interface GEmotionalStepProps {
    finalStep?: boolean;
    onModal?: boolean;
}
const GEmotionalStep: React.FC<GEmotionalStepProps> = ({ finalStep = false, onModal = false }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();

    const list = [
        "depression",
        "anxiety",
        "stress",
        "fatigue",
        "insomnia",
        "libido",
        "bulimic",
        "sugar",
        "fatty",
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
    
    return (
        <Box mt="$3">
            <VStack>
                {!onModal && (!finalStep ? (
                    <Heading>
                        Set Emotional & Health Conditions and Goals For Today?
                    </Heading>
                ) : (
                    <Heading size="sm">
                        Depression Today
                    </Heading>
                ))}
                {/* <Divider my="$4" /> */}
                {list.map((item, index) => (
                    <Box py="$2" key={index}>
                        <HStack display="flex" justifyContent="space-between" alignItems="center">
                            <Text>{!finalStep ? "Did you experience" : "Have"} {item} today?</Text>
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
                <Box py="$2">
                    <HStack display="flex" justifyContent="space-between" alignItems="center">
                        <Text>Are you pre or menopause?</Text>
                        <Switch value={userInfo.emotions?.meno?.status} onToggle={() => toggle("meno")} />
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
}

export default GEmotionalStep;