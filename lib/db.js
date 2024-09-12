import { connection, connect } from "mongoose";

const dbConnect = async () => {
  if (connection.readyState >= 1) return;

  await connect(
    "mongodb+srv://projectyjka:53yjka21@asciicluster0.pgohfwc.mongodb.net/muzify",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};

export default dbConnect;
