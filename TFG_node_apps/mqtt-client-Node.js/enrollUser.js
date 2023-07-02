'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// Ruta del archivo de perfil de conexión
const ccpPath = path.resolve(__dirname, 'gtw/TFG_gateway.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

/**
 * Función principal que se ejecuta al iniciar el programa.
 */
async function main() {
  try {

    // Crea un nuevo cliente CA para interactuar con el CA
    const caURL = ccp.certificateAuthorities['org1ca'].url;
    console.log('caURL= ' + caURL);
    const ca = new FabricCAServices(caURL);
    console.log('ca= ' + ca);

    // Crea una nueva billetera para gestionar las identidades
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Verificar si ya se ha crado la entidad main_entity.
    const userExists = await wallet.exists('main_entity');
    if (userExists) {
      console.log('An identity for "main_entity" already exists in the wallet');
      return;
    }

    // Enroll de main_entity e import de la nueva entidad.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    await wallet.import('main_entity', identity);
    console.log('Successfully enrolled client "main_entity" and imported it into the wallet');

  } catch (error) {
    console.error(`Failed to enroll "main_entity": ${error}`);
    process.exit(1);
  }
}

main();
