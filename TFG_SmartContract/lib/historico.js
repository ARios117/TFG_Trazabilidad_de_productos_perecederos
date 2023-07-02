/**
 * @fileoverview SmartContract Histórico de Transacciones
 *
 * @version             1.0
 * @author              Alejandro de los Ríos Sánchez
 *
 */

'use strict';

const { Contract } = require('fabric-contract-api');

/**
 * Clase Historico que implementa un contrato inteligente en la plataforma blockchain.
 */
class historico extends Contract {

    /**
     * Lista los registros de la blockchain en un rango especificado.
     * @param {Context} ctx - El contexto de transacción
     * @param {string} startKey - La clave de inicio del rango
     * @param {string} endKey - La clave de fin del rango
     * @returns {string} - Devuelve los registros en formato JSON.
     */
    async listByRange(ctx, startKey, endKey) {
        
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

}

module.exports = historico;
