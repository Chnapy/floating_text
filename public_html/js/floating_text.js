
/**
 * JQuery is required !
 * 
 */
window.jQuery || alert("Floating_text can't work : JQuery is not present !");

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
 * //Will search all floating_text in body and his children and apply floating to them
 * //It's identical to FLOATING_TEXT.float($('body'));
 * FLOATING_TEXT.float();
 * 
 * //Will search all floating_text in .element and his children and apply floating to them
 * //If .element has class floating_text, it will apply to him too
 * FLOATING_TEXT.float($('.element'));
 * 
 */

var FLOATING_TEXT = {
	
	//Variables used by HTML, JS, and SCSS
	//In case of chnage, please report them to concerned files
	class: 'floating_text',
	class_active: 'run-animation',
	char_dom: 'span',
	char_class: 'floating_text_char',
	
	//Only function to call
	float: function (dom, with_children) {
		if (arguments.length === 0) {
			return FLOATING_TEXT.float($('body'), true);
		}

		var classes = '.' + FLOATING_TEXT.class + '.' + FLOATING_TEXT.class_active;

		if (with_children) {
			$(dom).find(classes).each(function () {
				FLOATING_TEXT.float(this, false);
			});
		}

		if (!$(dom).is(classes))
			return;

		FLOATING_TEXT.apply_floating_text(dom);
	},
	
	//You don't have to call it
	//But you can do it, only if you know what you do
	apply_floating_text: function (dom) {

		var old_txt = $(dom).text();
		var txt = "";

		for (var i = 0; i < old_txt.length; i++) {
			if (' \t\n\r\v'.indexOf(old_txt[i]) > -1) {
				txt += old_txt[i];
				continue;
			}
			txt += "<" + FLOATING_TEXT.char_dom + " class='" + FLOATING_TEXT.char_class + "'>"
					+ old_txt[i]
					+ "</" + FLOATING_TEXT.char_dom + ">";
		}

		$(dom).html(txt);

		var jqElement = $(dom).find('.' + FLOATING_TEXT.char_class).first();
		var count = 0;
		jqElement.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (event) {
			count++;
			if (count >= 8) {
				count = 0;
				$(dom).removeClass("run-animation");
				void dom.offsetWidth;
				$(dom).addClass("run-animation");
			}
		});
	}
};