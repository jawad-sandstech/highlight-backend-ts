import firebase from '../config/firebase.config'
import prisma from '../config/database.config'

const sendNotification = async (
  userId: number,
  title: string,
  description: string
): Promise<void> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { UserPreference: true }
    })

    await prisma.userNotifications.create({
      data: {
        userId,
        title,
        description
      }
    })

    if (user?.UserPreference?.receivePushNotifications === true && user?.fcmToken !== null) {
      const message = {
        notification: {
          title,
          body: description
        },
        token: user.fcmToken
      }

      await firebase.messaging().send(message)
    }
  } catch (error) {
    console.error('Error sending notification:')
  }
}

export default sendNotification
