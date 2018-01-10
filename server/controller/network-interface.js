const os = require('os');
const _ = require('lodash');

const getIpAddress = (req, res) => {
  let interfaces = os.networkInterfaces();

  for (let iface in interfaces) {
    for (let i = 0; i < interfaces[iface].length; i++) {
      let obj = interfaces[iface][i];
      if (obj.family === 'IPv4' && !obj.internal) {
        return res.json(obj.address);
      }
    }
  }

  return res.sendStatus(500);
  // let { eth0 } = info;
  // console.log(info, eth0);
  // if (eth0) {
  //   let ipv4 = eth0.filter(e => e.family === 'IPv4')[0];
  //   if (ipv4) return res.json(ipv4.address);
  // }
  // return res.sendStatus(500);
};

module.exports = { getIpAddress };