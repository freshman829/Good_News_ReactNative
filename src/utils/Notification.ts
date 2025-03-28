import notifee, {
    AndroidImportance,
    AuthorizationStatus,
    EventType,
    Notification,
    TimestampTrigger,
    TriggerType,
} from '@notifee/react-native';
import { Platform } from 'react-native';

class Notifications {
    constructor() {
        // Bootstrap method is called when the app is launched from a notification
        this.bootstrap();

        // Listen for events
        // This is called when the app is in the foreground
        notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);
                    break;
                case EventType.PRESS:
                    console.log('User pressed notification', detail.notification);
                    break;
            }
        });

        // This is called when the app is in the background
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            const { notification } = detail;
            console.log('Notification received: background', type, detail);
            if (notification) {
                this.handleNotificationOpen(notification);
            }
        });
    }

    // This method deals with what happens when the user clicks on the notification
    public handleNotificationOpen(notification: Notification) {
        const { data } = notification;
        console.log('Notification Opened', data);
    }

    // This method is called when the app is launched from a notification
    public async bootstrap() {
        const initialNotification = await notifee.getInitialNotification();
        if (initialNotification) {
            this.handleNotificationOpen(initialNotification.notification);
        }
    }

    // This method is called to check if the user has granted permission to send notifications
    public async checkPermissions() {
        const settings = await notifee.requestPermission();

        if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
            return true;
        } else {
            console.log('User declined permissions');
            return false;
        }
    }

    public async scheduleNotification({
        id,
        reminder,
        date,
    }: {
        id: string;
        reminder: string;
        date: Date;
    }) {
        // Check if the user has granted the permission to send notifications
        const hasPermissions = await this.checkPermissions();

        // If the user has granted the permission, schedule the notification
        if (hasPermissions) {
            // Create a timestamp trigger for the notification
            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP, // This is the type of trigger, we have other types of triggers as well
                timestamp: +date, // +date converts the date to timestamp
            };

            // Create the notification details
            const notificationDetails = {
                id: id,
                title: `🔔 You asked for this reminder - ${reminder}`,
                body: "It's time to rotate",
                android: {
                    channelId: 'reminder',
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    sound: 'default',
                },
                data: {
                    id: id,
                    action: 'reminder',
                    details: {
                        name: reminder,
                        date: date.toString(),
                    },
                },
            };

            await notifee.createTriggerNotification(notificationDetails, trigger);
        }
    }

    public async toggleNotification({
        id,
        reminder,
        date
    }: {
        id: string,
        reminder?: string,
        date?: Date
    }) {
        const hasPermissions = await this.checkPermissions();

        // If the user has granted the permission, schedule the notification
        if (hasPermissions) {
            let alarms = await notifee.getTriggerNotificationIds();
            if (alarms.includes(id))
                await notifee.cancelNotification(id);
            else if (reminder && date)
                this.scheduleNotification({ id, reminder, date });
        }
    }

    public async cancelAllNotifications() {
        const hasPermissions = await this.checkPermissions();

        // If the user has granted the permission, schedule the notification
        if (hasPermissions) {
            await notifee.cancelAllNotifications();
        }
    }

    public async cancelNotification(id: string) {
        const hasPermissions = await this.checkPermissions();
        if (hasPermissions) {
            await notifee.cancelNotification(id);
        }
    }
}

// Platform-specific configurations
if (Platform.OS === 'android') {
    // Configure Android notification channels
    notifee.createChannel({
        id: 'reminder',
        name: 'Reminder Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
    });
}

if (Platform.OS === 'ios') {
    // iOS specific settings can be added here if needed
}

// Exporting an instance of the class
export default new Notifications();
