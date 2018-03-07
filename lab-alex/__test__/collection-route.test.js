'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

const User = require('../model/user.js');
const Collection = require('../model/collection.js');

require('jest');

const url = 'http://localhost:3000';
const exampleUser = {
  username: 'exampleuser',
  password: '1234', 
  email: 'exampleuser@test.com',
};



const exampleCollection = {
  name: 'test collection1 name',
  desc: 'test collection1 desc',
};

describe('Collection Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Collection.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/collection', () => {
    describe('with a valid request body', function() {
      beforeEach( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then( token => {
            this.tempToken = token;
            done();
          })
          .catch(done);
      });
      afterEach(() => {
        delete exampleCollection.userID;
      });
      afterEach(done => {
        delete exampleCollection.userID;
        if (this.tempCollection) {
          Collection.remove({})
            .then(() => done())
            .catch(done);
          return;
        }
        done();
      });

      it('should return a collection', done => {
        request.post(`${url}/api/collection`)
          .send(exampleCollection)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.desc).toEqual(exampleCollection.desc);
            expect(res.body.name).toEqual(exampleCollection.name);
            expect(res.body.userID).toEqual(this.tempUser._id.toString());
            done();
          });
      });
    });
    // describe('with an invalid request body', function() {
    //   it('should return with a 400 status code', done => {
    //     request.post(`${url}/api/commection`)
    //       .end((err, res) => {
    //         expect(res.status).toEqual(400);
    //         done();
    //       });
    //   });
    // });
  });
  describe('GET: /api/collection/:collectionId', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeEach( done => {
      exampleCollection.userID = this.tempUser._id.toString();
      new Collection(exampleCollection).save()
        .then( collection => {
          this.tempCollection = collection;
          done();
        })
        .catch(done);
    });
    afterEach( () => {
      delete exampleCollection.userID;
    });
    afterEach(done => {
      delete exampleCollection.userID;
      if (this.tempCollection) {
        Collection.remove({})
          .then(() => done())
          .catch(done);
        return;
      }
      done();
    });
    it('should get a collection', done => {
      request.get(`${url}/api/collection/${this.tempCollection._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(exampleCollection.name);
          expect(res.body.desc).toEqual(exampleCollection.desc);
          expect(res.body.userID).toEqual(this.tempUser._id.toString());
          done();
        });
    });
  });
  describe('PUT /api/collection/:collectionId', () => {
    describe('with a valid id', () => {
      // beforeEach(done => {
      //   new User(exampleUser)
      //     .generatePasswordHash(exampleUser.password)
      //     .then(user => user.save())
      //     .then(user => {
      //       this.tempUser = user;
      //       return user.generateToken();
      //     })
      //     .then(token => {
      //       this.tempToken = token;
      //       done();
      //     })
      //     .catch(done);
      // });
      // beforeEach(done => {
      //   exampleCollection.userID = this.tempUser._id.toString();
      //   new Collection(exampleCollection).save()
      //     .then(collection => {
      //       this.tempCollection = collection;
      //       done();
      //     })
      //     .catch(done);
      // });
      // afterEach( done => {
      //   delete exampleCollection.userID;
      //   if (this.tempCollection) {
      //     Collection.remove({})
      //       .then( () => done())
      //       .catch(done);
      //     return;
      //   }
      //   done();
      // });
      beforeEach(done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
          .then(user => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then(token => {
            this.tempToken = token;
            done();
          })
          .catch(done);
      });
      beforeEach(done => {
        exampleCollection.userID = this.tempUser._id.toString();
        new Collection(exampleCollection).save()
          .then(collection => {
            this.tempCollection = collection;
            done();
          })
          .catch(done);
      });
      afterEach(() => {
        delete exampleCollection.userID;
      });
      afterEach(done => {
        delete exampleCollection.userID;
        if (this.tempCollection) {
          Collection.remove({})
            .then(() => done())
            .catch(done);
          return;
        }
        done();
      });
      it('should update a collection', done => {
        const updatedCollection = {
          name: 'test name updated',
        };
        request.put(`${url}/api/collection/${this.tempCollection._id}`)
          // .send(updatedCollection)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            // expect(res.body.name).toEqual(updatedCollection.name);
            done();
          });
        // });
      });
    });
  });
});