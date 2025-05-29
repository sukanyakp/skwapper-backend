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

      res.cookie("refreshToken" , refreshToken , {
        httpOnly : true , 
        secure : process.env.NODE_ENV === 'production',
        sameSite : "strict" ,
        maxAge : 7 * 24 * 60 * 60 * 1000
        // path : "/api/"
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
}
