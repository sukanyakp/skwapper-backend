import { Request, Response } from "express";
import { IuserService } from "../../services/Interfaces/IuserService";
import { Iuser } from "../../models/user/User";
import { hashPassword } from "../../utils/bcrypt.util";
import redisClient  from  "../../config/redis"

export class UserController {
  private service: IuserService;

  constructor(service: IuserService) {
    this.service = service;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.body, "formData");

      const user = req.body as Iuser;
      console.log(user,'user');
      
    if (user.password) {
       user.password = await hashPassword(user.password);
    }

    const otp = await this.service.register(user)
    res.status(200).json({message : "OTP send " ,otp})
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed", error });
    }
  };


  public verifyOTp =async (req: Request,res:Response) =>{

    try {
      const {email,otp} = req.body
      const user = this.service.verifyOtp(email,otp)
      res.status(201).json({ message: "User verified & saved", user });
    } catch (error) {
      res.status(400).json({message : "OTP verification failed",error})
    }

  }
}
