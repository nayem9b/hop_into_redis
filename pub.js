const express = require("express");
const redis = require("redis");
const app = express();

let publisher = redis.createClient({
  url: "redis://localhost:6379",
});

publisher.on("error", (err) => console.log("Redis error"));
publisher.on("connect", (conn) => console.log("Redis connected"));

const connect = async () => {
  await publisher.connect();
};

app.get("/", (req, res) => {
  res.send({
    message: "publisher active on port 3001",
  });
});

app.get("/publish", async (req, res) => {
  const id = Math.floor(Math.random() * 10);
  const data = {
    id,
    message: `message ${id}`,
  };

  await publisher.publish("message", JSON.stringify(data));
  res.send({
    message: "data published",
  });
});

connect();

app.listen(3001, () => {
  console.log("Publisher server started on 3001");
});
