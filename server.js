const express = require("express");
const prometheus = require("prom-client");
const redis = require("redis");

const app = express();
const PORT = process.env.PORT || 80;

// Configuração do Redis
let redisClient;
(async () => {
  try {
    redisClient = redis.createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@redis:6379`,
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });

    await redisClient.connect();
    console.log("Conectado ao Redis");
  } catch (err) {
    console.error("Falha na conexão com Redis:", err);
  }
})();

// Métricas do Prometheus
const collectDefaultMetrics = prometheus.collectDefaultMetrics;
collectDefaultMetrics({
  register: prometheus.register,
  timeout: 5000, // Intervalo de coleta
});

// Métricas para monitorar o Redis
const redisHealthGauge = new prometheus.Gauge({
  name: "redis_health",
  help: "Status da conexão com Redis (1 = saudável, 0 = não saudável)",
  async collect() {
    this.set(redisClient?.isReady ? 1 : 0);
  },
});

// Rota principal
app.get("/", async (req, res) => {
  return res.json({
    message: "Hello World :)",
  });
});

// Rota de métricas
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } catch (err) {
    res.status(500).end("Erro ao gerar métricas");
  }
});

// Health check
app.get("/health", (req, res) => {
  const status = {
    app: "OK",
    redis: redisClient?.isReady ? "OK" : "NOK",
  };
  res.status(status.redis === "OK" ? 200 : 503).json(status);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Encerrando...");
  await redisClient?.quit();
  process.exit(0);
});
