'use strict';

var assign = require('object-assign');

hexo.config.archive_generator = assign({
  per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
  yearly: true,
  monthly: true
}, hexo.config.archive_generator);

hexo.extend.generator.register('archive', require('./lib/generator'));