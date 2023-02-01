const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
var cors = require("cors");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://user-registration:38NSCk7v1jjUvE5t@cluster0.c8jqjnz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("registration");
    const haiku = database.collection("user");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const { email, password } = user;

      const result = await haiku.insertOne({ email, password, roles: "user" });
      //   console.log({ email, password, roles: "user" });
      res.send(result);
    });

    app.get("/userInfo", async (req, res) => {
      const query = {};
      const cursor = haiku.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;

      // console.log(email);
      const query = { email: email };
      const user = await haiku.findOne(query);
      // res.send(user);
      res.send({ isAdmin: user?.roles === "admin" });
    });
  } finally {
  }
}

run().catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("Hello Wohhgrld!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
