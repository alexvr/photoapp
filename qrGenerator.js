const QRCode = require('qrcode');

/**
 * Generate a qr-code
 * x
 * */

function callbackhell() {
  console.log('testeridoo - ' + generateQrCode(function (qr) {
      console.log('cb -- ' + qr);
      return qr;
    }));
}

var generateQrCode = function (callback) {
  QRCode.toDataURL('I am a pony!', function (err, url) {
    console.log('original - ' + url);
    console.log(typeof callback);
    callback(url);
  })
};

exports.generate = callbackhell;



