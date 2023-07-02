const mqtt = require('mqtt')
const fs = require('fs')
var path = require('path');
const { Command } = require('commander')
const program = new Command()
program
  .option('mqtt')
  .parse(process.argv)

const { FileSystemWallet, Gateway } = require('fabric-network');
var caFile = fs.readFileSync("Certs\\ca.crt");
var KEY = fs.readFileSync('Certs\\client.key');
var CERT = fs.readFileSync('Certs\\client.crt');
var network;
var contract;

/**
 * Conecta con HyperLedger.
 */
async function connectToIBP() {
//Preparación del entorno Fabric
  try {

    // Parse the connection profile to Blockchain
    const ccpPath = path.resolve(__dirname, 'gtw/TFG_gateway.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Configure a wallet
    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Create a new gateway, and connect to the gateway peer node(s). 
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: "main_entity", discovery: { enabled: true, asLocalhost: true } });

    // Get the network channel that the smart contract is deployed to.
    network = await gateway.getNetwork('mychannel');
    await network.getChannel().initialize({discover:true, asLocalhost:true});

    console.log("Connected to blockchain successfuly!")

    contract = network.getContract('TFGSmartContract', 'Lecturas');
    dispositivo = network.getContract('TFGSmartContract', 'Dispositivos');
    console.log("SmartContract gotten!");

  } catch (error) {
    console.error(`Failed to connect to Blockchain: ${error}`);
    process.exit(1);
  }

}

/**
 * Registra una nueva lectura en la cadena de bloques.
 * @param {string} id - El ID de la lectura
 * @param {string} data - Los datos de la lectura
 */
async function registrarLectura(id, data) {
  // Submit the transaction to the smart contract, and wait for it
  // to be committed to the ledger. 
  var d = JSON.parse(data);
  try {
    var aux = await dispositivo.submitTransaction('dispositivosExists', d.device_id);
    var res = aux.toString();
    if(res=="true"){
      await contract.submitTransaction('createLecturas', id, data);
      console.log('Transaction createLecturas has been submitted');
      console.log('Received Message:', JSON.stringify(data));
    } else {
      console.log('Se ha recibido un mensaje que no se pueden grabar.');
    }
  } catch (error) {
    console.log(`Se están recibiendo mensajes que no se pueden grabar.`);
    console.log(`${error}`);
  }
}

/**
 * Conecta con la cadena de bloques, con el broker MQTT, recibe los mensajes del Mosquitto y envía los datos a la Blockchain.
 */
async function ConnectBlockchain(){

await connectToIBP();

const host = 'localhost'
const port = '8883'
const clientId = `mqtt_broker`

// connect options
const OPTIONS = {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'intermediario',
  password: 'public',
  reconnectPeriod: 5000,
  ca:caFile,
  key: KEY,
  cert: CERT
}
// protocol list
const PROTOCOLS = ['mqtt']

// default is mqtt, unencrypted tcp connection
let connectUrl = `mqtt://${host}:${port}`

const topic = 'TFG/TFG-1'

const client = mqtt.connect(connectUrl, OPTIONS)

client.on('connect', () => {
  console.log(`${program.protocol}: Connected -> ${connectUrl}`)
  client.subscribe([topic], () => {
    console.log(`${program.protocol}: Subscribe to topic '${topic}'`)
  })
})

client.on('reconnect', (error) => {
  console.log(`Reconnecting(${program.protocol}):`, error)
})

client.on('error', (error) => {
  console.log(`Cannot connect(${program.protocol}):`, error)
})

client.on('message', (topic, payload) => {
  var d = new Date();

  var data = JSON.parse(payload);

  enviarLlamada(JSON.stringify(data));
})

}

async function enviarLlamada(data){

  var id = 0;

  let fs = require('fs');

  let archivo = fs.readFileSync('data/id.txt', 'utf-8');
  id = archivo;
  data = data.replace(/,/g, ', ');
  data = data.replace(/:/g, ': ');
  await registrarLectura(id, data);

  parseInt(id, 10);
  id++;
  fs.writeFileSync('data/id.txt', id.toString());

}

ConnectBlockchain();