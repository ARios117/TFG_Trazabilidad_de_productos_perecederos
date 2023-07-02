/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { LecturasContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('LecturasContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new LecturasContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"lecturas 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"lecturas 1002 value"}'));
    });

    describe('#lecturasExists', () => {

        it('should return true for a lecturas', async () => {
            await contract.lecturasExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a lecturas that does not exist', async () => {
            await contract.lecturasExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createLecturas', () => {

        it('should create a lecturas', async () => {
            await contract.createLecturas(ctx, '1003', 'lecturas 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"lecturas 1003 value"}'));
        });

        it('should throw an error for a lecturas that already exists', async () => {
            await contract.createLecturas(ctx, '1001', 'myvalue').should.be.rejectedWith(/The lecturas 1001 already exists/);
        });

    });

    describe('#readLecturas', () => {

        it('should return a lecturas', async () => {
            await contract.readLecturas(ctx, '1001').should.eventually.deep.equal({ value: 'lecturas 1001 value' });
        });

        it('should throw an error for a lecturas that does not exist', async () => {
            await contract.readLecturas(ctx, '1003').should.be.rejectedWith(/The lecturas 1003 does not exist/);
        });

    });

    describe('#updateLecturas', () => {

        it('should update a lecturas', async () => {
            await contract.updateLecturas(ctx, '1001', 'lecturas 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"lecturas 1001 new value"}'));
        });

        it('should throw an error for a lecturas that does not exist', async () => {
            await contract.updateLecturas(ctx, '1003', 'lecturas 1003 new value').should.be.rejectedWith(/The lecturas 1003 does not exist/);
        });

    });

    describe('#deleteLecturas', () => {

        it('should delete a lecturas', async () => {
            await contract.deleteLecturas(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a lecturas that does not exist', async () => {
            await contract.deleteLecturas(ctx, '1003').should.be.rejectedWith(/The lecturas 1003 does not exist/);
        });

    });

});
