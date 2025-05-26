import bcrypt from 'bcrypt';

export const hashPassword = async (password : string) : Promise <string> =>{

    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)

}


export async function comparePassword(password : string , hashedPassword : string) : Promise <boolean>{  // login
    return bcrypt.compare(password,hashedPassword)
}