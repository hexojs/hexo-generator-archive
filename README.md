# hexo-generator-archive

[![Build Status](https://github.com/hexojs/hexo-generator-archive/workflows/Tester/badge.svg)](https://github.com/hexojs/hexo-generator-archive/actions?query=workflow%3ATester)
[![NPM version](https://badge.fury.io/js/hexo-generator-archive.svg)](https://www.npmjs.com/package/hexo-generator-archive)
[![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-archive.svg)](https://coveralls.io/r/hexojs/hexo-generator-archive?branch=master)

Archive generator for [Hexo].

## Installation

``` bash
$ npm install hexo-generator-archive --save
```

## Options

``` yaml
archive_generator:
  enabled: true
  per_page: 10
  yearly: true
  monthly: true
  daily: false
  order_by: -date
  explicit_paging: false
  overwrite_latest: false
  verbose: false
```

- **enabled**: The default value is **true**, set to **false** if you do not want to enable the plugin
- **per_page**: Posts displayed per page. (**0** = disable pagination)
- **yearly**: Generate yearly archive.
- **monthly**: Generate monthly archive.
- **daily**: Generate daily archive.
- **order_by**: Posts order. (Order by date descending by default)
- **explicit_paging**: Explicit paging. (Number the first page. e.g. `page/1/index.html`)
- **overwrite_latest**: Set the latest page. (`latest/index.html` in place of `page/N/index.html`). If there is a single page it requires explicitPaging=true`.
- **verbose**: verbose output. (Output all generated routes)

## License

MIT

[Hexo]: https://hexo.io/
