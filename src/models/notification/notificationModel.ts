// models/notification.model.ts
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, default: "session-request" },
  },
  { timestamps: true }
);

 const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;