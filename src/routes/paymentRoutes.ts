import express from "express";
import { PaymentController } from "../controllers/implements/paymentController";
import { PaymentRepository } from "../repositories/Implements/paymentRespository";
import { PaymentService } from "../services/Implements/paymentService";
import { verifyToken } from "../middlewares/authMiddleware";

const paymentRepositoryInstance = new PaymentRepository()
const paymentService = new PaymentService(paymentRepositoryInstance);
const paymentController = new PaymentController(paymentService)


const paymentRoutes = express.Router()

paymentRoutes.post('/create-order',verifyToken, paymentController.stripePayment ) 
paymentRoutes.get('/',verifyToken, paymentController.getPayments)


export default paymentRoutes;