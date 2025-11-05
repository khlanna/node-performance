const express = require("express");
const cluster = require("cluster");
cluster.schedulingPolicy = cluster.SCHED_RR;
const os = require("os");

const app = express();

function delay(duration) {
  const startTime = Date.now();
  while (Date.now() - startTime < duration) {
    // wait
  }
}

app.get("/", (req, res) => {
  res.send(`performance example ${process.pid}`);
});

app.get("/delay", (req, res) => {
  delay(900);
  res.send(`ding ding ding ${process.pid}`);
});

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started`);
  app.listen(3000, () => {
    console.log(`Server is running on port ${3000}`);
  });
}
