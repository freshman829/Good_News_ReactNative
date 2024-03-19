import { HStack, VStack, Text, Heading, Slider, Center, SliderThumb, SliderTrack, SliderFilledTrack } from "@gluestack-ui/themed";

const FinalWeight = () => {
    return (
        <VStack mt={8} gap={8}>
            <HStack display="flex" justifyContent="space-between" alignItems="center">
                <Text textAlign="center">Current Weight</Text>
                <VStack>
                    <Heading size="sm">
                        Select Your Current Weight
                    </Heading>
                    <Text size="sm">258 lbs</Text>
                    <Center mt={8}>
                        <Slider  maxValue={500} >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Center>
                </VStack>
            </HStack>
            <HStack display="flex" justifyContent="space-between" alignItems="center">
                <Text textAlign="center">Target Weight</Text>
                <VStack>
                    <Heading size="sm">
                        Select Your Target Weight
                    </Heading>
                    <Text size="sm">258 lbs</Text>
                    <Center mt={8}>
                        <Slider  maxValue={500} >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Center>
                </VStack>
            </HStack>
        </VStack>
    )
}

export default FinalWeight;