import { Notification as PrismaNotification } from "@prisma/client";

export interface Notification extends PrismaNotification {
  senderId: string;
}
