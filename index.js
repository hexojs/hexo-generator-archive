'use strict';

var assign = require('object-assign');

hexo.config.archive_generator = assign({
  per_page: hexo.config.per_page,
  yearly: true,
  monthly: true
}, hexo.config.archive_generator);

hexo.extend.generator.register('archive', require('./lib/generator'));