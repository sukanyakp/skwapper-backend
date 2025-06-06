import { Request, Response } from "express";
import { IuserService } from "../../services/Interfaces/IuserService";
import { Iuser } from "../../models/user/userModel";
import { hashPassword } from "../../utils/bcrypt.util";

export class UserController {
  private service: IuserService;

  constructor(service: IuserService) {
    this.service = service;
  }

 
  public register = async (req: Request, res: Response): Promise<void> => {
    try {

      const user = req.body as Iuser;
      console.log(user,'user');
      
    if (user.password) {
       user.password = await hashPassword(user.password);
    }

    const otp = await this.service.register(user)
    console.log(otp ,'otp created');
    
    res.status(200).json({message : "OTP send" }) //otp
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed", error });
    }
  };


  public verifyOTp = async (req: Request,res:Response) =>{
    
    try {
      
      const {email,otp} = req.body 
      const user = await this.service.verifyOtp(email,otp)
      console.log(user , 'verified user');
      
      res.status(201).json({ message: "User verified & saved", user });
    } catch (error) {
      res.status(400).json({message : "OTP verification failed",error})
    }

  }

 public resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    console.log(email, 'email .. . ');

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    await this.service.resendOtp(email);

    console.log('Resent OTP');
    res.status(200).json({ message: "OTP resent successfully" });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Failed to resend OTP", error });
  }
};


}
