/**
 * @fileoverview SmartContract Histórico de Lecturas
 *
 * @version             1.0
 * @author              Alejandro de los Ríos Sánchez
 *
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const contratotransporte = require('./contratotransporte.js');
const dispositivos = require('./dispositivos.js');

// Se crea una instancia de la clase contratotransporte
var cto = new contratotransporte();
// Se crea una instancia de la clase dispositivos
var device = new dispositivos();

/**
 * Clase Lecturas que implementa un contrato inteligente en la plataforma blockchain.
 */
class Lecturas extends Contract {

    /**
     * Verifica si una lectura existe en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} lecturasId - El ID de la lectura
     * @returns {boolean} - Devuelve true si la lectura existe, de lo contrario, false.
     */
    async lecturasExists(ctx, lecturasId) {
        const buffer = await ctx.stub.getState(lecturasId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     * Crea una nueva lectura en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} lecturasId - El ID de la lectura
     * @param {string} data - Los datos de la lectura
     * @returns {number} - Devuelve 1 si la lectura se creó correctamente, de lo contrario, 0.
     */
    async createLecturas(ctx, lecturasId, data) {
        const exists = await this.lecturasExists(ctx, lecturasId);
        if (exists) {
            throw new Error(`Id: ${lecturasId} ya existe!`);
        }
        const asset = JSON.stringify({ data });
        const info = JSON.parse(data);

        if(info.tipo_activo != "lectura"){
            throw new Error(`Id: ${lecturasId} no es tipo lectura!`);
        }
        
        const aux = await device.readDispositivos(ctx, info.device_id);
        const disp = JSON.parse(aux.data);
        
        if (disp.tipo_activo != "dispositivo"){
            throw new Error(`Id_device: ${info.device_id} no es un dispositivo!`);
        }

        const aux2 = await cto.readContratotransporte(ctx, disp.contratoTransporteId);
        const contrato = JSON.parse(aux2.data);

        if (contrato.tipo_activo != "contrato"){
            throw new Error(`Contrato Id: ${disp.contratoTransporteId} no es un contrato!`);
        }

        if (contrato.vigente == "false"){
            throw new Error(`Contrato Id: ${disp.contratoTransporteId} no vigente!`);
        }

        const temp = info.valorLectura;

        if (temp > contrato.tMax || temp < contrato.tMin || info.tampering == 1){

            const buffer = Buffer.from(asset);
            await ctx.stub.putState(lecturasId, buffer);

            return 1;
        }

        return 0;
    }

    /**
     * Lee los datos de una lectura de la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} lecturaId - El ID de la lectura
     * @returns {Object} - Devuelve los datos de la lectura.
     */
    async readLecturas(ctx, lecturaId) {
        const exists = await this.lecturasExists(ctx, lecturaId);
        if (!exists) {
            throw new Error(`La lectura ${lecturaId} no existe!`);
        }
        const buffer = await ctx.stub.getState(lecturaId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    /**
     * Actualiza el valor de una lectura en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} lecturasId - El ID de la lectura
     * @param {string} newValue - El nuevo valor de la lectura
     */
    async updateLecturas(ctx, lecturasId, newValue) {
        const exists = await this.lecturasExists(ctx, lecturasId);
        if (!exists) {
            throw new Error(`The lecturas ${lecturasId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(lecturasId, buffer);
    }

    /**
     * Elimina una lectura de la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} lecturasId - El ID de la lectura
     */
    async deleteLecturas(ctx, lecturasId) {
        const exists = await this.lecturasExists(ctx, lecturasId);
        if (!exists) {
            throw new Error(`The lecturas ${lecturasId} does not exist`);
        }
        await ctx.stub.deleteState(lecturasId);
    }
 
}

module.exports = Lecturas;
