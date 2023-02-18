const app = require('express')();
const cors = require('cors');


const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:4200",
  }
});

const documents = {};

io.on('connection', (socket) => {
  console.log("a user connected");
  let previousId;

  const safeJoin = currentId => {
    socket.leave(previousId);
    socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
    previousId = currentId;
  }

  socket.on('getDoc', (docId) => {
    safeJoin(docId);
    socket.emit('doc', documents[docId]);
  });

  socket.on('addDoc', (doc) => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit('documents', Object.keys(documents));
    socket.emit("document", doc);
  });

  socket.on("editDoc", (doc) => {
    documents[doc.id] = doc;
    console.log("passed: " + doc.id);
    socket.to(doc.id).emit("document", doc);
  });

  io.emit('documents', Object.keys(documents));

  console.log(`Socket ${socket.id} connected`);
});

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/', (req, res) => {
  console.log("hello");
});

http.listen(3000, () => {
  console.log("Listening on port 3000");
});