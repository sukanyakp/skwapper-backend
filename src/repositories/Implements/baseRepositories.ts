import { Document, Model } from "mongoose";
import { IbaseRepositories } from "../Interfaces/IbaseRepositories";

export class BaseRepository <T extends Document> implements IbaseRepositories <T>{
    constructor(protected readonly model : Model<T>){
        
    }

}