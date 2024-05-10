import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateStoreDate = async (dateName: string) => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);

    await AsyncStorage.setItem(dateName, expiredDate.toString());
};