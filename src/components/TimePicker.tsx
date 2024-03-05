import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type TimePickerProps = {
    isWake: boolean,
    limitTime?: string,
    setTime: (time: string) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ isWake = true, limitTime, setTime }) => {
    const [selectedTime, setSelectedTime] = useState('05:00');

    useEffect(() => {
        if (isWake) {
            setSelectedTime('05:00');
        } else {
            setSelectedTime('23:00');
        }
    }, []);
    // Generate time options
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 5; hour <= 23; hour++) {
            let hourString = hour < 10 ? `0${hour}` : `${hour}`;
            times.push(`${hourString}:00`);
            if (hour < 23) {
                // Adding 30 minutes step only if it's before 11 PM
                times.push(`${hourString}:30`);
            }
        }
        let start = '05:00';
        let end = '23:00';
        if (limitTime) {
            if (isWake) start = limitTime;
            else end = limitTime;
        }
        return times.filter(time => time <= end && time >= start); // Ensures we only include times between 5 AM and 11 PM
    };

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedTime}
                style={styles.picker}
                onValueChange={(itemValue) => {
                    setSelectedTime(itemValue)
                    setTime(itemValue)
                }
                }>
                {generateTimeOptions().map((time) => (
                    <Picker.Item key={time} label={time} value={time} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 200
    },
    picker: {
        height: 50,
        width: 120,
    },
});

export default TimePicker;
