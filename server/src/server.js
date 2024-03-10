import express from "express";
import { ApolloServer } from "@apollo/server";
import { Server } from "socket.io";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { typeDefs } from "./app/schema.js";
import { resolvers } from "./app/resolvers/index.js";
import { context } from "./app/context.js";

// const ioServer = http.createServer();
// const io = new Server(ioServer);
// io.listen(5000);

// io.on("connection", (socket) => {
//   // get id from client
//   const id = socket.handshake.query.id;
//   // join the paticular room
//   socket.join(id);

//   socket.on("send-message", ({ recipients, text }) => {
//     recipients.forEach((recipient) => {
//       const newRecipients = recipients.filter((r) => r !== recipient);
//       newRecipients.push(id);
//       socket.broadcast.to(recipient).emit("receive-message", {
//         recipients: newRecipients,
//         sender: id,
//         text,
//       });
//     });
//   });
// });

const app = express();

// 配置 GraphQL
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer, enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// 設置了一個監聽器，當有新的連接建立時，將調用此回調函數。socket 參數代表連接的客戶端。
io.on("connection", (socket) => {
  console.log("io開始");
  // 客戶端在建立連接時會傳遞一個 id，代表用戶或會話的唯一標識
  const id = socket.handshake.query.id;
  // 使得連接的 socket 加入一個特定的房間，房間名稱為該 id。在 Socket.IO 中，房間用於分組通信。
  socket.join(id);

  // 當伺服器接收到來自客戶端的 "send-message" 事件
  socket.on("send-message", ({ recipients, text }) => {
    console.log("recipients", recipients);
    console.log("text", text);
    // 對每個接收者重新構建接收者列表並發送消息
    // 從接收者列表中移除當前接收者，然後將發送者（id）加入到新的接收者列表中。
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      console.log("newRecipients", newRecipients);
      // 向指定的接收者（在其對應的房間內）廣播消息
      // 發送包含更新後的接收者列表、發送者身份和消息文本的事件。
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});

const handleServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/graphql",
    cors({
      origin: ["http://localhost:3000"],
    }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async () => ({
        db: context.db,
        prisma: context.prisma,
      }),
    })
  );
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  return server;
};

handleServer(app);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
