var merge = require('utils-merge');

hexo.config.archive_generator = merge({
  per_page: hexo.config.per_page,
  yearly: true,
  monthly: true
}, hexo.config.archive_generator);

hexo.extend.generator.register('archive', require('./lib/generator'));