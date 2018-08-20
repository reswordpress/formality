import el from '../utils/elements'

export default {
  focus() {
		//trigger events
		$(el("field")).click(function() { focusToggle(this); })
		$(el("field", true, " :input")).on("focus", function() { focusToggle(this, true); })
		//toggle focus class on input wrap 
		function focusToggle(field, input = false) {
			$(el("field_focus")).removeClass(el("field_focus", false))
			if(input){
				$(field).closest(el("field")).addClass(el("field_focus", false))
			} else {
				$(field).addClass(el("field_focus", false))
				$(field).find("input, textarea").focus()
			}
		}
		//autofocus first input
		setTimeout(function(){
			$(el("section") + ":first-child " + el("field") + ":first").click();
		}, 1000);
		$(el("field", true, " :input")).on("keyup", function(e) {
			if($(this).val()) {
				$(this).addClass("filled");
			} else {
				if($(this).hasClass("filled")) {
					$(this).removeClass("filled");
				} else if(e.keyCode == 8) {
					$(this).prev("input").focus();
				}
			}
		});
  },
  placeholder() {
		//placeholder as input wrap attribute
		$(el("input") + " :input[placeholder]").each(function(){
			let placeholder = $(this).attr("placeholder")
			$(this).closest(el("input")).attr("data-placeholder", placeholder)
		})
	},
	filled() {
		//trigger events
		$(el("field", true, " :input")).on("change", function() { fillToggle(this); })
		//toggle filled class to input wrap
		function fillToggle(field) {
			const val = $(field).val();
			const name = $(field).attr("name");
			if(val) {
				$(field).closest(el("field")).addClass(el("field_filled", false))
				$(el("nav_list", true, ' li[data-name='+name+']')).addClass("active")
			} else {
				$(field).closest(el("field")).removeClass(el("field_filled", false))
				$(el("nav_list", true, ' li[data-name='+name+']')).removeClass("active");
			}
		}
	},
};