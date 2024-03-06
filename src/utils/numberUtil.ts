
export function getRandomNumber(n: number): number {
    return Math.floor(Math.random() * n);
}

export function convertTo24HourFormat(time12: string) {
    let [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}`;
}