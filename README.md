
### Available Mixins

There are many defined that are automatically available to your templates.
Below is an example of using loud.  Note that there is no space after the
plus symbol.

    //  Loud speech sentence.
    s This is some
      +loud loud speech!
    
Tags and plugins can be nested to form unqiue speech sounds.

    // Loud and fast speech sentance.
    s This is some
      +loud
        +fast
          loud and fast speech!
          
          
### Template Names

Templates with dashes in the names are automatically converted to underscores in the JavaScript output.

### Spacing

Pug ignores much of the whitespace within templates.  See the following link for more details.

https://pugjs.org/language/plain-text.html#whitespace-control

The safest way to ensure a space is added within your template is to add a newline using a pipe.

    p Paragraph one text.
    |
    p Paragraph two text.
    
Note that in this case the space was not needed because each of the paragraphs is embedded within 
an element.    

    
    
In most cases this is not an issue because spaces are assumed by SSML in many cases.

> A simple English example is "cup<break/>board"; outside the token and w elements, 
> the synthesis processor will treat this as the two tokens "cup" and "board" rather
> than as one token (word) with a pause in the middle. Breaking one token into multiple
> tokens this way will likely affect how the processor treats it.

See the following link for additional details.

https://www.w3.org/TR/speech-synthesis11/

### pug ssml cli

There is not currently a CLI tool available for this project. If demand warrants it I will create one.

    node 