import { BaseRepository } from "./baseRepository";
import { IAdminRepository } from "../Interfaces/IadminRepository";
import User, { Iuser } from "../../models/user/userModel";
import TutorApplicationModel, { ITutorApplication } from "../../models/tutor/tutorApplicationModel";
import type {Role} from "../../types/role.types"
import { PipelineStage } from "mongoose";

export class AdminRepository extends BaseRepository<Iuser> implements IAdminRepository {
  constructor() {
    super(User);
  }

  async tutorBlockStatus(userId: string, block: boolean): Promise<ITutorApplication  | null> { //ITutorApplication
    console.log('at userRepository');
  const user = await User.findByIdAndUpdate(
  userId,
  { isApproved: !block },
  { new: true }
);
console.log(user, 'user at repository');

const tutorApp = await TutorApplicationModel.findOneAndUpdate(
  { user: userId },
  { isBlocked: block },
  { new: true }
);
console.log(tutorApp, 'tutorApp');

return tutorApp;

  }

  async userBlockStatus(userId: string, block: boolean): Promise<Iuser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { isBlocked: block },
      { new: true }
    );
  }

  async getAllUsers(): Promise<Iuser[]> {
    return await User.find({}, "-password");
  }

  async fetchTutorApplications (page: number, limit: number ,search : string) : Promise<any> {
  const skip = (page - 1) * limit;
  // Create a case-insensitive regex from the search string
  const searchRegex = new RegExp(search, "i");

 const pipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userData",
    },
  },
  { $unwind: "$userData" },
  {
    $match: {
      $or: [
        { "userData.name": { $regex: searchRegex } },
        { "userData.email": { $regex: searchRegex } },
      ],
    },
  },
  {
    $project: {
      status: 1,
      isBlocked: 1,
      user: "$userData._id",
      name: "$userData.name",
      email: "$userData.email",
    },
  },
  { $skip: skip },
  { $limit: limit },
];
  

  const applications = await TutorApplicationModel.aggregate(pipeline);

  const countPipeline = [
    {
      $lookup : {
        from : 'users',
        localField : 'user',
        foreignField : '_id',
        as : 'userData'
      }
    },
    {$unwind : '$userData'},
    {
      $match : {
        $or : [
          {'userData.name' : {$regex : searchRegex }},
          { 'userData.email' : {$regex : searchRegex}}
        ]
      }
    },
    {
      $count : 'total'
    }
  ]




  const countResult = await TutorApplicationModel.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;



  return {
    applications,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

  async getTutorApplicationById(applicationId: string): Promise<any | null> {
    return await TutorApplicationModel.findById(applicationId).populate("user", "name email");
  }

  async updateTutorApplicationStatus(
    applicationId: string,
    action: "approved" | "rejected",
    role: Role
  ): Promise<any> {
    const application = await TutorApplicationModel.findById(applicationId);
    if (!application) return null;

    const userId = application.user;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    user.role = role;
    await user.save();

    application.status = action;
    await application.save();

    await User.findByIdAndUpdate(userId, {
      status: action,
      isApproved: action === "approved"
    });

    return application;
  }


   public async getUsersPaginated(skip: number, limit: number ,search:string): Promise<Iuser[]> {

    const searchRegex = new RegExp(search,'i');

    const pipeline : PipelineStage[] =[
      {
        $match : {
          role : 'student',
          $or : [
            {name : {$regex : searchRegex}},
            {email : {$regex : searchRegex}},

          ]
        }
      },
      {
        $skip : skip
      },
      {
        $limit : limit
      }
    ]
    console.log('heelooo getstudents',search);
    
    return await User.aggregate(pipeline)
   
  }

  public async getUserCount(): Promise<number> {
    return await User.countDocuments({role: 'student'});
  }
}
