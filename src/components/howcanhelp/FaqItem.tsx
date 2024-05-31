import { Accordion, AccordionHeader, AccordionItem, AccordionTitleText, AccordionTrigger, AccordionIcon, ChevronUpIcon, ChevronDownIcon, View, AccordionContent, Text } from "@gluestack-ui/themed";
import { Faq } from "../../types/faq";

interface FaqItemProps {
    faq: Faq;
};
const FaqItem: React.FC<FaqItemProps> = ({ faq }) => {

    return (
        <View>
            <Accordion>
                <AccordionItem
                    value="faq-item"
                >
                    <AccordionHeader>
                        <AccordionTrigger>
                            {({ isExpanded }) => {
                                return (
                                    <>
                                        <AccordionTitleText>
                                            {faq.title}
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
                            {faq.content}
                        </Text>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </View>
    )
};

export default FaqItem;