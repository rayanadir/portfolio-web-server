const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config({ path: "./config.env" });

const corsOptions ={
  origin:"https://rayan-dahmena.fr",
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));

const Conversation = require('./models/conversation.model');
const Message = require('./models/message.model')
const User = require('./models/user.model');
const mongoose = require('mongoose');

// get driver connection
require("./config/db");
app.use(express.json());
app.use(require("./routes/routes"));

app.get('/', (req,res) => {
  res.send("App is running")
})

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

/*
const io = require('socket.io')(server, {
  cors:{
    origin: "https://rayan-dahmena.fr",
  }
})

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  User.findOne({userId}).lean().exec(async (err,user) => {
    if(err){
      return null;
    }else if(user){
      if(user.isAdmin===true){
        // get all conversations
        Conversation.find({}).sort({ updatedAt: -1 }).lean().exec(async (err, doc) => {
          if (err) {
            socket.emit('getConversations', [])
          } else if (doc) {
            const conversations = doc.map(async (conversation) => {
              const users_arr = await User.find({userId: conversation.users})
              conversation.users_arr= users_arr;
              return conversation;
            })
            Promise.all(conversations).then((values) => {
              socket.emit("getConversations", values)
            })
          } 
        })

      }else if (user.isAdmin === false) {
        // get single conversation 
          try{
            Conversation.findOne({users:userId}).lean().exec( async(err,doc) => {
              if(err){
                socket.emit('getSingleConversation',{code_msg:"error"})
              }
              else if(!doc){
                socket.emit('getSingleConversation', {code_msg:"no_conversation_started"})
              }
              else if(doc){
                const users_arr = await User.find({userId: doc.users})
                doc.users_arr= users_arr
                socket.emit('getSingleConversation', doc)
              }
            })
          }catch(err){
            socket.emit('getSingleConversation',{code_msg:"error"})
          }
      }
    }
  });

  // get all messages from a conversation
  const conversationId = socket.handshake.query.conversationId
  if(conversationId && conversationId!==null && conversationId!== undefined){
    Conversation.findOne({id:conversationId}).lean().exec(async (err,doc) => {
      if(err){
        socket.emit('getMessages' , [])
      }else if (doc) {
        socket.emit('getMessages' , doc.messages)
      }
    })
  }

  // send a conversation message
  socket.on('newMessage', async (data) => {
    try {
      const conversationId =socket.handshake.query.conversationId;   
      Conversation.findOne({id: conversationId}).lean().exec(async (err, conv) => {
        if(err){
          socket.emit('getSingleConversation',{code_msg:"error"})
        }
        if(!conv){
          const adminUser = await User.findOne({ email: String(process.env.USER) });
          const messageId=new mongoose.Types.ObjectId().toHexString();
          const newMessage =[{message:data.message, userId:data.userId,id: messageId ,date: data.date}];
          const users_arr = await User.find({userId: [adminUser.userId, data.userId]});
          const conversation = new Conversation({
            id: conversationId,
            users:[data.userId,adminUser.userId],
            messages: newMessage
          });
          await conversation.save()
          const updatedConversation = {...conversation.toObject(), users_arr}
          io.emit('newMessage', { message: data.message, userId: data.userId ,date: data.date,id: messageId });
          io.emit('updateConversation', updatedConversation);
          io.emit('getSingleConversation', updatedConversation);
        }
        if(conv){
          const messageId = new mongoose.Types.ObjectId().toHexString()
          const messageObj = { message: data.message, userId: data.userId,date: data.date,id: messageId  }
          const users_arr = await User.find({userId: conv.users});
          const conversation = await Conversation.findOneAndUpdate({id: conversationId},
            {
              $push: {messages: messageObj},
            },
            {
              new:true 
            }); 
            const updatedConversation = {...conversation.toObject(), users_arr} 
            io.emit('newMessage', { message: data.message, userId: data.userId, date: data.date, id: messageId });
            io.emit('updateConversation', updatedConversation);
            io.emit('getSingleConversation', updatedConversation);
            
        }
      })
    } catch (error) {
      console.log(error)
    }
  })

  // get all simple messages
  Message.find().sort({date: -1}).lean().exec(async (err,doc) => {
    if(err){
      socket.emit('getSimpleMessages', [])
    }else if (doc){
      socket.emit('getSimpleMessages', doc)
    }
  })

  socket.on("disconnect",()=>{
    //console.log("disconnection");
  });
})
*/