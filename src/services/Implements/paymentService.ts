import Stripe from "stripe";
import { IPaymentRepository } from "../../repositories/Interfaces/IpaymentRepository";
import { IPaymentService } from "../Interfaces/IpaymentService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", 
});

export class PaymentService implements IPaymentService {
  private repository: IPaymentRepository;

  constructor(repository: IPaymentRepository) {
    this.repository = repository;
  }

  public async initiateOrder(amount: number): Promise<any> {
    // your Razorpay logic or other order initiation
  }

  public async getPayments(page: number, limit: number): Promise<any> {
    const { payments, totalCount } = await this.repository.fetchPayments(page, limit);
    const totalPages = Math.ceil(totalCount / limit);
    return { payments, totalPages };
  }

  public async createCourseCheckoutSession(studentId: string, course: any): Promise<any> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
              description: course.description,
              images: [course.thumbnail],
            },
            unit_amount: course.price * 100, // convert to paise
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/user/my-courses?success=true`,
      cancel_url: `http://localhost:5173/courses/${course._id}?cancelled=true`,
      metadata: {
        studentId,
        courseId: course._id,
        price: course.price.toString(),
      },
    });

    return session;
  }


  
}
