/**
 * @fileoverview SmartContract Contrato de transporte
 *
 * @version             1.0
 * @author              Alejandro de los Ríos Sánchez
 *
 */

'use strict';

const { Contract } = require('fabric-contract-api');

/**
 * Clase Contratotransporte que implementa un contrato inteligente en la plataforma blockchain.
 */
class Contratotransporte extends Contract {

    /**
     * Verifica si un contrato de transporte existe en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} contratotransporteId - El ID del contrato de transporte
     * @returns {boolean} - Devuelve verdadero si el contrato de transporte existe, falso en caso contrario.
     */
    async contratotransporteExists(ctx, contratotransporteId) {
        const buffer = await ctx.stub.getState(contratotransporteId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     * Crea un nuevo contrato de transporte en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} contratotransporteId - El ID del contrato de transporte
     * @param {string} data - Los datos del contrato de transporte en formato JSON
     * @returns {number} - Devuelve 1 si se crea el contrato de transporte correctamente.
     * @throws {Error} - Si el ID del contrato de transporte ya existe o si el tipo de activo no es un contrato.
     */
    async createContratotransporte(ctx, contratotransporteId, data) {
        const exists = await this.contratotransporteExists(ctx, contratotransporteId);
        if (exists) {
            throw new Error(`Id: ${contratotransporteId} ya existe!`);
        }
        const asset = JSON.stringify({ data });
        const info = JSON.parse(data);
        
        if(info.tipo_activo != "contrato"){
            throw new Error(`Id: ${contratotransporteId} no es tipo contrato!`);
        }

        const buffer = Buffer.from(asset);
        await ctx.stub.putState(contratotransporteId, buffer);
        return 1;
    }

    /**
     * Lee un contrato de transporte de la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} contratotransporteId - El ID del contrato de transporte
     * @returns {object} - Devuelve los datos del contrato de transporte en formato JSON.
     * @throws {Error} - Si el contrato de transporte no existe.
     */
    async readContratotransporte(ctx, contratotransporteId) {
        const exists = await this.contratotransporteExists(ctx, contratotransporteId);
        if (!exists) {
            throw new Error(`The contratotransporte ${contratotransporteId} does not exist`);
        }
        const buffer = await ctx.stub.getState(contratotransporteId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    /**
     * Actualiza la vigencia de un contrato de transporte en la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} contratotransporteId - El ID del contrato de transporte
     * @param {string} newValue - El nuevo valor de la vigencia del contrato de transporte
     * @returns {number} - Devuelve 1 si se actualiza la vigencia del contrato de transporte correctamente.
     * @throws {Error} - Si el contrato de transporte no existe o si el tipo de activo no es un contrato.
     */
    async updateVigenciaContratotransporte(ctx, contratotransporteId, newValue) {
        const exists = await this.contratotransporteExists(ctx, contratotransporteId);
        if (!exists) {
            throw new Error(`The contratotransporte ${contratotransporteId} does not exist`);
        }

        const aux = await this.readContratotransporte(ctx, contratotransporteId);
        var cto = JSON.parse(aux.data);

        if(cto.tipo_activo != "contrato"){
            throw new Error(`Id: ${contratotransporteId} no es tipo contrato!`);
        }

        cto.vigente = newValue;

        const asset = { data: JSON.stringify(cto) };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(contratotransporteId, buffer);
        return 1;
    }

    /**
     * Elimina un contrato de transporte de la cadena de bloques.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} contratotransporteId - El ID del contrato de transporte a eliminar
     * @throws {Error} - Si el contrato de transporte no existe.
     */
    async deleteContratotransporte(ctx, contratotransporteId) {
        const exists = await this.contratotransporteExists(ctx, contratotransporteId);
        if (!exists) {
            throw new Error(`The contratotransporte ${contratotransporteId} does not exist`);
        }
        await ctx.stub.deleteState(contratotransporteId);
    }
 
}

module.exports = Contratotransporte;
