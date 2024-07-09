import { useState, useEffect } from "react";
import { Heading, VStack, HStack, ButtonGroup, Button, ButtonText, Text, Divider, Pressable, Switch, View } from "@gluestack-ui/themed";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useUserInfoStore } from "../../../../store/UserStore";
import { PlanConstants } from "../../../../constants";
import { formatDateInYMD } from "../../../../utils/numberUtil";
import { Platform, TouchableOpacity } from "react-native";
import { getOfficeList } from "../../../../api/preferedOfficeAPI";
import { Office } from "../../../../types/data";
import DropdownGroup from "../../../../components/common/Dropdown";

const PreferedOffice = () => {
    const { userInfo, setUserInfo } = useUserInfoStore();
    const [officeList, setOfficeList] = useState<Office[]>([]);
    const [states, setStates] = useState<{ label: string, value: string }[]>([]);
    const [selectedState, setSelectedState] = useState<string>("");
    const [cities, setCities] = useState<{ label: string, value: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [defaultCity, setDefaultCity] = useState<string>("");
    const [defaultState, setDefaultState] = useState<string>("");

    useEffect(() => {
        fetchPreferedOffice();
    }, []);

    useEffect(() => {
        if (selectedState) {
            const stateCities = officeList
                .filter(location => location.state === selectedState)
                .map(location => ({ label: location.city, value: location._id }));
            setCities(stateCities);
            if (stateCities.length > 0) {
                setSelectedCity(stateCities[0].value);
                setDefaultCity(userInfo.preferedOffice);
            } else {
                setSelectedCity("");
            }
        }
    }, [selectedState, officeList]);

    useEffect(() => {
        if (officeList.length > 0) {
            const office = officeList.find(location => location._id === userInfo.preferedOffice);
            if (office) {
                setSelectedState(office.state);
                setDefaultState(office.state);
            } else {
                setDefaultState(officeList[0].state);
            }
        }
    }, [officeList])

    const fetchPreferedOffice = async () => {
        try {
            const result = await getOfficeList();
            if (result.success) {
                setOfficeList(result.data);
                const uniqueStates: string[] = [...new Set((result.data as Office[]).map((location: Office) => location.state))];
                const fetchStates = uniqueStates.map(state => {
                    const office = result.data.find((location: Office) => location.state === state);
                    return { label: state, value: state };
                });
                if (fetchStates.length > 0) {
                    setStates(fetchStates);
                }
            }
        } catch (error) {
            console.log("Error in fetchPreferedOffice", error);
        }
    };

    const handleChangeState = (value: string) => {
        setSelectedState(value);
    };

    const handleChangeCity = (value: string) => {
        setSelectedCity(value);
        setUserInfo({ ...userInfo, preferedOffice: value })
    };

    return (
        <VStack gap={4} mt="$2">
            <Text textAlign="center">Prefered Office</Text>
            <HStack justifyContent="space-between">
                <DropdownGroup 
                    data={states}
                    onChange={handleChangeState}
                    defaultValue={defaultState}
                />
                <DropdownGroup 
                    data={cities}
                    onChange={handleChangeCity}
                    defaultValue={defaultCity}
                />
            </HStack>
        </VStack>
    )
}

export default PreferedOffice;