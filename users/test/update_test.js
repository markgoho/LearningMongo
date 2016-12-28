const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
  let joe;
  beforeEach((done) => {
    joe = new User({ name: 'Joe', likes: 0 });
    joe.save()
      .then(() => { done(); });
  });
  function assertName(operation, done) {
    operation
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === 'Joseph');
        done();
      });
  }
  it('instance type using set and save', (done) => {
    joe.set('name', 'Joseph');
    assertName(joe.save(), done);
  });
  it('model instance type using update', (done) => {
    assertName(joe.update({ name: 'Joseph' }), done);
  });
  it('A model class can update', (done) => {
    assertName(User.update({ name: 'Joe' }, { name: 'Joseph' }), done);
  });
  it('A model class can update one record', (done) => {
    assertName(User.findOneAndUpdate({ name: 'Joe' }, { name: 'Joseph' }), done);
  });
  it('A model class can find a record with an id and update', (done) => {
    assertName(User.findByIdAndUpdate(joe._id, { name: 'Joseph' }), done);
  });
  it('A user can have their postCount incremented by 1', (done) => {
    User.update({ name: 'Joe' }, { $inc: { likes: 10 } })
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        assert(user.likes === 10);
        done();
      });
  });
});
