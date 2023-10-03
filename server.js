// const express = require("express");
// const mongoose = require("mongoose");
// const bodyparser = require("body-parser");
// const cors = require("cors");

// const http = require("http");
// const { Server } = require("socket.io");

// require("dotenv").config();

// const app = express();

// //import controllers
// //const controller = require("./controllers/controllers");
// const sgrouter = require("./routes/studentGroupRoute");
// const sdrouter = require("./routes/supervisorDetailsRoute");
// const rerouter = require("./routes/requestRoute");
// const adminRouter = require('./routes/admin');
// const userRouter = require('./routes/users');
// const topicRoutes = require('./routes/topic');
// const evrouter = require("./routes/evaluation");
// const subTypeRoute = require('./routes/submitionType');
// const marks = require('./routes/marks');
// const submitions = require('./routes/submition');
// const subnotify = require('./routes/submitionNotification');
// const adminDcoumentTempRoutes = require('./routes/adminDocumentTemp');
// const chatGroupRoutes = require('./routes/chatMsg');
// const markingSchemRoutes = require('./routes/markingSchem');
// const downloadFileRoutes = require('./routes/downloadFile');
// const supportMsgRoutes = require('./routes/supportMsg');
// const noticeRoutes = require('./routes/notice');

// //app middleware

// app.use(bodyparser.json());
// app.use(cors());

// app.use(sgrouter);
// app.use(sdrouter);
// app.use(rerouter);
// app.use(adminRouter);
// app.use(userRouter);
// app.use(topicRoutes);
// app.use(subTypeRoute);
// app.use(evrouter);
// app.use(marks);
// app.use(submitions);
// app.use(subnotify);
// app.use(adminDcoumentTempRoutes);
// app.use(chatGroupRoutes);
// app.use(markingSchemRoutes);
// app.use(downloadFileRoutes);
// app.use(supportMsgRoutes);
// app.use(noticeRoutes);

// const port = process.env.PORT || 5000;
// const uri = process.env.MONGO_URI;

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connection.once("open", () => {
//   console.log("MongoDB connected");
// });

// app.listen(port, () => {
//   console.log(`server is started in port ${port}`);
// });

// // Socket.io - Server configurations and functionalities

// const server = http.createServer(app);

// server.listen(3001, () => {
//   console.log("CHAT SERVER RUNNING");
// });

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   //console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     //console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     //console.log("User Disconnected", socket.id);
//   });
// });


















const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const csrf = require("csurf"); // Include the csurf middleware
const cookieParser = require("cookie-parser"); // Include the cookie-parser middleware
const helmet = require("helmet"); // Import the helmet middleware

require("dotenv").config();

const app = express();
// Apply helmet middleware to disable X-Powered-By header
app.use(helmet());

// Import required modules
const https = require('https'); // Import the HTTPS module for creating a secure server
const fs = require('fs'); // Import the File System module for reading SSL/TLS certificates

// Middleware
app.use(bodyparser.json());
app.use(cors());

// Initialize CSRF protection
const csrfProtection = csrf({ cookie: true });

// Use cookie-parser middleware
app.use(cookieParser());

// Enable CSRF protection for all routes after initializing the CSRF middleware
app.use(csrfProtection);

// Middleware to set the CSRF token in a cookie
app.use((req, res, next) => {
  res.cookie("csrf-token", req.csrfToken());
  next();
});

// Routes


const sgrouter = require("./routes/studentGroupRoute");
const sdrouter = require("./routes/supervisorDetailsRoute");
const rerouter = require("./routes/requestRoute");
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users');
const topicRoutes = require('./routes/topic');
const evrouter = require("./routes/evaluation");
const subTypeRoute = require('./routes/submitionType');
const marks = require('./routes/marks');
const submitions = require('./routes/submition');
const subnotify = require('./routes/submitionNotification');
const adminDcoumentTempRoutes = require('./routes/adminDocumentTemp');
const chatGroupRoutes = require('./routes/chatMsg');
const markingSchemRoutes = require('./routes/markingSchem');
const downloadFileRoutes = require('./routes/downloadFile');
const supportMsgRoutes = require('./routes/supportMsg');
const noticeRoutes = require('./routes/notice');


app.use(sgrouter);
app.use(sdrouter);
app.use(rerouter);
app.use(adminRouter);
app.use(userRouter);
app.use(topicRoutes);
app.use(subTypeRoute);
app.use(evrouter);
app.use(marks);
app.use(submitions);
app.use(subnotify);
app.use(adminDcoumentTempRoutes);
app.use(chatGroupRoutes);
app.use(markingSchemRoutes);
app.use(downloadFileRoutes);
app.use(supportMsgRoutes);
app.use(noticeRoutes);



const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Obtain an SSL/TLS certificate for your domain and store the private key and certificate files in a secure location
const options = {
  key: fs.readFileSync('path/to/private-key.pem'), // Read the private key file
  cert: fs.readFileSync('path/to/certificate.pem') // Read the certificate file
};

// Create a secure HTTPS server using the Express app and SSL/TLS certificates
const server = https.createServer(options, app);

server.listen(3001, () => {
  console.log("Secure server is running on port 3001"); // Log a message when the secure server is running
});


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    //console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    //console.log("User Disconnected", socket.id);
  });
});
