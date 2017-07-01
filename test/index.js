'use strict';

var should = require('chai').should(); // eslint-disable-line
var Promise = require('bluebird');
var Hexo = require('hexo');

describe('Archive generator', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  var Post = hexo.model('Post');
  var generator = Promise.method(require('../lib/generator').bind(hexo));
  var posts = [
    {source: 'quux', slug: 'quux', date: new Date(2014, 1, 2)},
    {source: 'qux', slug: 'qux', date: new Date(2014, 1, 2)},
    {source: 'foo', slug: 'foo', date: new Date(2014, 1, 2)},
    {source: 'bar', slug: 'bar', date: new Date(2013, 5, 6)},
    {source: 'baz', slug: 'baz', date: new Date(2013, 9, 10)},
    {source: 'boo', slug: 'boo', date: new Date(2013, 5, 8)}
  ];

  function locals() {
    hexo.locals.invalidate();
    return hexo.locals.toObject();
  }

  before(function() {
    return hexo.init();
  });

  it('pagination enabled', function() {
    return Post.insert(posts).then(function(posts) {
      hexo.config.archive_generator = {
        per_page: 2,
        yearly: true,
        monthly: true,
        daily: false
      };
      return generator(locals()).then(function(result) {
        posts = Post.sort('-date');

        result.length.should.eql(11);

        for (var i = 0, len = result.length; i < len; i++) {
          result[i].layout.should.eql(['archive', 'index']);
          result[i].data.archive.should.be.true;
        }

        result[0].path.should.eql('archives/');
        result[0].data.base.should.eql('archives/');
        result[0].data.total.should.eql(3);
        result[0].data.current.should.eql(1);
        result[0].data.current_url.should.eql('archives/');
        result[0].data.posts.should.eql(posts.limit(2));
        result[0].data.prev.should.eql(0);
        result[0].data.prev_link.should.eql('');
        result[0].data.next.should.eql(2);
        result[0].data.next_link.should.eql('archives/page/2/');

        result[1].path.should.eql('archives/page/2/');
        result[1].data.base.should.eql('archives/');
        result[1].data.total.should.eql(3);
        result[1].data.current.should.eql(2);
        result[1].data.current_url.should.eql('archives/page/2/');
        result[1].data.posts.should.eql(posts.skip(2).limit(2));
        result[1].data.prev.should.eql(1);
        result[1].data.prev_link.should.eql('archives/');
        result[1].data.next.should.eql(3);
        result[1].data.next_link.should.eql('archives/page/3/');

        result[2].path.should.eql('archives/page/3/');
        result[2].data.base.should.eql('archives/');
        result[2].data.total.should.eql(3);
        result[2].data.current.should.eql(3);
        result[2].data.current_url.should.eql('archives/page/3/');
        result[2].data.posts.should.eql(posts.skip(4));
        result[2].data.prev.should.eql(2);
        result[2].data.prev_link.should.eql('archives/page/2/');
        result[2].data.next.should.eql(0);
        result[2].data.next_link.should.eql('');

        result[3].path.should.eql('archives/2013/');
        result[3].data.base.should.eql('archives/2013/');
        result[3].data.total.should.eql(2);
        result[3].data.current.should.eql(1);
        result[3].data.current_url.should.eql('archives/2013/');
        result[3].data.posts.should.eql(posts.slice(3, 5));
        result[3].data.prev.should.eql(0);
        result[3].data.prev_link.should.eql('');
        result[3].data.next.should.eql(2);
        result[3].data.next_link.should.eql('archives/2013/page/2/');
        result[3].data.year.should.eql(2013);

        result[4].path.should.eql('archives/2013/page/2/');
        result[4].data.base.should.eql('archives/2013/');
        result[4].data.total.should.eql(2);
        result[4].data.current.should.eql(2);
        result[4].data.current_url.should.eql('archives/2013/page/2/');
        result[4].data.posts.should.eql(posts.slice(5));
        result[4].data.prev.should.eql(1);
        result[4].data.prev_link.should.eql('archives/2013/');
        result[4].data.next.should.eql(0);
        result[4].data.next_link.should.eql('');
        result[4].data.year.should.eql(2013);

        result[5].path.should.eql('archives/2013/06/');
        result[5].data.base.should.eql('archives/2013/06/');
        result[5].data.total.should.eql(1);
        result[5].data.current.should.eql(1);
        result[5].data.current_url.should.eql('archives/2013/06/');
        result[5].data.posts.should.eql(posts.slice(4, 6));
        result[5].data.prev.should.eql(0);
        result[5].data.prev_link.should.eql('');
        result[5].data.next.should.eql(0);
        result[5].data.next_link.should.eql('');
        result[5].data.year.should.eql(2013);
        result[5].data.month.should.eql(6);

        result[6].path.should.eql('archives/2013/10/');
        result[6].data.base.should.eql('archives/2013/10/');
        result[6].data.total.should.eql(1);
        result[6].data.current.should.eql(1);
        result[6].data.current_url.should.eql('archives/2013/10/');
        result[6].data.posts.should.eql(posts.slice(3, 4));
        result[6].data.prev.should.eql(0);
        result[6].data.prev_link.should.eql('');
        result[6].data.next.should.eql(0);
        result[6].data.next_link.should.eql('');
        result[6].data.year.should.eql(2013);
        result[6].data.month.should.eql(10);

        result[7].path.should.eql('archives/2014/');
        result[7].data.base.should.eql('archives/2014/');
        result[7].data.total.should.eql(2);
        result[7].data.current.should.eql(1);
        result[7].data.current_url.should.eql('archives/2014/');
        result[7].data.posts.should.eql(posts.limit(2));
        result[7].data.prev.should.eql(0);
        result[7].data.prev_link.should.eql('');
        result[7].data.next.should.eql(2);
        result[7].data.next_link.should.eql('archives/2014/page/2/');
        result[7].data.year.should.eql(2014);

        result[8].path.should.eql('archives/2014/page/2/');
        result[8].data.base.should.eql('archives/2014/');
        result[8].data.total.should.eql(2);
        result[8].data.current.should.eql(2);
        result[8].data.current_url.should.eql('archives/2014/page/2/');
        result[8].data.posts.should.eql(posts.slice(2, 3));
        result[8].data.prev.should.eql(1);
        result[8].data.prev_link.should.eql('archives/2014/');
        result[8].data.next.should.eql(0);
        result[8].data.next_link.should.eql('');
        result[8].data.year.should.eql(2014);

        result[9].data.year.should.eql(2014);
        result[9].data.month.should.eql(2);
        result[10].data.year.should.eql(2014);
        result[10].data.month.should.eql(2);
      }).thenReturn(posts);
    }).map(function(post) {
      return post.remove();
    });
  });

  it('pagination disabled', function() {
    return Post.insert(posts).then(function(posts) {
      hexo.config.archive_generator = {
        per_page: 0,
        yearly: true,
        monthly: true,
        daily: false
      };
      return generator(locals()).then(function(result) {
        posts = Post.sort('-date');

        result.length.should.eql(6);

        for (var i = 0, len = result.length; i < len; i++) {
          result[i].layout.should.eql(['archive', 'index']);
          result[i].data.archive.should.be.true;
        }

        result[0].path.should.eql('archives/');
        result[0].data.base.should.eql('archives/');
        result[0].data.total.should.eql(1);
        result[0].data.current.should.eql(1);
        result[0].data.current_url.should.eql('archives/');
        result[0].data.posts.should.eql(posts);
        result[0].data.prev.should.eql(0);
        result[0].data.prev_link.should.eql('');
        result[0].data.next.should.eql(0);
        result[0].data.next_link.should.eql('');

        result[1].path.should.eql('archives/2013/');
        result[1].data.base.should.eql('archives/2013/');
        result[1].data.total.should.eql(1);
        result[1].data.current.should.eql(1);
        result[1].data.current_url.should.eql('archives/2013/');
        result[1].data.posts.should.eql(posts.slice(3));
        result[1].data.prev.should.eql(0);
        result[1].data.prev_link.should.eql('');
        result[1].data.next.should.eql(0);
        result[1].data.next_link.should.eql('');
        result[1].data.year.should.eql(2013);

        result[2].path.should.eql('archives/2013/06/');
        result[2].data.base.should.eql('archives/2013/06/');
        result[2].data.total.should.eql(1);
        result[2].data.current.should.eql(1);
        result[2].data.current_url.should.eql('archives/2013/06/');
        result[2].data.posts.should.eql(posts.slice(4));
        result[2].data.prev.should.eql(0);
        result[2].data.prev_link.should.eql('');
        result[2].data.next.should.eql(0);
        result[2].data.next_link.should.eql('');
        result[2].data.year.should.eql(2013);
        result[2].data.month.should.eql(6);

        result[3].path.should.eql('archives/2013/10/');
        result[3].data.base.should.eql('archives/2013/10/');
        result[3].data.total.should.eql(1);
        result[3].data.current.should.eql(1);
        result[3].data.current_url.should.eql('archives/2013/10/');
        result[3].data.posts.should.eql(posts.slice(3, 4));
        result[3].data.prev.should.eql(0);
        result[3].data.prev_link.should.eql('');
        result[3].data.next.should.eql(0);
        result[3].data.next_link.should.eql('');
        result[3].data.year.should.eql(2013);
        result[3].data.month.should.eql(10);

        result[4].path.should.eql('archives/2014/');
        result[4].data.base.should.eql('archives/2014/');
        result[4].data.total.should.eql(1);
        result[4].data.current.should.eql(1);
        result[4].data.current_url.should.eql('archives/2014/');
        result[4].data.posts.should.eql(posts.limit(3));
        result[4].data.prev.should.eql(0);
        result[4].data.prev_link.should.eql('');
        result[4].data.next.should.eql(0);
        result[4].data.next_link.should.eql('');
        result[4].data.year.should.eql(2014);

        result[5].path.should.eql('archives/2014/02/');
        result[5].data.base.should.eql('archives/2014/02/');
        result[5].data.total.should.eql(1);
        result[5].data.current.should.eql(1);
        result[5].data.current_url.should.eql('archives/2014/02/');
        result[5].data.posts.should.eql(posts.limit(3));
        result[5].data.prev.should.eql(0);
        result[5].data.prev_link.should.eql('');
        result[5].data.next.should.eql(0);
        result[5].data.next_link.should.eql('');
        result[5].data.year.should.eql(2014);
        result[5].data.month.should.eql(2);
      }).thenReturn(posts);
    }).map(function(post) {
      return post.remove();
    });
  });

  it('yearly disabled', function() {
    return Post.insert(posts).then(function(posts) {
      hexo.config.archive_generator = {
        per_page: 0,
        yearly: false,
        monthly: true,
        daily: false
      };
      return generator(locals()).then(function(result) {
        posts = Post.sort('-date');

        result.map(function(item) {
          return item.path;
        }).should.eql(['archives/']);
      }).thenReturn(posts);
    }).map(function(post) {
      return post.remove();
    });
  });

  it('monthly enabled and daily enabled', function() {
    return Post.insert(posts).then(function(posts) {
      hexo.config.archive_generator = {
        per_page: 0,
        yearly: true,
        monthly: true,
        daily: true
      };
      return generator(locals()).then(function(result) {
        posts = Post.sort('-date');

        result.map(function(item) {
          return item.path;
        }).should.include('archives/', 'archives/2013/', 'archives/2014/', 'archives/2013/06/', 'archives/2013/10/', 'archives/2014/02/', 'archives/2013/06/06/', 'archives/2013/10/10/', 'archives/2014/02/02');
      }).thenReturn(posts);
    }).map(function(post) {
      return post.remove();
    });
  });

  describe('monthly disabled', function() {
    it('daily disabled', function() {
      return Post.insert(posts).then(function(posts) {
        hexo.config.archive_generator = {
          per_page: 0,
          yearly: true,
          monthly: false,
          daily: false
        };
        return generator(locals()).then(function(result) {
          posts = Post.sort('-date');

          result.map(function(item) {
            return item.path;
          }).should.eql(['archives/', 'archives/2013/', 'archives/2014/']);
        }).thenReturn(posts);
      }).map(function(post) {
        return post.remove();
      });
    });

    it('daily enabled', function() {
      return Post.insert(posts).then(function(posts) {
        hexo.config.archive_generator = {
          per_page: 0,
          yearly: true,
          monthly: false,
          daily: true
        };
        return generator(locals()).then(function(result) {
          posts = Post.sort('-date');

          result.map(function(item) {
            return item.path;
          }).should.include('archives/', 'archives/2013/', 'archives/2014/', 'archives/2013/06/06/', 'archives/2013/10/10/', 'archives/2014/02/02');
        }).thenReturn(posts);
      }).map(function(post) {
        return post.remove();
      });
    });
  });

  it('custom pagination_dir', function() {
    return Post.insert(posts).then(function(posts) {
      hexo.config.archive_generator = {
        per_page: 1,
        yearly: false,
        monthly: false,
        daily: false
      };
      hexo.config.pagination_dir = 'yo';
      return generator(locals()).then(function(result) {
        posts = Post.sort('-date');

        result.map(function(item) {
          return item.path;
        }).should.eql(['archives/', 'archives/yo/2/', 'archives/yo/3/', 'archives/yo/4/', 'archives/yo/5/', 'archives/yo/6/']);
      }).thenReturn(posts);
    }).map(function(post) {
      return post.remove();
    }).then(function() {
      // Restore config
      hexo.config.pagination_dir = 'page';
    });
  });
});
