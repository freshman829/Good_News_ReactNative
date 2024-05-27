import {  View, Text } from "@gluestack-ui/themed";
import { styled } from '@gluestack-ui/themed';
import SupplementRowItem from "../../../components/supplement/ListItem";
import { Supplement } from "../../../types/supplement";

const RowList = styled(View, {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    gap: "$4",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "$backgroundDefault",
    borderRadius: "$xs",
    py: "$4",
    pr: "$6",
});

interface SupplementRowListProps {
    onItemClick?: () => void;
    supplements: Supplement[];
};

const SupplementRowList: React.FC<SupplementRowListProps> = ({ onItemClick, supplements }) => {

    return (
        <RowList>
            {supplements && supplements.length > 0 && supplements.map((supplement: Supplement, index: number) => 
                    <SupplementRowItem  onClick={onItemClick} supplement={supplement} key={index}/>
                )
            }
        </RowList>
    )
};

export default SupplementRowList;