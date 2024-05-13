import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateStoreDate = async (dateName: string) => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);

    await AsyncStorage.setItem(dateName, expiredDate.toString());
};

export const updateStoreDataFlag = async (dataName: string, flag: string) => {
    await AsyncStorage.setItem(dataName, flag);
}
