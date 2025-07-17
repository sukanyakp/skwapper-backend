import { Server } from "socket.io";

export const setupSocket = (io : Server) =>{
    io.on("connection",(socket)=>{
          console.log("User connected:", socket.id);
        socket.on("send_message",(data)=>{
              console.log("Message received:", data);
              io.emit("receive_message",data)// broadcast to all clients
        })

        socket.on("disconnect",()=>{
             console.log("User disconnected:", socket.id);
        })
    })
}