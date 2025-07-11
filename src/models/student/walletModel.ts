import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 }, // Amount available
  transactions: [
    {
      amount: Number,
      type: { type: String, enum: ["credit", "debit"] },
      reference: String,
      status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "SessionRequest" },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Wallet", walletSchema);
