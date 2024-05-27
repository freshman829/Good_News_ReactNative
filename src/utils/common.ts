import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateStoreDate = async (dateName: string) => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 1);

    await AsyncStorage.setItem(dateName, expiredDate.toString());
};

export const updateStoreDataFlag = async (dataName: string, flag: string) => {
    await AsyncStorage.setItem(dataName, flag);
}

export const formatNumber = (
    number: any,
    decimals = 2,
    chunk = false,
    percentage = false,
    dollar = false,
    price = false,
) => {
    if (number === "" || typeof number === "undefined" || isNaN(number)) {
        return null;
    }

    // Convert the input number to a string with the desired precision
    if (number >= 0.01 || number <= -0.01) {
        number = Number(number).toFixed(decimals);
    } else {
        number = Number(number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimals });
    }

    if (Math.abs(number) === 0) number = '0';

    if (percentage) {
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%";
    }

    if (chunk) {
        let suffix = "";
        if (number >= 1000000000000) {
            number /= 1000000000000;
            suffix = "T";
        } else if (number >= 1000000000) {
            number /= 1000000000;
            suffix = "B";
        } else if (number >= 1000000) {
            number /= 1000000;
            suffix = "M";
        } else if (number >= 1000) {
            number /= 1000;
            suffix = "K";
        }
        if (dollar) {
            return `$${parseFloat(number).toFixed(decimals) + suffix}`;
        } else {
            return parseFloat(number).toFixed(decimals) + suffix;
        }
    }

    if (dollar) {
        return "$" + number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (number.includes(".")) {
        const [wholeNumber, decimalPart] = number.split(".");
        return wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimalPart.padEnd(decimals, "0");
    }

    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
