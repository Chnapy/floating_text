

/**
 * 
 * In HTML, example of an element of floating text :
 * <div class="floating_text run-animation">
 *		Example floating text
 * </div>
 * The class "floating_text" is required
 * The class "run-animation" defined if the animation is running or not
 * 
 * You have to launch the floating text in Javascript
 * Regular use :
 * 
 * FLOATING_TEXT.float(element, recursive);
 * 'element' is the element of HTML what you want to apply the floating effect. Basicaly you get it with JQuery.
 * 'recursive' is a boolean value that indicate if you want to apply the effect on the children of 'element'.
 * 
 * Example of use :
 * 
 * //Will search all floating_text in body and his children and apply floating to them
 * //It's identical to FLOATING_TEXT.float($('body'), true);
 * FLOATING_TEXT.float();
 * 
 * //Will search all floating_text in .element and his children and apply floating to them
 * //If .element has class floating_text, it will apply to him too
 * FLOATING_TEXT.float($('.element'), true);
 * 
 * //If .element has class floating_text, it will apply floating to him, else it will do nothing
 * FLOATING_TEXT.float($('.element'), false);
 * 
 * 
 * 
 * You can modify some variables that modify the comportment of floating effect with differents change functions.
 * So please, DON'T MODIFY ANYTHING HERE ! (thanks :D)
 * 
 */
var FLOATING_TEXT = (function () {

	/**
	 * JQuery is required !
	 * 
	 */
	if(!window.jQuery) {
		console.error("Floating_text can't work : JQuery is not present !");
		return;
	}

	/**
	 * 
	 * Private variables
	 * You can't modify them directly
	 * 
	 */

	var version = '0.2';

	var KEYFRAMES_NAMES = [
		"float_top",
		"float_bottom",
		"float_left",
		"float_right",
		"float_left-top",
		"float_right-top",
		"float_left-bottom",
		"float_right-bottom"
	];

	//Default variables used for HTML manipulations
	var HTML_VALUES = {
		FLOAT_CLASS_NAME: 'floating_text',
		FLOAT_CLASS_ACTIVE: 'run-animation',
		CHAR_DOM: 'span',
		CHAR_CLASS_NAME: 'floating_text_char'
	};

	//Default variables used for animation manipulations
	var ANIMATION_VALUES = {
		//Duration, in seconds (float), of each keyframes
		DURATION: 1.0,
		//Translate value, in pixels (float), of each keyframes
		TRANSLATE_VAL: 2.0
//		NBR_ANIMATIONS: 10
	};

	//Default variables used for HTML Data parsing
	var DATA_NAMES = {
		DURATION: 'float-duration',
		TRANSLATE_VAL: 'float-translate'
//		NBR_ANIMATIONS: 'float-nbr-animation'
	};

	//List of animations defined
	var ANIMATION_TRANSLATE_VALUES_USED = [];

	var is_initialized = false;

	//Sheetstyle generated
	var sheet;

	var css_prefix = ['-webkit-', '-moz-', '-o-', '-ms-', ''];

	/**
	 * 
	 * Public functions
	 * 
	 */

	//The main function
	//On the first use, will initialize the floating effect
	//If you want to modify some default variables, be sure to do that before call this function !
	this.float = function (dom, recursive = false) {
		if (arguments.length === 0) {
			return float($('body'), true);
		}

		if (!is_initialized)
			init();

		var classes = '.' + HTML_VALUES.FLOAT_CLASS_NAME + '.' + HTML_VALUES.FLOAT_CLASS_ACTIVE;

		if (recursive) {
			$(dom).find(classes).each(function () {
				float(this, false);
			});
		}

		if (!$(dom).is(classes))
			return;

		apply_floating_text(dom);
	};

	//Return if floating effect is initialized
	this.isInitialized = function () {
		return is_initialized;
	};

	/**
	 * Change the HTML_VALUES variables
	 * BE SURE TO CALL IT BEFORE THE FIRST float() CALL !!! (otherwise an error will occur)
	 * The values variable has to be in this form :
	 * {
	 *	FLOAT_CLASS_NAME: 'value',
	 *	...
	 * }
	 * Put only values what you want to modify !
	 * 
	 */
	this.changeHTMLvalues = function (values) {
		if (isInitialized())
			return error_change("changeHTMLvalues");
		changeValues(HTML_VALUES, values);
	};

	/**
	 * Change the ANIMATION_VALUES variables
	 * BE SURE TO CALL IT BEFORE THE FIRST float() CALL !!! (otherwise an error will occur)
	 * The values variable has to be in this form :
	 * {
	 *	DURATION: value,
	 *	...
	 * }
	 * Put only values what you want to modify !
	 * 
	 */
	this.changeANIMATIONvalues = function (values) {
		if (isInitialized())
			return error_change("changeANIMATIONvalues");
		changeValues(ANIMATION_VALUES, values);
	};

	/**
	 * Change the DATA_NAMES variables
	 * BE SURE TO CALL IT BEFORE THE FIRST float() CALL !!! (otherwise an error will occur)
	 * The values variable has to be in this form :
	 * {
	 *	DURATION: value,
	 *	...
	 * }
	 * Put only values what you want to modify !
	 * 
	 */
	this.changeDATAnames = function (values) {
		if (isInitialized())
			return error_change("changeDATAnames");
		changeValues(DATA_NAMES, values);
	};

	//Return version of the library
	this.getVersion = function () {
		return version;
	};
	
	/**
	 * 
	 * Private functions
	 * You can't call it directly (you don't have to)
	 * 
	 */

	//Return a string that represents the css value of animation-delay
	function getDelays(duration) {
		var delays = "";
		for (var i = 0; i < KEYFRAMES_NAMES.length; i++) {
			if (i !== 0)
				delays += ",";
			delays += (i * duration) + "s";
		}
		return delays;
	}

	//Used by all change functions
	function changeValues(default_values, values) {
		for (var propertyName in values) {
			if (default_values.hasOwnProperty(propertyName)) {
				default_values[propertyName] = values[propertyName];
			}
		}
	}

	//Called when a change function is used after initialization
	function error_change(name_function) {
		var message = "FLOATING_TEXT." + name_function + " : you can't call this function. FLOATING_TEXT is already initialized. Please call " + name_function + " BEFORE the first call of FLOATING_TEXT.float() !";
		console.error(message);
		return null;
	}

	//Initialize floating, create and initialize the stylesheet
	function init() {
		is_initialized = true;

		sheet = new_stylesheet();

		defineSheetFirstRules();
	}

	//Define all first css rules
	function defineSheetFirstRules() {
		var float = "." + HTML_VALUES.FLOAT_CLASS_NAME;
		var chars = float + " ." + HTML_VALUES.CHAR_CLASS_NAME;
		var chars_run = float + "." + HTML_VALUES.FLOAT_CLASS_ACTIVE + " ." + HTML_VALUES.CHAR_CLASS_NAME;
		var chars_not_run = float + ":not(." + HTML_VALUES.FLOAT_CLASS_ACTIVE + ") ." + HTML_VALUES.CHAR_CLASS_NAME;

		addCSSRule(chars_not_run, getCSSRuleWithPrefix('animation-name', 'none !important'));
		addCSSRule(chars, "display: inline-block !important");
		addCSSRule(chars, getCSSRuleWithPrefix('animation-play-state', 'paused'));
		addCSSRule(chars, getCSSRuleWithPrefix('animation-direction', 'alternate'));
		addCSSRule(chars, getCSSRuleWithPrefix('animation-timing-function', 'linear'));
		addCSSRule(chars, getCSSRuleWithPrefix('animation-fill-mode', 'forwards'));

		addCSSRule(chars_run, getCSSRuleWithPrefix('animation-play-state', 'running'));
	}

	//Verify the presence of an animation with his translate value
	//If not exist, create and add it
	function checkSheetKeyframes(translate) {
		if (!(ANIMATION_TRANSLATE_VALUES_USED.includes(translate))) {
			addSheetKeyframes(translate);
			ANIMATION_TRANSLATE_VALUES_USED.push(translate);
		}
	}

	//Add animation of multiple keyframes from translate value
	function addSheetKeyframes(translate) {
		addKeyframeRule(KEYFRAMES_NAMES[0] + '_' + translate, getKeyframeValues(-translate, 0));
		addKeyframeRule(KEYFRAMES_NAMES[1] + '_' + translate, getKeyframeValues(translate, 0));
		addKeyframeRule(KEYFRAMES_NAMES[2] + '_' + translate, getKeyframeValues(0, -translate));
		addKeyframeRule(KEYFRAMES_NAMES[3] + '_' + translate, getKeyframeValues(0, translate));
		addKeyframeRule(KEYFRAMES_NAMES[4] + '_' + translate, getKeyframeValues(-translate, -translate));
		addKeyframeRule(KEYFRAMES_NAMES[5] + '_' + translate, getKeyframeValues(translate, -translate));
		addKeyframeRule(KEYFRAMES_NAMES[6] + '_' + translate, getKeyframeValues(-translate, translate));
		addKeyframeRule(KEYFRAMES_NAMES[7] + '_' + translate, getKeyframeValues(translate, translate));
	}

	//Return keyframes content from translate values
	function getKeyframeValues(translateX, translateY) {
		return {
			'0%': getCSSRuleWithPrefix('transform', 'translate(0,0);'),
			'50%': getCSSRuleWithPrefix('transform', 'translate(' + translateX + 'px,' + translateY + 'px);'),
			'100%': getCSSRuleWithPrefix('transform', 'translate(0,0);')
		};
	}

	//Apply float effect to element
	function apply_floating_text(element) {

		//We get the data attribute
		var dataduration = $(element).data(DATA_NAMES.DURATION),
				datatranslateval = $(element).data(DATA_NAMES.TRANSLATE_VAL)
//				datanbranimation = $(element).data(DATA_NAMES.NBR_ANIMATIONS)
				;

		//We choose between data attribute (if exist) or default values
		var duration = (dataduration === undefined || dataduration === '')
				? ANIMATION_VALUES.DURATION
				: parseFloat(dataduration);
		var translate_val = (datatranslateval === undefined || datatranslateval === '')
				? ANIMATION_VALUES.TRANSLATE_VAL
				: parseFloat(datatranslateval);
//		var nbr_animation = (datanbranimation === undefined || datanbranimation === '')
//				? ANIMATION_VALUES.NBR_ANIMATIONS
//				: parseInt(datanbranimation);

		//We check if keyframes of translate value exists
		//Otherwise it's created
		checkSheetKeyframes(translate_val);

		//We surrounded each character of the element by markers

		var old_txt = $(element).text();
		var txt = "";

		for (var i = 0; i < old_txt.length; i++) {
			//spaces, tabulations and others are ignored
			if (' \t\n\r\v'.indexOf(old_txt[i]) > -1) {
				txt += old_txt[i];
				continue;
			}
			txt += "<" + HTML_VALUES.CHAR_DOM + " class='" + HTML_VALUES.CHAR_CLASS_NAME + "'>"
					+ old_txt[i]
					+ "</" + HTML_VALUES.CHAR_DOM + ">";
		}

		$(element).html(txt);

		//We add of each character element the css animation properties
		var animnames;
		$(element).find('>.' + HTML_VALUES.CHAR_CLASS_NAME).each(function () {
			animnames = getRandomKeyframesNames(translate_val);
			for (var i = 0; i < css_prefix.length; i++) {
				$(this).css(css_prefix[i] + 'animation-name', animnames);
				$(this).css(css_prefix[i] + 'animation-duration', duration + 's');
				$(this).css(css_prefix[i] + 'animation-delay', getDelays(duration));
			}
		});

		var jqElement = $(element).find('>.' + HTML_VALUES.CHAR_CLASS_NAME).first();
		var count = 0;
		jqElement.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
			e.preventDefault;
			count++;
			if (count >= KEYFRAMES_NAMES.length) {
				count = 0;
				$(element).removeClass(HTML_VALUES.FLOAT_CLASS_ACTIVE);
				void element.offsetWidth;
				$(element).addClass(HTML_VALUES.FLOAT_CLASS_ACTIVE);
			}
		});
	}

	//Return string with mixed keyframes names
	function getRandomKeyframesNames(translate_val) {
		var clone_names = KEYFRAMES_NAMES.slice(0);
		var names = '', rand;
		while (clone_names.length > 0) {
			rand = Math.floor(Math.random() * clone_names.length);
			names += clone_names.splice(rand, 1)[0] + '_' + translate_val;
			if (clone_names.length > 0)
				names += ',';
		}
		return names;
	}

	//Create a stylesheet, add it to HTML, and return it
	function new_stylesheet() {
		//Create the <style> tag
		var style = document.createElement("style");

		//WebKit hack
		style.appendChild(document.createTextNode(""));

		//Add the <style> element to the page
		document.head.appendChild(style);

		return style.sheet;
	}

	//Add to stylesheet a keyframe rule
	function addKeyframeRule(name, values) {
		var val = '';
		for (var propertyName in values) {
			val += propertyName + '{' + values[propertyName] + '}';
		}
		for (var i = 0; i < css_prefix.length; i++) {
			try {
				addCSSRule('@' + css_prefix[i] + 'keyframes ' + name, val);
				//Rule added, we can stop
				break;
			} catch (e) {
				//This navigator doesn't support this rule, so we go to the next
			}
		}
	}

	//Add a basic css rule
	function addCSSRule(selector, rules, index = 0) {
		if ("insertRule" in sheet)
			sheet.insertRule(selector + "{" + rules + "}", index);
		else if ("addRule" in sheet)
			sheet.addRule(selector, rules, index);
	}

	//Return a css rule with all css prefix
	function getCSSRuleWithPrefix(key, value) {
		var rule = '';
		for (var i = 0; i < css_prefix.length; i++) {
			rule += css_prefix[i] + key + ':' + value + ';';
		}
		return rule;
	}

	return this;
})();
