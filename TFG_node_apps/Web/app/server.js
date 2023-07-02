//server.js
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var fs = require('fs');
var app = express();
var coords;
var querydone = false;
var lang = 'ESP';
const { FileSystemWallet, Gateway } = require('fabric-network');
var network;


// Variables globales ***

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
//app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

//Preparación del entorno Fabric
async function connectToIBP() {
    try {
  
      // Parseo del perfil de conexion a la Blockchain
      const ccpPath = path.resolve(__dirname, 'gtw/TFG_gateway.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  
      // Configuración de una wallet
      const walletPath = path.resolve(__dirname, 'wallet');
      const wallet = new FileSystemWallet(walletPath);
  
      // Creación de una nueva gateway, y conexión a los nodos peer de la puerta de enlace. 
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: "main_entity", discovery: { enabled: true, asLocalhost: true } });
  
      // Obtención del canal de la red en el que el Smart Contract ha sido desplegado.
      network = await gateway.getNetwork('mychannel');
      await network.getChannel().initialize({discover:true, asLocalhost:true});
  
      console.log("Connected to blockchain successfuly!")
  
      contratoTransporte = network.getContract('TFGSmartContract', 'Contratotransporte');
      dispositivo = network.getContract('TFGSmartContract', 'Dispositivos');
      historico = network.getContract('TFGSmartContract', 'historico');

      console.log("SmartContract gotten!");
  
    } catch (error) {
      console.error(`Failed to connect to IBM Blockchain: ${error}`);
      process.exit(1);
    }
  
  }
  
  async function ConnectBlockchain(){
  
    await connectToIBP();
    
  }

// *****************  TRANSACCIONES

// *************************************************
// ***   Nuevo Contrato
// *************************************************

async function registroContrato(req, res){
  const d = new Date();
  var fecha_fin_cto = d.getDate()  + "-" + d.getMonth() + "-" + (d.getFullYear()+1) + " " +
  d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  
  var data = {
    "tipo_activo": "contrato",
    "proveedor": req.body.proveedor,
    "comprador": req.body.comprador,
    "transportista": req.body.transportista,
    "descripcion": req.body.descripcion,
    "tMin": req.body.tMin,
    "tMax": req.body.tMax,
    "fecha_fin_cto": fecha_fin_cto,
    "vigente": "true"
  }

  data = JSON.stringify(data);
  data = data.replace(/,/g, ', ');
  data = data.replace(/:/g, ': ');

  var id = 0;

  let fs = require('fs');
  const path = require('path');

  const rutaArchivo = path.join(__dirname, '../../mqtt-client-Node.js/data/id.txt');

  let archivo = fs.readFileSync(rutaArchivo, 'utf-8');
  id = archivo;

  await contratoTransporte.submitTransaction("createContratotransporte",id, data);

  parseInt(id, 10);
  id++;
  fs.writeFileSync(rutaArchivo, id.toString());

  res.sendFile(path.join(__dirname + '/public/ok.html'));

}

app.post('/nuevocontrato',function(req,res){
  
  registroContrato(req, res);
       
});

// *************************************************
// ***   Registro de dispositivo
// *************************************************

async function registroDispositivo(req, res){

  var data = {
    "tipo_activo":"dispositivo",
    "contratoTransporteId": req.body.contratoTransporteId
  }

  var deviceId = req.body.device_id;

  data = JSON.stringify(data);

  data = data.replace(/,/g, ', ');
  data = data.replace(/:/g, ': ');

  await dispositivo.submitTransaction("createDispositivos",deviceId, data);

  res.sendFile(path.join(__dirname + '/public/ok.html'));

}

app.post('/registrardispositivo',function(req,res){
  
  registroDispositivo(req, res);
     
});

async function obtenerHistorico(res) {
  var data = await historico.submitTransaction('listByRange', "", "");
  var result = JSON.parse(data.toString());
    let sortedInput = result.slice();
    sortedInput = sortedInput.sort((a, b) => b.Key - a.Key);
    var result_last_8;
    if(result.length <= 8) {
       result_last_8 = sortedInput;
    }
    else {
       result_last_8 = sortedInput.reverse().slice(sortedInput.length - 8).reverse();
    }
    result_last_8 = JSON.stringify(result_last_8);
    res.end(result_last_8);
}

// *************************************************
// ** Histórico de transacciones
// *************************************************
app.get('/historico', function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   obtenerHistorico(res);
});

ConnectBlockchain();

http.createServer(app).listen(8080, '0.0.0.0', function() {
    console.log('Express server listening on port 8080');
});
