import { Request, Response } from "express";
import { IuserService } from "../services/Interfaces/IuserService";

export class userController {

    private service  : IuserService;

    constructor(service : IuserService){
        this.service = service;
    }

    public register = async (req: Request , res: Response ) : Promise<void> => {
        try {
            console.log(req.body);
            const data = req.body
            res.status(200).json({message : 'success' ,data} )
        } catch (error) {
            console.log(error);
            
        }
    }


}