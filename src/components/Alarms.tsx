
interface AlarmsProps {
    wakeTime: string;
    sleepTime: string;
    plan: number;
    setAlarm: (alarms: []) => void
}

const Alarms: React.FC<AlarmsProps> = ({ wakeTime, sleepTime, plan }) => {
    
    return (
        <></>
    );
}

export default Alarms;