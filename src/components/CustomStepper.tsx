import { Box, Text, VStack, Button, ButtonText, View, HStack, Icon, CircleIcon, ScrollView } from '@gluestack-ui/themed';
import React, { ReactNode, useEffect, useState } from "react";

interface CustomStepperProps {
    contents: ReactNode[];
    currentStep: number;
    onNext?: () => void;
    onBefore?: () => void;
    onFinish?: () => void;
}

const CustomStepper: React.FC<CustomStepperProps> = ({
    contents,
    currentStep,
    onNext,
    onBefore,
    onFinish
}) => {
    const [active, setActive] = useState(0);
    const [length, setLength] = useState(0);

    useEffect(() => {
        setLength(contents.length);
    }, [contents]);

    useEffect(() => {
        setActive(currentStep);
    }, [currentStep]);

    const clickPrev = () => {
        if (onBefore) onBefore();
        else setActive(prev => prev - 1 | 0);

    }

    const clickNext = () => {
        if (onNext) onNext();
        else setActive(prev => prev + 1 >= length ? length - 1 : prev + 1);
    }

    const clickFinish = () => {
        if (onFinish) onFinish();
        else console.log("finish");
    }

    return (
        <View w="$full" flex={1} display="flex" justifyContent="space-between">
            <HStack display="flex" justifyContent="space-between" alignItems="center" w="$full">
                {new Array(length).fill(0).map((item, index) => (
                    <Icon as={CircleIcon} key={index} m="$2" w="$4" h="$4" color={active >= index ? "$primary500" : ""} />
                ))}
            </HStack>
            <ScrollView flex={1} p="$4">
                {contents && contents.length ? contents[active] : ""}
            </ScrollView>
            <Box w="$full" p="$4" display="flex" flexDirection="row-reverse" justifyContent="space-between" alignItems="center" pt="$2">
                {active >= 0 && active !== (length - 1) ?
                    <Button action={"primary"} variant="solid" size={"sm"} isDisabled={false}
                        onPress={clickNext}
                    >
                        <ButtonText>
                            Next
                        </ButtonText>
                    </Button>
                    : ""
                }
                {active === (length - 1) ?
                    <Button action={"primary"} variant="solid" size={"sm"} isDisabled={false}
                        onPress={clickFinish}
                    >
                        <ButtonText>
                            Finish
                        </ButtonText>
                    </Button>
                    : ""
                }
                {active > 0 ?
                    <Button action={"primary"} variant={"outline"} size={"sm"} isDisabled={false}
                        onPress={clickPrev}
                    >
                        <ButtonText>
                            Previous
                        </ButtonText>
                    </Button>
                    : ""
                }
            </Box>
        </View>
    );
};
export default CustomStepper;