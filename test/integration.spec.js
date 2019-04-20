'use strict';


/* set environment variables */
process.env.NODE_ENV = 'test';


/* dependencies */
const { waterfall } = require('async');
const { include } = require('@lykmapipo/include');
const { expect } = require('chai');
const {
  Schema,
  model,
  connect,
  drop
} = include(__dirname, '..');


describe('common', () => {

  const MONGODB_URI = 'mongodb://localhost/test';

  before(done => connect(MONGODB_URI, done));
  after(done => drop(done));

  it('should beautify unique error message on create', done => {
    const schema = new Schema({ name: { type: String, unique: true } });
    const User = model(schema);
    const user = { name: 'John Doe' };

    // wait index
    User.on('index', () => {
      waterfall([
        next => User.create(user, error => next(error)),
        next => User.create(user, error => next(error))
      ], error => {
        expect(error).to.exist;
        expect(error.status).to.exist;
        expect(error.name).to.exist;
        expect(error.name).to.be.equal('ValidationError');
        expect(error._message).to.exist;
        expect(error.errors).to.exist;
        expect(error.errors.name).to.exist;
        expect(error.errors.name.kind).to.exist;
        expect(error.errors.name.kind).to.be.equal('unique');
        done();
      });
    });
  });

  it('should beautify compaund unique error message on create', done => {
    const schema = new Schema({ firstName: String, lastName: String });
    schema.index({ firstName: 1, lastName: 1 }, { unique: true });
    const User = model(schema);
    const user = { firstName: 'John', lastName: 'Doe' };

    // wait index
    User.on('index', () => {
      waterfall([
        next => User.create(user, error => next(error)),
        next => User.create(user, error => next(error))
      ], error => {
        expect(error).to.exist;
        expect(error.status).to.exist;
        expect(error.name).to.exist;
        expect(error.name).to.be.equal('ValidationError');
        expect(error._message).to.exist;
        expect(error.errors).to.exist;
        expect(error.errors.firstName).to.exist;
        expect(error.errors.firstName.kind).to.exist;
        expect(error.errors.firstName.kind)
          .to.be.equal('unique');
        expect(error.errors.lastName).to.exist;
        expect(error.errors.lastName.kind).to.exist;
        expect(error.errors.lastName.kind)
          .to.be.equal('unique');
        done();
      });
    });
  });

});