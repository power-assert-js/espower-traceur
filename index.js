/**
 * espower-traceur - power-assert instrumentor for traceur
 *
 * Copyright (c) 2014 Yosuke Furukawa
 * Licensed under the MIT license.
 */
var traceur = require('traceur');
var minimatch = require('minimatch');
var extend = require('xtend');
var convert = require('convert-source-map');
var espowerSource = require('espower-source');

function espowerTraceur (options) {
  'use strict';

  var separator = (options.pattern.lastIndexOf('/', 0) === 0) ? '' : '/',
  pattern = options.cwd + separator + options.pattern;

  var originCompile = traceur.compile;
  // Transcode some source.
  traceur.compile = function(contents, opts, srcPath, destPath) {
    if (! minimatch(srcPath, pattern)) {
      return originCompile(contents, opts, srcPath, destPath);
    }
    var compiled = originCompile(contents, opts, srcPath, destPath);
    var espowered = espowerSource(
      compiled,
      srcPath,
      options
    );
    return espowered;
  };
  traceur.require.makeDefault(function (filename) {
    // Don't compile our dependencies.
    return filename.indexOf('node_modules') === -1;
  });
}

module.exports = espowerTraceur;
