function getIPv4() {
	var os = require('os');
	var IPv4 = '127.0.0.1';
	var ok = false;
	for (var j = 0; !ok && j < 5; j++) {
		var en = os.networkInterfaces()['en' + j];
		if (en && en.length > 0) {
			for (var i = 0; i < en.length; i++) {
				if (en[i] && en[i].family == 'IPv4') {
					IPv4 = en[i].address;
					ok = true;
					break;
				}
			}
		}
	}
	return IPv4;
}

var address;

switch (process.env.NODE_ENV) {
	case 'development':
		address = 'http://' + getIPv4() + ':3900';
		break;
	default:
		address = '//dn-yea-img.qbox.me';
		break;
}

console.info('编译地址:' + address);

fis.config.set('roadmap.domain', address);
