const NodeMediaServer = require('node-media-server');

// Render asigna un puerto dinámico mediante la variable de entorno PORT
const PORT = process.env.PORT || 8000;

const config = {
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
  }
};

const nms = new NodeMediaServer(config);
nms.run();
