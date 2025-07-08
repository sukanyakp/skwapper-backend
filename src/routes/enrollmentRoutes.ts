import express from 'express';
import { EnrollmentController } from '../controllers/implements/enrollementController';
import { EnrollmentRepository } from '../repositories/Implements/enrollmentRepository';
import { EnrollmentService } from '../services/Implements/enrollmentService';
import { PaymentService } from '../services/Implements/paymentService';
import { PaymentRepository } from '../repositories/Implements/paymentRespository';
import { verifyToken } from '../middlewares/authMiddleware'; 

const enrollmentRepositoryInstance = new EnrollmentRepository();
const enrollmentService = new EnrollmentService(enrollmentRepositoryInstance);

// Instantiate PaymentService properly with its repository
const paymentRepositoryInstance = new PaymentRepository();
const paymentService = new PaymentService(paymentRepositoryInstance);

// pass the instance correctly
const enrollmentController = new EnrollmentController(enrollmentService, paymentService);

const enrollmentRoutes = express.Router();


// enrollmentRoutes.post('/enroll', verifyToken, enrollmentController.createEnrollment);  // commenting becuase we are facing an i

export default enrollmentRoutes;
