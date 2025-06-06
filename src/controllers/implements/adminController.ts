import { Request, Response } from "express";
import { IAdminService } from "../../services/Interfaces/IadminService";
import { generateAccessToken } from "../../utils/jwt.util";


export class AdminController {
    private service : IAdminService ;

    constructor(service  :IAdminService){
        this.service = service
    }

    public register = async(req : Request , res : Response) : Promise <void>=>{
        try {

            console.log('admin register .. .. .. ');

           const { name, email, password } = req.body 

           if(!name || !email || !password){
            res.status(400).json({message : 'Invalid data'})
            return;
           }
      
          const result = await this.service.register(name, email,password)

          if(result){
            res.status(201).json({message: "Admin registered successfully"})
          }else{
           res.status(400).json({ message: "Admin already exists" });
          }

            
        } catch (error) {
            console.log("Admin registration failed:",error);  
            res.status(500).json({ message: "Server error" });
        }

    }


    public login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('here we are in admin login');

    const { email, password } = req.body;

    const admin = await this.service.login(email, password); // call service

    console.log('aafter this.service in login');
    

    if (!admin) {
      res.status(401).json({ message: "Invalid credentials or not an admin" });
      return;
    }

    //  generate a token
    const token = generateAccessToken({payload :admin._id});

    res.status(200).json({ 
      message: "Login successful", 
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      // token
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

}