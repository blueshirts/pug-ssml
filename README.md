# Pug SSML

Pug SSML is a library for easily generating SSML speech text using the pug templating language.

## Introduction

I started generating a good amount of SSML speech text while writing Alexa
skills. I found it tedious and clumsy to do so with vanilla JavaScript. I did
find a few libraries for generating SSML though most of them utilize function
chaining in order to create speech text. While this can be effective I found 
it problematic when generating nested speech tags. I felt like the Pug 
templating language is an easy solution for generating SSML speech text.  While
I sure this will not be preferable to everyone I found it very easy to work with.

#### Simple Example

A simple example.  All three variations generate roughly the same output.

```xml
s This is a template for a simple sentence.
s.
  This is a template for a simple sentence.
s
  | This is a template for a simple sentence.
```
    
Output:

```xml
<s>This is a template for a simple sentence.</s>
```

#### Better Example

```pug
s
  | This is a sentence with
  prosody volume("loud") loud
  | text embedded within it.
```      

Output:

```xml
<s>This is a sentence with<prosody volume="loud">loud</prosody>text embedded within it.</s>
```
    
#### Hierarchical Example using Provided Mixins.

Here is an example with loud/fast speech embedded in it. This example utilizes
nesting of ssml elements. The ssml elements are generated using mixins provided
by this library to make templates easier to write.

```pug
s
  | This is a sentence with
  +loud
    +fast
      | loud and fast
  | speech embedded within in.
```    

Output:

```xml
<s>
    This is a sentence with
    <prosody volume="loud"><prosody rate="fast">loua and fast</prosody></prosody>
    speech embedded within it.
</s>
```

#### Kitchen Sink

Here is a complex usage.  Refer to the Pug documentation for additional details.

```pug
// This is a comment.

//- This is a comment that won't show up in the template.

//- This is an example logic usage based on a template context.
if someVar
  s Some variable was true: #{someVar}.
else
  s Some variable was false: #{someVar}.
  
//- This is an example of nesting mixins.
s
  +loud
    +fast
      +high
        | This is some loud, fast, and high speech!
        
s
  | You can also pass in #{helper()} functions in the template context.
```
                    
## Usage

#### Install

Install the library as a development dependency.

```bash
npm install pug-ssml --save-dev
```
    
After installing you can use the library to compile Pug templates into a standard Node module.  For example...

#### Create Templates 

Create Pug templates in a ./templates folder.

```pug
//- ./templates/mytemplate.pug
s
  | This is a simple template.
``` 
    
#### Compile Templates

Compile the templates to a Node module using the steps below.  You will
end up with a ssml-speech.js file. At the current time there is no cli
tool though I will create one.  For the time being this simple script
can be run to compile templates to a Node module.  For my current use
I use a Makefile with a simple .js script. You could also easily run it
from Grunt or a similar tool.

```javascript
// Require the tool.
const pug = require('pug-ssml')

// Compile the templates into a Node module.
pug.precompile('./templates', {
    basedir: './node_modules/pug-ssml',
    file: 'ssml-speech.js',
    pretty: false
})
```    
    
#### Require the Module

Require the ssml-speech.js file like any other module.

```javascript
const templates = require('./ssml-speech')
```    
     
#### Run the Template

Invoke a template function.

```Javascript
// A template with no context parameters.
templates.mytemplate()

// A template with context parameters.
const context = {
  someValue: 'A value to pass in.',
  'helper': function() {
    return 'Some helper value!'
  }
}
templates.mytemplate(context)
```

#### Use the Output
   
Use the result text to generate speech.

```javascript
// Send the text to a speech engine.
const text = templates.mytemplate()
this.response.speak(text).listen(text)
```

## Compiler Options

You can pass user options to the precompile function.

```javascript
pug.precompile(template, options)
```    
    
#### Output

The output parameter specifies where the generated module will be created.

```javascript
{
  output: './dist'
} 
```

#### File

The file parameter specifies the name of the generated module.

```javascript
{
  file: 'ssml-speech.js'
}
```

#### compileDebug

If you are concerned about the size of the output module disable debug.
Note that the error messages you will receive may not be helpful with
this option off.  compileDebug is a standard Pug option.

```javascript
const options = {
  compileDebug: false
}
```
    
#### Other Options
    
The Pug library which this pug-ssml is built on top of has many available options.
See the pug reference the other available options.

https://pugjs.org/api/reference.html


## Available Mixins

There are many defined that are automatically available to your templates.
Below is an example of using loud.  Note that there is no space after the
plus symbol.

```pug
//  Loud speech sentence.
s This is some
  +loud loud speech!
```      
    
Tags and plugins can be nested to form unqiue speech sounds.

```pug
// Loud and fast speech sentance.
s This is some
  +loud
    +fast
      loud and fast speech!
```          

See the following file for the supported Mixin definitions.

[Pug SSML Mixins](pug-ssml-mixins.pug)

The templates generally follow the
[Amazon SSML definitions](https://developer.amazon.com/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html).

## Template Names

Templates with dashes in the names are automatically converted to underscores in the JavaScript output.

## Template Spacing

Pug ignores much of the whitespace within templates.  See the following link for more details.

https://pugjs.org/language/plain-text.html#whitespace-control

The safest way to ensure a space is added within your template is to add a newline using a pipe.

```pug
p Paragraph one text.
|
p Paragraph two text.
```
    
Note that in this case the space was not needed because each of the paragraphs is embedded within 
an element.    

In most cases this is not an issue because spaces are assumed by SSML in many cases.

> A simple English example is "cup<break/>board"; outside the token and w elements, 
> the synthesis processor will treat this as the two tokens "cup" and "board" rather
> than as one token (word) with a pause in the middle. Breaking one token into multiple
> tokens this way will likely affect how the processor treats it.

See the following link for additional details.

https://www.w3.org/TR/speech-synthesis11/

## ToDo

alexa
- Add Alexa examples.

cli
- Document how to compile now.
- Create a cli tool for compiling.

Lint
- Look into using pug lint.