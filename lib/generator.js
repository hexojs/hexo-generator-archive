'use strict';

var pagination = require('hexo-pagination');

module.exports = function(locals){
  var config = this.config;
  var archiveDir = config.archive_dir;
  var paginationDir = config.pagination_dir || 'page';
  var allPosts = locals.posts.sort('-date');
  var perPage = config.archive_generator.per_page;
  var result = [];

  if (!allPosts.length) return;

  if (archiveDir[archiveDir.length - 1] !== '/') archiveDir += '/';

  function generate(path, posts, options){
    options = options || {};
    options.archive = true;

    result = result.concat(pagination(path, posts, {
      perPage: perPage,
      layout: ['archive', 'index'],
      format: paginationDir + '/%d/',
      data: options
    }));
  }

  generate(archiveDir, allPosts);

  if (!config.archive_generator.yearly) return result;

  var posts = {};

  // Organize posts by date
  allPosts.forEach(function(post){
    var date = post.date;
    var year = date.year();
    var month = date.month() + 1; // month is started from 0

    if (!posts.hasOwnProperty(year)){
      // 13 arrays. The first array is for posts in this year
      // and the other arrays is for posts in this month
      posts[year] = [
        [], [], [], [], [], [], [], [], [], [], [], [], []
      ];
    }

    posts[year][0].push(post);
    posts[year][month].push(post);
  });

  var Query = this.model('Post').Query;
  var years = Object.keys(posts);
  var year, data, month, monthData, url;

  // Yearly
  for (var i = 0, len = years.length; i < len; i++){
    year = +years[i];
    data = posts[year];
    url = archiveDir + year + '/';
    if (!data[0].length) continue;

    generate(url, new Query(data[0]), {year: year});

    if (!config.archive_generator.monthly) continue;

    // Monthly
    for (month = 1; month <= 12; month++){
      monthData = data[month];
      if (!monthData.length) continue;

      generate(url + (month < 10 ? '0' + month : month) + '/', new Query(monthData), {
        year: year,
        month: month
      });
    }
  }

  return result;
};