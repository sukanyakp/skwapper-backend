import cron from "node-cron";
import ScheduledSession from "../models/notification/scheduledSessionModel";
import Wallet from "../models/student/walletModel";

const releaseTutorPayments = () => {
  cron.schedule("*/10 * * * *", async () => {
    console.log("Running cron job to release tutor payments...");

    const sessions = await ScheduledSession.find({ status: "completed" });

    for (const session of sessions) {
      const wallet = await Wallet.findOne({ userId: session.tutorId });
      console.log(session ,'session');
      console.log(wallet ,'wallet');
      
if (wallet) { 
  const tx = wallet.transactions.find(
    t =>
      t.sessionId?.toString() === String(session._id) &&
      t.status === "pending"
  );

  if (tx) {
    tx.status = "completed";
    wallet.balance += tx.amount ?? 0;
    await wallet.save();
    console.log(`Credited ₹${tx.amount} to tutor ${session.tutorId}`);
  }
}

    }
  });
};

export default releaseTutorPayments;
