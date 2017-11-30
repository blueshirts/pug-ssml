/**
 * The following issue describes plans for potentially allowing the exporting of mixins. Until this is resolved the
 * mixins are just automatically included.
 * https://github.com/pugjs/pug/issues/1950
 */

"use strict"

const pug = require('pug')
const fs = require('fs')
const ug = require("uglify-js")
const mkdirp = require('mkdirp')

// The default mixins file.
const mixins = 'pug-ssml-mixins.pug'

// The default output file.
const defaultOutputFile = 'ssml-speech.js'

const defaultPugOptions = {
  pretty: false,
  basedir: '.'
}

function precompile(folder, options = {}) {
  const result = []

  // Read the files.
  fs.readdirSync(folder).forEach(file => {
    let name = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'))
    // Replace the dashes in the names with underscores so they are legal variable names.
    if (name.indexOf('-') !== -1) {
      name = name.replace('-', '_')
    }

    // The complete filename.
    const filename = `${folder}/${file}`

    // Create pug options.
    const mergedOptions = Object.assign(defaultPugOptions, options, { name: name })

    // Read the template.
    const template = fs.readFileSync(filename, 'utf8')
    // Compile the template to code.
    const s = pug.compileClient(`include /${mixins}\n`.concat(template), mergedOptions)

    // Debug.
    // const fn = eval(`${s}; ${name}`)
    // console.dir(fn())

    // Export the function for node.
    result.push(s)
    result.push(`exports.${name} = ${name}`)
  })

  try {
    const outputFile = options.file ? options.file : defaultOutputFile
    const outputDir = options.output ? options.output : '.'

    // Ensure the output directory exists.
    mkdirp.sync(outputDir)

    // Write the file.
    fs.writeFileSync(`${outputDir}/${outputFile}`, ug.minify(result.join(';')).code)
  } catch (err) {
    console.log(err)
  }
}

exports.precompile = precompile
