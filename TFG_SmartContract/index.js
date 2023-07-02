/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Lecturas = require('./lib/lecturas');
const Contratotransporte = require('./lib/contratotransporte');
const Historico = require('./lib/historico');
const Dispositivos = require('./lib/dispositivos');


module.exports.Lecturas = Lecturas;
module.exports.Contratotransporte = Contratotransporte;
module.exports.Historico = Historico;
module.exports.Dispositivos = Dispositivos;

module.exports.contracts = [ Lecturas, Contratotransporte, Historico, Dispositivos, ];
