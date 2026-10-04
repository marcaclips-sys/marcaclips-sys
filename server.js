const NodeMediaServer = require('node-media-server');
const express = require('express');

const PORT = process.env.PORT || 8000;

// Variables dinámicas para el destino
let relayConfig = {
  active: false,
  targetServer: '',
  targetKey: ''
};

const getConfig = () => {
  const tasks = [];

  // Si la retransmisión está activa, agregamos la tarea de push
  if (relayConfig.active && relayConfig.targetServer && relayConfig.targetKey) {
    tasks.push({
      app: 'live',
      mode: 'push',
      edge: `${relayConfig.targetServer}/${relayConfig.targetKey}`
    });
  }

  return {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: PORT,
      mediaroot: './media',
      allow_origin: '*'
    },
    relay: {
      tasks: tasks
    }
  };
};

let nms = new NodeMediaServer(getConfig());
nms.run();

// API Express para controlar START / STOP desde la página web
const app = nms.nhs.expressApp;
app.use(express.json());

app.post('/api/relay', (req, res) => {
  const { active, targetServer, targetKey } = req.body;

  relayConfig.active = active;
  relayConfig.targetServer = targetServer;
  relayConfig.targetKey = targetKey;

  // Reiniciar NMS con la nueva configuración de retransmisión
  nms.stop();
  nms = new NodeMediaServer(getConfig());
  nms.run();

  res.json({ success: true, active: relayConfig.active });
});
