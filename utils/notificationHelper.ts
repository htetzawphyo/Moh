import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Notification တွေ ပြသတဲ့အခါ ဘယ်လိုပုံစံမျိုး ပြရမလဲဆိုတာ သတ်မှတ်ခြင်း
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Alert ပြမလား
    shouldPlaySound: true, // အသံမြည်မလား
    shouldSetBadge: true, // App icon ပေါ်မှာ badge (number) ပြမလား
    shouldShowBanner: true, // Banner ပြမလား
    shouldShowList: true, // Notification list မှာ ပြမလား
  }),
});

/**
 * Device ရဲ့ Notification Permission ကို တောင်းခံခြင်း။
 * App ကို စဖွင့်ချိန် (သို့မဟုတ် Notification ပို့ဖို့ လိုအပ်တဲ့ အချိန်) မှာ ခေါ်သင့်ပါတယ်။
 * @returns {Promise<boolean>} Permission ရခဲ့ရင် true, မရခဲ့ရင် false
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  let token;

  if (Platform.OS === "android") {
    // Android မှာ Notification Channel သတ်မှတ်ဖို့ လိုအပ်နိုင်ပါတယ်။
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Permission အခြေအနေ စစ်ဆေးခြင်း
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Permission မရသေးရင် တောင်းခံခြင်း
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Permission မရရင် warning ပြခြင်း
  if (finalStatus === "granted") {
    console.log("Notification permission granted!");
  } else {
    console.log("Notification permission NOT granted!");
  }

  // Push Token ကို ရယူခြင်း (Push Notification အတွက် လိုအပ်ပေမယ့် Local အတွက် မလိုအပ်ပါ)
  // Local Notification အတွက်ကတော့ ဒီအဆင့်က မလိုအပ်ပါဘူး။
  // token = (await Notifications.getExpoPushTokenAsync()).data;
  // console.log(token); // Debugging အတွက်

  return true;
}

/**
 * Local Notification တစ်ခုကို ပို့ခြင်း။
 * @param {string} title - Notification ရဲ့ ခေါင်းစဉ်
 * @param {string} body - Notification ရဲ့ အကြောင်းအရာ
 * @param {number} [delay=0] - Notification ပို့မယ့် အချိန် (millisecond ဖြင့်)၊ ချက်ချင်းပို့ချင်ရင် 0
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  delay: number = 1
) {
  console.log("Attempting to send notification:", { title, body, delay }); 
  const hasPermission = await registerForPushNotificationsAsync();
  console.log("Notification permission status:", hasPermission);
  if (!hasPermission) {
    console.warn(
      "Notification permissions not granted. Cannot send local notification."
    );
    return;
  }

  const schedulingOptions: Notifications.NotificationContentInput = {
    title: title,
    body: body,
    data: { someData: "goes here" }, // Notification နဲ့တွဲပြီး ပို့ချင်တဲ့ data
  };

  if (delay > 0) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: schedulingOptions,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delay / 1000, 
        repeats: false, 
      },
    });
    console.log(`Scheduled notification with ID: ${notificationId}`);
    console.log(
      `Scheduled notification: "${title}" in ${delay / 1000} seconds`
    );
  } else {
    await Notifications.presentNotificationAsync(schedulingOptions);
    console.log(`Sent immediate notification: "${title}"`);
  }
}

/**
 * Pending Notification များကို ဖျက်ခြင်း (ဥပမာ - schedule လုပ်ထားတာတွေကို ဖျက်ချင်ရင်)
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All scheduled notifications cancelled.");
}
