/**
 * @fileoverview SmartContract Dispositivos
 *
 * @version             1.0
 * @author              Alejandro de los Ríos Sánchez
 *
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const contratotransporte = require('./contratotransporte.js');

// Se crea una instancia de la clase contratotransporte
var cto = new contratotransporte();

/**
 * Clase Dispositivos que implementa un contrato inteligente en la plataforma blockchain.
 */
class Dispositivos extends Contract {

    /**
     * Verifica si un dispositivo existe en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} dispositivosId - El ID del dispositivo
     * @returns {boolean} - Devuelve verdadero si el dispositivo existe, falso en caso contrario.
     */
    async dispositivosExists(ctx, dispositivosId) {
        const buffer = await ctx.stub.getState(dispositivosId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     * Crea un nuevo dispositivo en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} dispositivosId - El ID del dispositivo
     * @param {string} data - Los datos del dispositivo en formato JSON
     * @returns {number} - Devuelve 1 si se crea el dispositivo correctamente.
     * @throws {Error} - Si el ID del dispositivo ya existe, si el tipo de activo no es un dispositivo,
     * si el contrato de transporte asociado no es válido o si el contrato no está vigente.
     */
    async createDispositivos(ctx, dispositivosId, data) {
        const exists = await this.dispositivosExists(ctx, dispositivosId);
        if (exists) {
            throw new Error(`Id: ${dispositivosId} ya existe!`);
        }
        const asset = JSON.stringify({ data });
        const info = JSON.parse(data);
        
        if(info.tipo_activo != "dispositivo"){
            throw new Error(`Id: ${dispositivosId} no es tipo dispositivo!`);
        }

        const aux2 = await cto.readContratotransporte(ctx, info.contratoTransporteId);
        const contrato = JSON.parse(aux2.data);

        if (contrato.tipo_activo != "contrato"){
            throw new Error(`Id: ${info.contratoTransporteId} no es un contrato!`);
        }

        if (contrato.vigente == "false"){
            throw new Error(`Contrato Id: ${info.contratoTransporteId} no vigente!`);
        }

        const buffer = Buffer.from(asset);
        await ctx.stub.putState(dispositivosId, buffer);
        return 1;
    }

    /**
     * Lee un dispositivo de la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} dispositivosId - El ID del dispositivo
     * @returns {object} - Devuelve los datos del dispositivo en formato JSON.
     * @throws {Error} - Si el dispositivo no existe.
     */
    async readDispositivos(ctx, dispositivosId) {
        const exists = await this.dispositivosExists(ctx, dispositivosId);
        if (!exists) {
            throw new Error(`The dispositivos ${dispositivosId} does not exist`);
        }

        const buffer = await ctx.stub.getState(dispositivosId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    /**
     * Elimina un dispositivo de la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} dispositivosId - El ID del dispositivo a eliminar
     * @throws {Error} - Si el dispositivo no existe.
     */
    async deleteDispositivos(ctx, dispositivosId) {
        const exists = await this.dispositivosExists(ctx, dispositivosId);
        if (!exists) {
            throw new Error(`The dispositivos ${dispositivosId} does not exist`);
        }
        await ctx.stub.deleteState(dispositivosId);
    }
 
}

module.exports = Dispositivos;
