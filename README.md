# floating_text
v0.2

Very little library for render text floating with only Javascript and JQuery. So **it requires JQuery**.

GIFs are better than words :

![alt tag](readme_img/float_general.gif)
![alt tag](readme_img/slower.gif)
![alt tag](readme_img/slow.gif)
![alt tag](readme_img/boiling.gif)
![alt tag](readme_img/out.gif)

## How to use

### Include file

First you have to include in your HTML the following files:

At the end of `body`
```html
<script src="your_path/floating_text.js"></script>
```

Don't forget to include JQuery **before** this library !
Example:
```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
```

### JS functions

Then, when you want to launch the floating effect (at any moment), you have to launch a javascript function:
```javascript
	FLOATING_TEXT.float();
```
or with parameters
```javascript
	FLOATING_TEXT.float(element, recursive);
```
`element` is a HTML element that you can pick with JQuery.
`recursive` is a boolean that indicate to check children of `element` in addition of him. By default it's set to false;

Note that `FLOATING_TEXT.float();` is exactly like `FLOATING_TEXT.float($('body'), true);`

Floating_text has multiple default values that can be modify with the change functions :
```javascript
	FLOATING_TEXT.changeHTMLvalues({
		FLOAT_CLASS_NAME: 'floating_text',
		FLOAT_CLASS_ACTIVE: 'run-animation',
		CHAR_DOM: 'span',
		CHAR_CLASS_NAME: 'floating_text_char'
	});
	
	FLOATING_TEXT.changeANIMATIONvalues({
		DURATION: 1.0,
		TRANSLATE_VAL: 2.0
	});
	
	FLOATING_TEXT.changeDATAnames({
		DURATION: 'float-duration',
		TRANSLATE_VAL: 'float-translate'
	});
```
You don't have to specify all the attributes. Mention only those that you want change.
**Be sure to call these functions BEFORE the first call of `float()` function !**

You can also use some secondary functions :
```javascript
	FLOATING_TEXT.isInitialized();
	
	FLOATING_TEXT.getVersion();
```
`FLOATING_TEXT.isInitialized()` return a boolean that say if the library is initialized or not. Understand that when it is initialized, you CAN NOT call change functions anymore !

`FLOATING_TEXT.getVersion()` simply return a string containing the actual version of the library.

### HTML data

In HTML your elements have to have the class `floating_text` (class names can be changed) when they are targeted by the `float()` js function.
The class `run-animation` is necessary for animation running, but it can be add (and remove) at any moment to control the running state.
```HTML
		<div class="floating_text run-animation" id="example-1">
			Example1 floating text (duration: 1s/keyframe [default value]) (translate: 2px/keyframe [default value])
		</div>
		
		<div class="floating_text run-animation" id="example-2" data-float-duration='3'>
			Example2 floating text (duration: 3s/keyframe) (translate: 1px/keyframe [default value])
		</div>
		
		<div class="floating_text run-animation" id="example-3" data-float-duration='0.5' data-float-translate='1'>
			Example3 floating text (duration: 0.5s/keyframe) (translate: 1px/keyframe)
		</div>
		
		<div class="floating_text run-animation" id="example-4" data-float-duration='0.25' data-float-translate='1'>
			Example4 floating text (duration: 0.25s/keyframe) (translate: 1px/keyframe)
		</div>
```
Like in this example, we can add **data attributes** in each floating text element. If you don't add them, it just will use the default values (who are changeable).

You can specify the duration of each keyframe with `data-float-duration` and a float value in seconds. And the translate value of each keyframe with `data-float-translate` and a float value in pixels.

Thereby you can specify a different comportment for each element, directly in HTML.

So, download and check the example ! :)
