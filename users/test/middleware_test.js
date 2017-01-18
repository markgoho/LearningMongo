const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogpost');

describe('Middleware', () => {
  let joe,
    blogPost;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really, really is!',
    });
    joe.blogPosts.push(blogPost); // Mongoose will put just the id in
    Promise.all([joe.save(), blogPost.save()])
      .then(() => done()); // When all three have resolved, then...
  });
  it('users clean up dangling blogposts on remove', (done) => {
    joe.remove()
      .then(() => BlogPost.count())
      .then((count) => {
        assert(count === 0);
        done();
      });
  });
});
