import { Request, Response } from "express";
import { IauthService } from "../../services/Interfaces/IauthService";
import { Iuser } from "../../models/user/userModel";


export class AuthController {
  private service: IauthService;

  constructor(service: IauthService) {
    this.service = service;
  }


  public register = async (req: Request, res: Response): Promise<void> => {
    try {
    const user = req.body as Iuser;
    const otp = await this.service.register(user)
    
    res.status(200).json({message : "OTP send" }) 

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed", error });
    }
  };


public login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Auth service handles password verification & user fetching
    const { accessToken, refreshToken, user } = await this.service.login(email, password);
    console.log(user.isBlocked);

    //  Check if the user is blocked
    if (user.isBlocked) {
      res.status(403).json({ message: "Your account is blocked. Please contact support." });
      return;
    }

    //  Check if role matches for admin
    if (role === "admin" && user.role !== "admin") {
      res.status(401).json({ message: "Unauthorized: Admins only" });
      return;
    }

    // Allow only specific roles
    const allowedRoles = ["student", "tutor", "admin"];
    if (!allowedRoles.includes(user.role)) {
      res.status(401).json({ message: "Access denied: Unauthorized role" });
      return;
    }

    // 🍪 Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 🎉 Success
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error: any) {
    res.status(401).json({ message: error.message || "Login failed" });
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






  
  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    await this.service.forgotPassword(email);

    res.status(200).json({ message: 'Reset email sent' });

  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};


public resetPassword = async(req : Request , res : Response) : Promise<void> =>{
  try {

    console.log('here we are at the resetPassword ?');
    
    const {token} = req.params ;
    const {password} = req.body;

    console.log(token)
    console.log(password , 'password');
    
    
    if(!token || !password){
      res.status(400).json({message : "Token and password are required" })
      return
    }

    await this.service.resetPassword(token,password)

    res.status(200).json({message : "Password reset successful"})
    
  } catch (error) {
    console.log(error);
  }

}

public refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log('refresh token');
    
    const token = req.cookies.refreshToken;
    console.log('heloo refreshToken' ,token);
    

    if (!token) {
      res.status(403).json({ message: "Refresh token not found" });
      return;
    }

    const accessToken = await this.service.refreshToken(token);
    console.log(accessToken);
    

    res.status(200).json({
      message: "Access token refreshed successfully",
      data: { accessToken }
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

}
