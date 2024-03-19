import React, { useEffect, useMemo, useState } from 'react';
import { Input, InputField, InputIcon, InputSlot, SearchIcon, HStack, Text, Switch, ScrollView } from '@gluestack-ui/themed';
import { Box, Divider, Heading, VStack } from "@gluestack-ui/themed";
import { Allergies } from '../../../constants';
import { useUserInfoStore } from '../../../store/UserStore';
// import { TouchableOpacity } from 'react-native';

const DAllergyStep = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [searchValue, setSearchValue] = useState('');
    
    const proteins = useMemo(() => {
        return Allergies.proteinAllergies.filter((protein) => protein.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue]);
    
    const fvs = useMemo(() => {
        return Allergies.fvAllergies.filter((fv) => fv.toLowerCase().includes(searchValue.toLowerCase()));
    }, [searchValue]);

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
                $base-pl="$0"
                $base-pr="$0"
                $sm-pl="$4"
                $sm-pr="$4"
                py="$2"
                key={`protein-${key}`}
            >
                {/* <TouchableOpacity onPress={addOrRemoveProtein}> */}
                    <HStack justifyContent="space-between">
                        <Text size="md" color="$secondary800" >{item}</Text>
                        <Switch value={isSelected} onToggle={addOrRemoveProtein} />
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
            >
                {/* <TouchableOpacity onPress={addOrRemoveFV}> */}
                    <HStack justifyContent="space-between">
                        <Text size="md" color="$secondary800" >{item}</Text>
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
                    Let's add any allergy information
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