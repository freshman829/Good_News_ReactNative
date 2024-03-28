import React, { useEffect, useMemo, useState } from 'react';
import { Input, InputField, InputIcon, InputSlot, SearchIcon, HStack, Text, Switch, ScrollView } from '@gluestack-ui/themed';
import { Box, Divider, Heading, VStack } from "@gluestack-ui/themed";
import { useUserInfoStore } from '../../../store/UserStore';
import { getFoodList } from '../../../api/foodAPI';
import { useToastr } from '../../../providers/ToastProvider';
import { Dimensions } from 'react-native';

interface DAllergyStepProps {
    finalStep?: boolean
}
const DAllergyStep: React.FC<DAllergyStepProps> = ({ finalStep = false }) => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [searchValue, setSearchValue] = useState('');
    const [foods, setFoods] = useState([]);
    const toast = useToastr();
    
    useEffect(() => {
        const getFoods = async () => {
            const result = await getFoodList();
            if (result.success) {
                setFoods(result.data);
            } else {
                toast?.showToast({ message: result.msg, options: "error" });
            }
        }
        getFoods();
    }, []);

    const proteins = useMemo(() => {
        return foods.filter((protein: any) => protein.type.includes("SP") && protein.name.toLowerCase().includes(searchValue.toLowerCase()))
                .map((protein: any) => protein.name);
    }, [searchValue, foods]);
    const fvs = useMemo(() => {
        return foods.filter((fv: any) => (fv.type.includes("fruit") || fv.type.includes("vegetable")) && fv.name.toLowerCase().includes(searchValue.toLowerCase()))
                .map((fv: any) => fv.name);
    }, [searchValue, foods]);

    const renderProtein = (item: string, key: number) => {
        const isSelected = userInfo.allergies.protein.includes(item);

        const addOrRemoveProtein = () => {
            if (isSelected) {
                setUserInfo({ ...userInfo, allergies: { ...userInfo.allergies, protein: userInfo.allergies.protein.filter((allergy) => allergy !== item) } });
            } else {
                setUserInfo({ ...userInfo, allergies: { ...userInfo.allergies, protein: [...userInfo.allergies.protein, item] } });
            }
        }
        return (
            <Box
                borderBottomWidth="$1"
                borderColor="$trueGray300"
                $dark-borderColor="$trueGray100"
                pl="$0"
                pr="$0"
                py="$2"
                key={`protein-${key}`}
                style={{width:Dimensions.get('window').width/1.5}}
            >
                {/* <TouchableOpacity onPress={addOrRemoveProtein}> */}
                <HStack justifyContent="space-between">
                    <Text size="md" flex={1} >{item}</Text>
                    <Switch style={{marginLeft:20}} value={isSelected} onToggle={addOrRemoveProtein} />
                </HStack>
                {/* </TouchableOpacity> */}
            </Box>
        )
    }

    const renderFV = (item: string, key: number) => {
        const isSelected = userInfo.allergies.fv.includes(item);

        const addOrRemoveFV = () => {
            if (isSelected) {
                setUserInfo({ ...userInfo, allergies: { ...userInfo.allergies, fv: userInfo.allergies.fv.filter((allergy) => allergy !== item) } });
            } else {
                setUserInfo({ ...userInfo, allergies: { ...userInfo.allergies, fv: [...userInfo.allergies.fv, item] } });
            }
        }
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
                key={`fv-${key}`}
                // maxWidth="$4/5"
            >
                {/* <TouchableOpacity onPress={addOrRemoveFV}> */}
                <HStack justifyContent="space-between">
                    <Text size="md" flex={1} >{item}</Text>
                    <Switch value={isSelected} onToggle={addOrRemoveFV} />
                </HStack>
                {/* </TouchableOpacity> */}
            </Box>
        )
    }

    return (
        <Box >
            <VStack>
                <Heading>
                    Let's {finalStep ? "edit" : "add"} any allergy information
                </Heading>
                <Divider my="$8" />
                <Input size={"lg"} variant={"rounded"} isInvalid={false} isDisabled={false}>
                    <InputField onChange={(e: any) => {
                        setSearchValue(e.nativeEvent.text);
                    }} value={searchValue} placeholder="Search allergies" />
                    <InputSlot pr="$4">
                        <InputIcon as={SearchIcon} />
                    </InputSlot>
                </Input>
                <Box>
                    <Heading my="$4" textAlign="center" size="sm">
                        Protein Allergies
                    </Heading>
                    <ScrollView px="$3" h="$48" overflow="scroll">
                        {proteins.map((protein, index) => renderProtein(protein, index))}
                    </ScrollView>
                </Box>
                <Box>
                    <Heading my="$4" textAlign="center" size="sm">
                        Fruit & Vegetables Allergies
                    </Heading>
                    <ScrollView px="$3" h="$48" overflow="scroll">
                        {fvs.map((fv, index) => renderFV(fv, index))}
                    </ScrollView>
                </Box>

            </VStack>
        </Box>
    );
};
export default DAllergyStep;