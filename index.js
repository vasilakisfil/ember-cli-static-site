/* jshint node: true */
'use strict';

const mergeTrees = require('broccoli-merge-trees');
const replace = require('broccoli-replace');
const staticPages = require('./lib/broccoli/broccoli-fastboot-static-html');

module.exports = {
  name: 'ember-cli-static-site',

  included (app) {
    this._super.included.apply(this, arguments);
    this.options = app.options['ember-cli-static-site'] || {};
  },

  postprocessTree (type, tree) {
    if (type === 'all') {
      const replaceOptions = {
        files: ['index.html'],
        patterns: [{
          match: /<.*?script.*?>.*?<\/.*?script.*?>/g,
          replacement: ''
        }]
      };
      tree = replace(tree, replaceOptions);

      if (!this.app.options.__is_building_fastboot__) {
        const staticTree = staticPages(tree, {
          paths: this.options.paths
        });
        tree = mergeTrees([tree, staticTree], {overwrite: true});
      }
    }

    return tree;
  }
};
