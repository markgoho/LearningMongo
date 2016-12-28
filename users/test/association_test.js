const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogpost');
const Comment = require('../src/comment');

describe('Associations', () => {
  let joe,
    blogPost,
    comment;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really, really is!',
    });
    comment = new Comment({ content: 'Congrats on great post' });
    joe.blogPosts.push(blogPost); // Mongoose will put just the id in
    blogPost.comments.push(comment); // Mongoose will do the same thing, just push the id
    comment.user = joe; // Again, Mongoose will just put the id in
    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done()); // When all three have resolved, then...
  });
  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('saves a full relation graph', (done) => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user',
          },
        },
      })
      .then((user) => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');
        done();
      });
  });
});
