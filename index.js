/**
 * The following issue describes plans for potentially allowing the exporting of mixins. Until this is resolved the
 * mixins are just automatically included.
 * https://github.com/pugjs/pug/issues/1950
 */

"use strict"

const pug = require('pug')
const fs = require('fs')
const ug = require("uglify-js")

// The default mixins file.
const mixins = './pug-ssml-mixins.pug'

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
    if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir)
    }
    // Write the file.
    fs.writeFileSync(`${outputDir}/${outputFile}`, ug.minify(result.join(';')).code)
  } catch (err) {
    console.log(err)
  }
}

// Allow requiring of pug templates.
// require.extensions['.pug'] = function (module, filename) {
//   module.exports = fs.readFileSync(filename, 'utf8')
// }
//
// function compile(name, folder, file, options = {}) {
//   const filename = `${folder}/${file}`
//   console.log(`Compiling file: ${filename}`)
//
//   const mergedOptions = Object.assign(options, {filename: filename, name: name})
//   const template = fs.readFileSync(filename, 'utf8')
//   const c = pug.compileClient('include ssml_mixins\n'.concat(template), mergedOptions)
//   const code = eval(`${c}; ${name}`)
//   console.dir(eval(code))
//   return code
// }

// function compileToString(name, folder, file, options) {
//   const filename = `${folder}/${file}`
//   const mergedOptions = Object.assign(options, {filename: filename, name: name})
//   const template = fs.readFileSync(filename, 'utf8')
//   // const s = pug.compileClient('include ssml_mixins\n'.concat(template), mergedOptions)
//   const s = pug.compileClient(template, mergedOptions)
//   console.dir(s)
//   return s
// }

// function precompile(folder, options = {}) {
//   const result = []
//   fs.readdirSync(folder).forEach(file => {
//     const name = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'))
//
//     // Process the file.
//     result.push(compileToString(name, folder, file, options))
//   result.push(`exports.${name} = ${name}`)
// })
//   fs.writeFileSync(`./ssml-speech.js`, result.join(';'))
// }

// function load(folder, options = {}) {
//   const result = {}
//   fs.readdirSync(folder).forEach(file => {
//     const name = file.substring(file.lastIndexOf('/') + 1, file.lastIndexOf('.'))
//
//     // Process the file.
//     result[name] = compile(name, folder, file, options)
//   })
//   return result
// }

// const s = pug.compileFileClient('./test/template-using-mixin.pug', {filename: './template-using-mixin.pug', name: 'template-using-mixin', compileDebug: false, pretty: false})
// console.dir(s)

// const templates = load('./templates')
// console.dir(templates)
// console.log(templates.welcome({answer: '5', correct: true}))
// console.log(templates.answer({answer: '5', correct: true}))

// const code = precompile('./templates')
// console.dir(code)

exports.precompile = precompile
