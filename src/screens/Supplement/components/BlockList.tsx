import { HStack, ScrollView, View, Text } from "@gluestack-ui/themed";
import { styled } from '@gluestack-ui/themed';
import SupplementBlockItem from "../../../components/supplement/BlockItem";
import { Supplement } from "../../../types/supplement";

const BlockList = styled(View, {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "$4",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "$backgroundDefault",
    borderRadius: "$xs",
    py: "$4",
});

const BlockItemWrapper = styled(View, {
    width: "48%",  
    marginBottom: "$4"       
});

interface SupplementBlockListProps {
    isBlockView?: boolean;
    onItemClick?: () => void;
    supplements: Supplement[];
}

const SupplementBlockList: React.FC<SupplementBlockListProps> = ({ onItemClick, supplements }) => {

    return (
        <BlockList>
            {supplements && supplements.length > 0 && supplements.map((supplement: Supplement, index: number) => 
                    <BlockItemWrapper key={index}>
                        <SupplementBlockItem onClick={onItemClick} supplement={supplement}/>
                    </BlockItemWrapper>
                )
            }
        </BlockList>
    );
}

export default SupplementBlockList;

