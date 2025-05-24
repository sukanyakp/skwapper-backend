export function generateOTP(length = 6):string {
    return Math.floor(10000 + Math.random()*99999).toString().slice(0,length)
}