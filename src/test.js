const bitcore = require('bitcore-lib');
const Insight = require('bitcore-explorers').Insight;

const insight = new Insight('testnet');



// console.log(bitcore.PrivateKey('testnet').toWIF());
const privatekeyWIF = 'cNGXspwZFDRZ4MMo9LJ39G3sACQbAN7787D8RdGRfxr3z5prbssB';

// Private Key
const privatekey = bitcore.PrivateKey.fromWIF(privatekeyWIF);

// BTC Address console.log(privatekey.toAddress());
const address = 'msXaK7FWa6ABcbs2Q213JuaNCf4b4Lfsq1';
const toAddress = 'mkMBPNVkkXrwAQ5nj1VSE4tYwAd8FHxA3R';


insight.getUnspentUtxos(address, function(error, utxos) {

	if(error) {

		console.log(error);
	
	} else {

		const tx = bitcore.Transaction();

		tx.from(utxos);
		tx.to(toAddress, 1000);
		tx.change(address);
		tx.sign(privatekey);

		console.log(tx.toObject());
		tx.serialize();


		insight.broadcast(tx, function(error, txid) {

			if(error) {

				console.log(error);

			} else {

				console.log('Broadcast: ', txid);
			}
		});
	}

});
