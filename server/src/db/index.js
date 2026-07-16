import mongoose from "mongoose";
import dns from "node:dns";
import { DB_NAME } from "../constants.js";

const LOOPBACK_DNS_SERVERS = new Set(["127.0.0.1", "::1"]);

const ensureDnsResolvers = () => {
  const currentServers = dns.getServers();
  const hasNonLoopbackServer = currentServers.some(
    (server) => !LOOPBACK_DNS_SERVERS.has(server)
  );

  if (hasNonLoopbackServer) {
    return;
  }

  const fallbackServers = (process.env.DNS_FALLBACK_SERVERS || "8.8.8.8,8.8.4.4")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  dns.setServers(fallbackServers);
  console.warn(
    `Node DNS resolver fallback applied: ${fallbackServers.join(", ")}`
  );
};

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not set.");
    }

    ensureDnsResolvers();

    const connectionUri = `${process.env.MONGODB_URL}/${DB_NAME}`;
    const dbConnection = await mongoose.connect(connectionUri);
    console.log("Mongoose Database Connected at DB Host !!:", dbConnection.connection.host);
  } catch (error) {
    console.error("Mongoose Database Connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
