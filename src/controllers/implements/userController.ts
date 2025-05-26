import { Request, Response } from "express";
import { IuserService } from "../../services/Interfaces/IuserService";
import { Iuser } from "../../models/user/User";
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
      const user = this.service.verifyOtp(email,otp)
      res.status(201).json({ message: "User verified & saved", user });
    } catch (error) {
      res.status(400).json({message : "OTP verification failed",error})
    }

  }

  public login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const { token, user } = await this.service.login(email, password);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(401).json({ message: error.message || "Login failed" });
  }
};

}
