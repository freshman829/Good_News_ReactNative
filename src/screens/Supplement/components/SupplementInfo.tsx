import { VStack, Image, Text, HStack, Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionIcon, ChevronUpIcon, ChevronDownIcon, AccordionTitleText, AccordionContent, View } from "@gluestack-ui/themed";

import { formatNumber } from "../../../utils/common";
import { Supplement } from "../../../types/supplement";

interface SupplementInfo {
    supplement: Supplement | null;
};
const SupplementInfo: React.FC<SupplementInfo> = ({ supplement }) => {

    return (
        <View>
            {supplement &&
                <VStack>
                    <Image
                        mb="$2"
                        h={290}
                        w="$full"
                        borderRadius={5}
                        source={{
                            uri: supplement?.image || "",
                        }}
                        alt=""
                    />
                    <HStack
                        justifyContent="space-between"
                        px="$12"
                        py="$4"
                    >
                        <VStack>
                            <Text
                                fontSize="$lg"
                                fontStyle="normal"
                                fontFamily="$heading"
                                fontWeight="$bold"
                                bold={true}
                                lineHeight="$sm"
                                mb="$2"
                                sx={{
                                color: "$textLight700",
                                _dark: {
                                    color: "$textDark200",
                                },
                                }}
                            >
                                {supplement?.name}
                            </Text>
                            <Text
                                fontSize="$sm"
                                fontStyle="normal"
                                fontFamily="$heading"
                                fontWeight="$light"
                                lineHeight="$sm"
                                mb="$2"
                                sx={{
                                color: "$textLight700",
                                _dark: {
                                    color: "$textDark200",
                                },
                                }}
                            >
                                {supplement?.category}
                            </Text>
                        </VStack>
                        <Text
                            fontSize="$sm"
                            fontStyle="normal"
                            fontFamily="$heading"
                            fontWeight="$light"
                            lineHeight="$sm"
                            mb="$2"
                            sx={{
                            color: "$textLight700",
                            _dark: {
                                color: "$textDark200",
                            },
                            }}
                        >
                            {formatNumber(supplement?.price, 2, true, false, true, true)}
                        </Text>
                    </HStack>
        
                    <Accordion>
                        <AccordionItem
                            value="item-description"
                        >
                            <AccordionHeader>
                                <AccordionTrigger>
                                    {({ isExpanded }) => {
                                        return (
                                            <>
                                                <AccordionTitleText>
                                                    Description
                                                </AccordionTitleText>
                                                {isExpanded ? (
                                                    <AccordionIcon as={ChevronUpIcon} />
                                                ) : (
                                                    <AccordionIcon as={ChevronDownIcon} />
                                                )}
                                            </>
                                        )
                                    }}
                                </AccordionTrigger>
                            </AccordionHeader>
                            <AccordionContent>
                                <Text
                                    fontSize="$sm"
                                    fontStyle="normal"
                                    fontFamily="$heading"
                                    fontWeight="$normal"
                                    lineHeight="$md"
                                    sx={{
                                    color: "$textLight700",
                                    _dark: {
                                        color: "$textDark200",
                                    },
                                    }}
                                >
                                    {supplement?.description}
                                </Text>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </VStack>
            }
        </View>
    );
};

export default SupplementInfo;