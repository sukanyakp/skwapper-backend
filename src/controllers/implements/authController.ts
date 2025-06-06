import { Request, Response } from "express";
import { IauthService } from "../../services/Interfaces/IauthService";


export class AuthController {
  private service: IauthService;

  constructor(service: IauthService) {
    this.service = service;
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const { accessToken, refreshToken, user } = await this.service.login(email, password);
      console.log(accessToken , 'accessTOken');
      
      console.log(refreshToken ,'refreshToken');
      

      res.cookie("refreshToken" , refreshToken , {
        httpOnly : true , 
        secure : process.env.NODE_ENV === 'production',
        sameSite : "strict" ,
        maxAge : 7 * 24 * 60 * 60 * 1000
      })

      res.status(200).json({
        message: "Login successful",
        token : accessToken,
        refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message || "Login failed" });
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


}
