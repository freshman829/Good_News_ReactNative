import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HStack, Icon, Text, View, ChevronLeftIcon, VStack, MenuIcon, ScrollView, set } from "@gluestack-ui/themed";
import { RootStackParamList } from "../../types/data";
import DropdownGroup from "../../components/common/Dropdown";
import { Common } from "../../constants";
import SupplementBlockList from "./components/BlockList";
import { useEffect, useState } from "react";
import { SUPPLEMENT_SHOW_TYPE } from "../../constants/common";
import SupplementRowList from "./components/RowList";
import { getSupplementList } from "../../api/supplementAPI";
import { Supplement } from "../../types/supplement";

type SupplementListScreenProps = NativeStackScreenProps<RootStackParamList, "Supplement">;

const SupplementListScreen: React.FC<SupplementListScreenProps> = ({ navigation }) => { 
    const [showType, setShowType] = useState<string>(SUPPLEMENT_SHOW_TYPE.BLOCK);
    const [supplements, setSupplements] = useState<Supplement[]>([]);
    const [sort, setSort] = useState<string>("asc");
    const [order, setOrder] = useState<string>("price");

    const getSupplements = async () => {
        try {
            const result = await getSupplementList(order, sort);
            if (result.success)
                setSupplements(result.data);
        } catch (error) {
            console.log("getSupplements error", error);
        }
    };

    useEffect(() => {
        getSupplements();
    }, [order, sort])

    const handleChangeShowType = (type: string) => {
        if (type === SUPPLEMENT_SHOW_TYPE.BLOCK) {
            setShowType(SUPPLEMENT_SHOW_TYPE.LIST);
        } else {
            setShowType(SUPPLEMENT_SHOW_TYPE.BLOCK);
        }
    };

    const handleSort = (value: string) => {
        retriveSortField(value);
    }

    const retriveSortField = (value: string) => {
        switch (value) {
            case "HP":
                setSort("desc");
                setOrder("price");
                return "price";
            case "LP":
                setSort("asc");
                setOrder("price");
                return "price";
            case "LD":
                setSort("desc");
                setOrder("createdAt");
                return "date";
            case "OD":
                setSort("asc");
                setOrder("createdAt");
                return "date";
            default:
                return "date";
        }
    };

    const handleGoToDetail = () => {
        navigation.navigate("SupplementDetail");
    };
    return (
        <View display="flex" h="$full" backgroundColor="$backgroundDefault">
            <HStack p="$4" alignItems="center"><Icon as={ChevronLeftIcon} m="$1" w="$4" h="$4" size="sm" /><Text onPress={() => navigation.goBack()}>Back</Text></HStack>
            <VStack pb="$8">
                <HStack justifyContent="space-between" alignItems="center" px="$4" pb="$2">
                    <Text onPress={() => handleChangeShowType(showType)}>
                        <Icon as={MenuIcon} m="$1" w="$4" h="$4" size="md"/>
                    </Text>
                    <DropdownGroup 
                        data={Common.SUPPLEMENT_SORT_DATA}
                        onChange={handleSort}
                    />
                </HStack>
                <ScrollView h="100%">
                    <View px="$4" pb="$16">
                        { showType === SUPPLEMENT_SHOW_TYPE.BLOCK ? <SupplementBlockList supplements={supplements} onItemClick={handleGoToDetail}/> : <SupplementRowList supplements={supplements} onItemClick={handleGoToDetail}/> }
                    </View>
                </ScrollView>
            </VStack>
        </View>
    );
};

export default SupplementListScreen;