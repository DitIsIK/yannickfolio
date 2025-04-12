// server.js
const os = require("os");
const fastify = require("fastify");
const dotenv = require("dotenv");
const useragent = require("express-useragent"); // using for parsing user agent string

dotenv.config();

// Initialize Fastify instance with logger disabled and body size limit increased
const app = fastify({ logger: false, bodyLimit: 50 * 1024 * 1024 }); // 50mb JSON limit

// Register Fastify plugins for CORS, cookies, and form data parsing
app.register(require("@fastify/cors"), {
  origin: [
    "https://kartavya-portfolio-mern-frontend.onrender.com",
    "https://kartavya-singh.com",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:9200",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
app.register(require("@fastify/cookie"), {
  cookie: {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "none",
    // maxAge: 60 * 60, // optional default maxAge in seconds
    // expires: new Date(Date.now() + 60 * 60 * 1000), // optional default expiry
  },
});

app.register(require("@fastify/formbody")); // parse URL-encoded form bodies

// Connect to MongoDB
const { connectDB, getDBMetrics, resetDBMetrics } = require("./config/mongodb");
connectDB();

// Global metrics accumulators for logging (reset every hour)
let totalApiCalls = 0;
let uniqueIPs = new Set();
let memorySumRSS = 0;
let memorySumHeapUsed = 0;
let memorySumHeapTotal = 0;
let memorySampleCount = 0;
let routeStats = {}; // per-route stats
// CPU usage baseline (for measuring CPU usage per interval)
let prevCpuUsage = process.cpuUsage();

// Hooks to gather metrics for each request/response
app.addHook("onRequest", (request, reply, done) => {
  // Mark start time for latency measurement
  request.startTime = process.hrtime.bigint();
  done();
});
app.addHook("onResponse", (request, reply, done) => {
  // Calculate request latency
  const diff = process.hrtime.bigint() - request.startTime;
  const latencyMs = Number(diff) / 1e6;
  // Increment global API call count
  totalApiCalls++;
  // Track unique IP addresses
  uniqueIPs.add(request.ip);
  // Parse user agent for device and browser info
  const ua = useragent.parse(request.headers["user-agent"] || "");
  const deviceType = ua.platform || "Unknown";
  const browser = ua.browser || request.headers["user-agent"] || "Unknown";
  // Determine route (pattern) or URL
  const route = request.routerPath || request.raw.url;
  // Initialize route stats if not present
  if (!routeStats[route]) {
    routeStats[route] = {
      count: 0,
      methods: new Set(),
      statusCodes: new Set(),
      ips: new Set(),
      devices: new Set(),
      browsers: new Set(),
      totalLatency: 0,
    };
  }
  const stats = routeStats[route];
  stats.count++;
  stats.methods.add(request.method);
  stats.statusCodes.add(reply.statusCode);
  stats.ips.add(request.ip);
  stats.devices.add(deviceType);
  stats.browsers.add(browser);
  stats.totalLatency += latencyMs;
  // Collect memory usage sample
  const memUsage = process.memoryUsage();
  memorySumRSS += memUsage.rss;
  memorySumHeapUsed += memUsage.heapUsed;
  memorySumHeapTotal += memUsage.heapTotal;
  memorySampleCount++;
  done();
});

// Register routes (with prefix /api)
const dataRoutes = require("./routes/dataRoutes");
app.register(dataRoutes, { prefix: "/api" });

// Register the new AI routes for creating the index
const aiRoutes = require("./routes/aiRoutes");
app.register(aiRoutes, { prefix: "/api/ai" });

// Import the main function from aiChatBotManager
// const { main: initializeIndex } = require("./controllers/aiChatBotManager");

// Call initializeIndex() when the backend starts
// initializeIndex();

// Base routes
app.get("/", (request, reply) => {
  reply.send("Welcome to Kartavya's MERN Portfolio Backend");
});
app.get("/api", (request, reply) => {
  reply.send(
    "This is the API track for Kartavya's MERN Portfolio Backend. Explore the various endpoints to interact with the data and services provided."
  );
});

// Global error handler
app.setErrorHandler((error, request, reply) => {
  console.error(error.stack);
  reply.code(500).send({ error: "Internal Server Error" });
});

// Advanced hourly logging system
setInterval(async () => {
  try {
    // Compute average memory usage (RSS and heap) in percent
    const avgRSS = memorySampleCount ? memorySumRSS / memorySampleCount : 0;
    const avgHeapUsed = memorySampleCount
      ? memorySumHeapUsed / memorySampleCount
      : 0;
    const avgHeapTotal = memorySampleCount
      ? memorySumHeapTotal / memorySampleCount
      : 0;
    const rssPercent = os.totalmem()
      ? ((avgRSS / os.totalmem()) * 100).toFixed(2)
      : "0.00";
    const heapPercent = avgHeapTotal
      ? ((avgHeapUsed / avgHeapTotal) * 100).toFixed(2)
      : "0.00";
    // Calculate CPU usage percentage over the last hour
    const currentCpuUsage = process.cpuUsage();
    const userCpuDiff = currentCpuUsage.user - prevCpuUsage.user;
    const sysCpuDiff = currentCpuUsage.system - prevCpuUsage.system;
    const cpuTimeUsedSec = (userCpuDiff + sysCpuDiff) / 1e6;
    const cpuPercent = ((cpuTimeUsedSec / 3600) * 100).toFixed(2); // % of one CPU over an hour
    prevCpuUsage = currentCpuUsage;
    // Total active handles at this moment
    const activeHandles = process._getActiveHandles().length;
    // Server uptime (seconds)
    const serverUptimeSec = process.uptime().toFixed(0);
    // Database metrics
    const dbMetrics = getDBMetrics();
    let currentConnections = "N/A";
    let dbUptimeSec = "N/A";
    let storageStats = "N/A";
    // Attempt to retrieve DB server metrics if permissions allow
    try {
      const db = require("./config/mongodb").getDB();
      const admin = db.admin();
      const serverStatus = await admin.serverStatus();
      currentConnections = serverStatus.connections?.current ?? "N/A";
      dbUptimeSec = serverStatus.uptime ?? "N/A";
      // Storage stats (available vs total)
      const dbStats = await db.stats();
      const storageBytes = dbStats.storageSize || 0;
      const dataBytes = dbStats.dataSize || 0;
      const storageMB = Math.round(storageBytes / (1024 * 1024));
      const dataMB = Math.round(dataBytes / (1024 * 1024));
      const availableMB = storageMB - dataMB;
      storageStats = `${availableMB} MB / ${storageMB} MB`;
    } catch (err) {
      // Could not retrieve serverStatus (likely due to permissions)
      // We still have db operation counts from application
    }
    // Determine most queried collection in the past hour
    let mostQueriedCollection = null;
    let maxOps = 0;
    for (const [coll, ops] of Object.entries(dbMetrics.dbOpsByCollection)) {
      if (ops > maxOps) {
        maxOps = ops;
        mostQueriedCollection = coll;
      }
    }
    // Log aggregated metrics
    console.log("----- Hourly Backend Metrics -----");
    console.log(
      `Total API Calls: ${totalApiCalls} | Avg Memory Usage: RSS ${rssPercent}% , Heap ${heapPercent}% | Avg CPU Usage: ${cpuPercent}% | Active Handles: ${activeHandles} | Server Uptime: ${serverUptimeSec}s`
    );
    console.log("----- Hourly Database Metrics -----");
    console.log(
      `Avg Connections: ${currentConnections} | Total DB Requests: ${dbMetrics.dbOpsCount} | DB Uptime: ${dbUptimeSec}s | Storage (Available/Total): ${storageStats}` +
        (mostQueriedCollection
          ? ` | Most Queried Collection: ${mostQueriedCollection} (${maxOps} ops)`
          : "")
    );
    console.log("----- Detailed API Usage (Last Hour) -----");
    if (Object.keys(routeStats).length === 0) {
      console.log("No API calls in the last hour.");
    } else {
      // Print table header
      console.log(
        "Endpoint".padEnd(30) +
          "Calls".padEnd(7) +
          "Method(s)".padEnd(12) +
          "StatusCodes".padEnd(15) +
          "UniqueIPs".padEnd(10) +
          "DeviceTypes".padEnd(20) +
          "Browsers".padEnd(20) +
          "AvgLatency"
      );
      // Print each endpoint's stats
      for (const [endpoint, stat] of Object.entries(routeStats)) {
        const methods = Array.from(stat.methods).join(",");
        const statuses = Array.from(stat.statusCodes).join(",");
        const uniqueIpCount = stat.ips.size;
        const devices = Array.from(stat.devices).join(",");
        const browsers = Array.from(stat.browsers).join(",");
        const avgLatency = stat.count
          ? (stat.totalLatency / stat.count).toFixed(2) + " ms"
          : "-";
        console.log(
          endpoint.padEnd(30) +
            String(stat.count).padEnd(7) +
            methods.padEnd(12) +
            statuses.padEnd(15) +
            String(uniqueIpCount).padEnd(10) +
            devices.padEnd(20) +
            browsers.padEnd(20) +
            avgLatency
        );
      }
    }
  } catch (err) {
    console.error("Error during hourly logging:", err);
  } finally {
    // Reset all metrics for the next hour
    totalApiCalls = 0;
    uniqueIPs.clear();
    memorySumRSS = 0;
    memorySumHeapUsed = 0;
    memorySumHeapTotal = 0;
    memorySampleCount = 0;
    routeStats = {};
    resetDBMetrics();
  }
}, 3600 * 1000); // 1 hour interval (3600000 ms)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
  // // Log more server details in a single line every 5 seconds
  // // setInterval(() => {
  // //   const memUsage = process.memoryUsage(); // multiple memory usage stats
  // //   const usedRSSMB = Math.round(memUsage.rss / 1024 / 1024);
  // //   const usedHeapMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  // //   const totalHeapMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  // //   const loadAvg1Min = os.loadavg()[0].toFixed(20); // 1-minute load average
  // //   const uptimeSecs = process.uptime().toFixed(0);
  // //   console.log(
  // //     `Memory: RSS=${usedRSSMB}MB HeapUsed=${usedHeapMB}MB/${totalHeapMB}MB | CPU Load(1m)=${loadAvg1Min} | Uptime=${uptimeSecs}s`
  // //   );
  // // }, 5000);
});
