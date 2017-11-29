"use strict"

const fs = require('fs')
const chai = require('chai')
const should = chai.should()

const ssml = require('../index')
const templates = './templates'

describe('pug-ssml-tests', function() {
  describe('#precompile()', function() {
    const file = 'ssml-speech.js'
    const output = './dist'
    const module = `${output}/${file}`
    const importName = `../${output}/${file}`

    beforeEach(function() {
      // Delete the existing module.
      if (fs.existsSync(module)) {
        fs.unlinkSync(module)
      }

      // Precompile the template.
      ssml.precompile(templates, {
        file: file,
        output: output
      })
    })

    it('should generate a node module', function() {
      should.exist(fs.existsSync(module), `${module} should exist`)
    })
    it('should import the new module', function() {
      const templates = require(importName)
      should.exist(templates)
      should.exist(templates.sentence)
      should.exist(templates.using_mixin)
    })
    it('execute a variety of templates', function() {
      const templates = require(importName)
      let result

      // sentence
      result = templates.sentence()
      should.exist(result)
      result.should.equal('<s>This is a simple speech sentence.</s>')

      // using_mixin
      result = templates.using_mixin()
      should.exist(result)
      result.should.equal('<s>This is a test of a template that is<prosody volume="loud">using a mixin!</prosody></s>')

      // paragraphs
      result = templates.paragraphs()
      should.exist(result)
      result.should.equal('<p>This is paragraph one.</p><p>This is paragraph two.</p><p>This is paragraph three.</p>')

      // using variables
      result = templates.using_variables({variable: true})
      should.exist(result)
      result.should.equal('<s>This is a template using a variable here: true</s>')

      // using helper
      result = templates.using_helper({'helper': () => { return true } })
      should.exist(result)
      result.should.equal('<s>This is a template using a helper here: true</s>')
    })

  })
})