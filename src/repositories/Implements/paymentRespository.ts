import { IPayment } from "../../models/student/paymentModel";
import { IPaymentRepository } from "../Interfaces/IpaymentRepository";
import { BaseRepository } from "./baseRepository";
import Payments from '../../models/student/paymentModel'
import { Iuser } from "../../models/user/userModel";
import { PipelineStage } from "mongoose";
 

export class PaymentRepository  implements IPaymentRepository {

 public async fetchPayments(page: number, limit: number): Promise<any> {
  console.log("🔍 Fetching payments from repository...");

  const skip = (page - 1) * limit;

const aggregationPipeline: PipelineStage[] = [
  { $sort: { createdAt: -1 } },
  { $skip: skip },
  { $limit: limit },
  {
    $lookup: {
      from: "users",
      localField: "studentId",
      foreignField: "_id",
      as: "student",
    },
  },
  { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "tutorprofiles",
      localField: "tutorId",
      foreignField: "_id",
      as: "tutorProfile",
    },
  },
  { $unwind: { path: "$tutorProfile", preserveNullAndEmptyArrays: true } },
];


  const payments = await Payments.aggregate(aggregationPipeline);
  const totalCount = await Payments.countDocuments();

  return { payments, totalCount };
}


}