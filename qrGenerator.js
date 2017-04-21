const QRCode = require('qrcode');

exports.generate = function () {
  QRCode.toDataURL('Test', function (err, url) {
    console.log(url);
  })
};
