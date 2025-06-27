import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "100000s",
  });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};


export const generateResetToken = (payload: object): string => {
  console.log(payload , 'at generateResetToken');
  
  return jwt.sign(payload, process.env.RESET_PASSWORD_SECRET as string, {
    expiresIn: "15m", // or longer
  });
};


export const verifyAccessToken = (token : string) =>{
  console.log(token , 'at verifyAccessToken');

  try {
    
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
  } catch (error) {
    console.error(error)
    return null
  }
  
}