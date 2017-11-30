"use strict"

const fs = require('fs')
const chai = require('chai')
const should = chai.should()

const ssml = require('../index')
const templatesPath = './templates'

describe('pug-ssml-tests', function() {
  describe('#precompile()', function() {
    const file = 'ssml-speech.js'
    const output = './dist'
    const module = `${output}/${file}`
    const importName = `../${output}/${file}`
    let templates

    before(function() {
      // Delete the existing module.
      if (fs.existsSync(module)) {
        fs.unlinkSync(module)
      }

      // Precompile the template.
      ssml.precompile(templatesPath, {
        file: file,
        output: output
      })

      // Require the module.
      templates = require(importName)
      should.exist(templates)
    })

    it('should render s', function() {
      should.exist(templates.sentence)
      const result = templates.sentence()
      should.exist(result)
      result.should.equal('<s>This is a simple speech sentence.</s>')
    })
    it('should render a mixin', function() {
      should.exist(templates.using_mixin)
      const result = templates.using_mixin()
      should.exist(result)
      result.should.equal('<s>This is a test of a template that is<prosody volume="loud">using a mixin!</prosody></s>')
    })
    it('should render a p', function() {
      should.exist(templates.paragraphs())
      const result = templates.paragraphs()
      should.exist(result)
      result.should.equal('<p>This is paragraph one.</p><p>This is paragraph two.</p><p>This is paragraph three.</p>')
    })
    it('should render variables', function() {
      should.exist(templates.using_variables)
      const result = templates.using_variables({variable: true})
      should.exist(result)
      result.should.equal('<s>This is a template using a variable here: true</s>')
    })
    it('should render a helper', function() {
      should.exist(templates.using_helper)
      const result = templates.using_helper({'helper': () => { return true } })
      should.exist(result)
      result.should.equal('<s>This is a template using a helper here: true</s>')
    })
    it('should render whisper', function() {
      should.exist(templates.whispered)
      const result = templates.whispered()
      should.exist(result)
      result.should.equal('<s><amazon:effect name="whispered">This is a whispered sentence.</amazon:effect></s>')
    })
    it('should render weak-break', function() {
      should.exist(templates.weak_break)
      const result = templates.weak_break()
      should.exist(result)
      result.should.equal('<s><break strength="weak">This is a weak sentence.</break></s>')
    })

  })

})