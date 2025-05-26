import nodemailer from 'nodemailer'

export const sendOtpEmail = async (toEmail:string,otp:string) =>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
             user: process.env.EMAIL_USER, 
             pass: process.env.EMAIL_PASS, 
        }
    })

      const mailOptions = {
    from: `"Skwapper" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP Code",
    html: `<p>Your OTP is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions)
}