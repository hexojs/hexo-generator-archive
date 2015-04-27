'use strict';

var should = require('chai').should();
var Hexo = require('hexo');

describe('Archive generator', function(){
  var hexo = new Hexo(__dirname, {silent: true});
  var Post = hexo.model('Post');
  var generator = require('../lib/generator').bind(hexo);
  var posts;
  var locals;

  before(function(){
    return Post.insert([
      {source: 'foo', slug: 'foo', date: new Date(2014, 1, 2)},
      {source: 'bar', slug: 'bar', date: new Date(2013, 5, 6)},
      {source: 'baz', slug: 'baz', date: new Date(2013, 9, 10)},
      {source: 'boo', slug: 'boo', date: new Date(2013, 5, 8)}
    ]).then(function(data){
      posts = Post.sort('-date');
      locals = hexo.locals.toObject();
    });
  });

  it('pagination enabled', function(){
    hexo.config.archive_generator = {
      per_page: 2,
      yearly: true,
      monthly: true
    };

    var result = generator(locals);

    result.length.should.eql(8);

    for (var i = 0, len = result.length; i < len; i++){
      result[i].layout.should.eql(['archive', 'index']);
      result[i].data.archive.should.be.true;
    }

    result[0].path.should.eql('archives/');
    result[0].data.base.should.eql('archives/');
    result[0].data.total.should.eql(2);
    result[0].data.current.should.eql(1);
    result[0].data.current_url.should.eql('archives/');
    result[0].data.posts.should.eql(posts.limit(2));
    result[0].data.prev.should.eql(0);
    result[0].data.prev_link.should.eql('');
    result[0].data.next.should.eql(2);
    result[0].data.next_link.should.eql('archives/page/2/');

    result[1].path.should.eql('archives/page/2/');
    result[1].data.base.should.eql('archives/');
    result[1].data.total.should.eql(2);
    result[1].data.current.should.eql(2);
    result[1].data.current_url.should.eql('archives/page/2/');
    result[1].data.posts.should.eql(posts.skip(2));
    result[1].data.prev.should.eql(1);
    result[1].data.prev_link.should.eql('archives/');
    result[1].data.next.should.eql(0);
    result[1].data.next_link.should.eql('');

    result[2].path.should.eql('archives/2013/');
    result[2].data.base.should.eql('archives/2013/');
    result[2].data.total.should.eql(2);
    result[2].data.current.should.eql(1);
    result[2].data.current_url.should.eql('archives/2013/');
    result[2].data.posts.should.eql(posts.slice(1, 3));
    result[2].data.prev.should.eql(0);
    result[2].data.prev_link.should.eql('');
    result[2].data.next.should.eql(2);
    result[2].data.next_link.should.eql('archives/2013/page/2/');
    result[2].data.year.should.eql(2013);

    result[3].path.should.eql('archives/2013/page/2/');
    result[3].data.base.should.eql('archives/2013/');
    result[3].data.total.should.eql(2);
    result[3].data.current.should.eql(2);
    result[3].data.current_url.should.eql('archives/2013/page/2/');
    result[3].data.posts.should.eql(posts.slice(3));
    result[3].data.prev.should.eql(1);
    result[3].data.prev_link.should.eql('archives/2013/');
    result[3].data.next.should.eql(0);
    result[3].data.next_link.should.eql('');
    result[3].data.year.should.eql(2013);

    result[4].path.should.eql('archives/2013/06/');
    result[4].data.base.should.eql('archives/2013/06/');
    result[4].data.total.should.eql(1);
    result[4].data.current.should.eql(1);
    result[4].data.current_url.should.eql('archives/2013/06/');
    result[4].data.posts.should.eql(posts.slice(2));
    result[4].data.prev.should.eql(0);
    result[4].data.prev_link.should.eql('');
    result[4].data.next.should.eql(0);
    result[4].data.next_link.should.eql('');
    result[4].data.year.should.eql(2013);
    result[4].data.month.should.eql(6);

    result[5].path.should.eql('archives/2013/10/');
    result[5].data.base.should.eql('archives/2013/10/');
    result[5].data.total.should.eql(1);
    result[5].data.current.should.eql(1);
    result[5].data.current_url.should.eql('archives/2013/10/');
    result[5].data.posts.should.eql(posts.slice(1, 2));
    result[5].data.prev.should.eql(0);
    result[5].data.prev_link.should.eql('');
    result[5].data.next.should.eql(0);
    result[5].data.next_link.should.eql('');
    result[5].data.year.should.eql(2013);
    result[5].data.month.should.eql(10);

    result[6].path.should.eql('archives/2014/');
    result[6].data.base.should.eql('archives/2014/');
    result[6].data.total.should.eql(1);
    result[6].data.current.should.eql(1);
    result[6].data.current_url.should.eql('archives/2014/');
    result[6].data.posts.should.eql(posts.limit(1));
    result[6].data.prev.should.eql(0);
    result[6].data.prev_link.should.eql('');
    result[6].data.next.should.eql(0);
    result[6].data.next_link.should.eql('');
    result[6].data.year.should.eql(2014);

    result[7].path.should.eql('archives/2014/02/');
    result[7].data.base.should.eql('archives/2014/02/');
    result[7].data.total.should.eql(1);
    result[7].data.current.should.eql(1);
    result[7].data.current_url.should.eql('archives/2014/02/');
    result[7].data.posts.should.eql(posts.limit(1));
    result[7].data.prev.should.eql(0);
    result[7].data.prev_link.should.eql('');
    result[7].data.next.should.eql(0);
    result[7].data.next_link.should.eql('');
    result[7].data.year.should.eql(2014);
    result[7].data.month.should.eql(2);
  });

  it('pagination disabled', function(){
    hexo.config.archive_generator = {
      per_page: 0,
      yearly: true,
      monthly: true
    };

    var result = generator(locals);

    result.length.should.eql(6);

    for (var i = 0, len = result.length; i < len; i++){
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
    result[1].data.posts.should.eql(posts.slice(1));
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
    result[2].data.posts.should.eql(posts.slice(2));
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
    result[3].data.posts.should.eql(posts.slice(1, 2));
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
    result[4].data.posts.should.eql(posts.limit(1));
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
    result[5].data.posts.should.eql(posts.limit(1));
    result[5].data.prev.should.eql(0);
    result[5].data.prev_link.should.eql('');
    result[5].data.next.should.eql(0);
    result[5].data.next_link.should.eql('');
    result[5].data.year.should.eql(2014);
    result[5].data.month.should.eql(2);
  });

  it('yearly disabled', function(){
    hexo.config.archive_generator = {
      per_page: 0,
      yearly: false,
      monthly: true
    };

    var result = generator(locals);

    result.map(function(item){
      return item.path;
    }).should.eql(['archives/']);
  });

  it('monthly disabled', function(){
    hexo.config.archive_generator = {
      per_page: 0,
      yearly: true,
      monthly: false
    };

    var result = generator(locals);

    result.map(function(item){
      return item.path;
    }).should.eql(['archives/', 'archives/2013/', 'archives/2014/']);
  });

  it('custom pagination_dir', function(){
    hexo.config.archive_generator = {
      per_page: 1,
      yearly: false,
      monthly: false
    };

    hexo.config.pagination_dir = 'yo';

    var result = generator(locals);

    result.map(function(item){
        return item.path;
    }).should.eql(['archives/', 'archives/yo/2/', 'archives/yo/3/', 'archives/yo/4/']);

    // Restore config
    hexo.config.pagination_dir = 'page';
  });
});