// ==ClosureCompiler==
// @output_file_name jquery.superpng.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
 * A png fixing plug-in for IE6
 * 
 * Based on methods found in Supersleight (Drew McLellan) and DD_belated png fix (Drew Diller).
 * Author: James Westgate (2011)
 * http://www.opencomponents.com
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *  
 * Version 1.00
 * 
 * @requires jQuery 1.4
 */

(function($){
	
	var opts;
	var vmlInit = true;
	var regex;
	
	$.fn.superpng = function(settings) {
		
		if (!$.browser.msie || parseInt($.browser.version, 10) > 6) return;
		
		if (opts == null) opts = $.extend({}, {
			cache: true,
			path: 'blank.gif',
			mode: 'auto'  //filter, vml
		}, settings);
		
		//Caching of background images not enabled by default in IE6
		if (opts.cache) document.execCommand('BackgroundImageCache', false, true);
		
		return this.each(function(){
			
			var self = $(this);
			var bg = self.css('background-image');
			var initial = (this.vml === undefined);	
				
			//Background pngs
			if (!initial || (opts.mode !== 'filter' && bg.match(/\.png/i) !== null)) {
				
				var src = bg.substring(5, bg.length-2);
				var repeat = self.css('backgroundRepeat');
				var bgposx = self.css('backgroundPositionX');
				var bgposy = self.css('backgroundPositionY');
				
				self.css('background-image', ['url(', opts.path, ')'].join(''));
				
				//Determine if we use the alpha image method, or the vml method
				if (initial && opts.mode !== 'vml' && bgposx === undefined && bgposy === undefined) {
					self.css('filter', ["progid:DXImageTransform.Microsoft.AlphaImageLoader(src='", src, "', sizingMethod='crop')"].join(''));					
				}
				else {
					
					//Add vml namespace and built-in behaviour
					if (vmlInit) {
				
						vmlInit = false;
										
						//vml behaviour and additional stylesheet code			
						$('head').append('<style media="screen">vml\\:* {behavior:url(#default#vml);} .superpng-vml {position: absolute; top:0; left:0; z-index:0; margin: 0}</style>');
						
						regex = 'px'; // /[^\d]/g;
					}
					
					//Calculate position as percentage of width
					var width = self.width();
					var height = self.height();					
					var position = [parseFloat(bgposx.replace(regex, '') / width), ',', parseFloat(bgposy.replace(regex, '') / height)].join('');
					var style = ['width:', width, 'px; height:', height, 'px'].join('');
					
					//Insert a relative container containing vml
					if (initial) {
						
						//Create vml element and place inside container
						var builder = ['<vml:rect stroked="f" class="superpng-vml" style="', style, '"><vml:fill type="frame" aspect="atmost" src="',
							src, '" position="', position, '"/></vml:rect>'];
						
						//Add to DOM
						self.wrapInner(builder.join(''));
						this.vml = $('.superpng-vml', self); //set a reference to the vml called 'vml'
						
						self.css('background-image', 'url(' + opts.path + ')');
					}
					
					//Update existing vml
					else {
						var fill = this.vml.children(':first');
						this.vml.attr('style', style);
												
						fill.attr('position', position);
					}
				}
			}
			
			//image elements
			else if (self.is('img[src$=png]')){

				var styles = {
					'width': self.width() + 'px',
					'height': self.height() + 'px',
					'filter': ["progid:DXImageTransform.Microsoft.AlphaImageLoader(src='", self.attr('src'), "', sizingMethod='scale')"].join('')
				};
				
				self.css(styles).attr('src', opts.path);
			}

		});
	};

})(jQuery);