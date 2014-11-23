/** 
* pickyImg (https://github.com/beechertrouble/pickyImg) 
* a venue-based img loader ...
* by beechertrouble (http://beechbot.com)
* v0.0.1
* needs jQuery, and maybe UAjammer to work ...
*/
;(function($, _scope) {

	'use strict';
	
	_scope = _scope === undefined ? window : _scope;
	
	/**
	 * for AMD, don't redefine this!  (need to maintain globals and plugins)
	 */
	if (_scope._pickyImg)
		return;
	
	$ = $;
		
	var _w = window,
		_pickyImg = (function() {

		var ME = {},
			UA = _scope._UAjammer !== undefined ? _scope._UAjammer : undefined,
			args,
			pad,
			wChangeTimer,
			wIsStopped = true,
			whichSrc,
			srcMap,
			selector,
			origin = {},
			callbacks = {},
			bindMe,
			// methods
			binder, wStopped, wTrigger, isFinished, defMap, getNoscriptSrc
			;
		
		ME.doCallback = function(event) {
								
			var func = callbacks[event];
				
			if(func !== undefined && typeof callbacks[event] == 'function')
				func();
				
		};
		
		// ....
				
		ME.init = function(initArgs) {
									
			/* inView plugin :: https://github.com/beechertrouble/inView */
			if(!$().inView){$.fn.inView=function(j){var h=false,g=$(window);if(this.length>0){var i=this.offset()===null?0:this.offset().top,f=i+this.height();j=j===undefined?g.height():j;h=((g.scrollTop()+g.height())+j)>=i&&(g.scrollTop()-j)<=f?true:false}return h}};
			
			args = initArgs !== undefined ? initArgs : {};
			pad = args.pad !== undefined ? args.pad : _w.outerHeight;
			whichSrc = args.whichSrc !== undefined ? args.whichSrc : 'src-default';
			srcMap = args.srcMap !== undefined ? args.srcMap : undefined;
			selector = args.selector !== undefined ? args.selector : '._picky';
			bindMe = args.bindMe !== undefined ? args.bindMe : true;
			
			if(args.callbacks === undefined)
				args.callbacks = {};
			
			callbacks = {
				init : args.callbacks.init !== undefined ? args.callbacks.init : null,
				finishedInit : args.callbacks.finishedInit !== undefined ? args.callbacks.finishedInit : null,
				picking : args.callbacks.picking !== undefined ? args.callbacks.picking : null,
				finished : args.callbacks.finished !== undefined ? args.callbacks.finished : null
			};
					
			whichSrc = typeof srcMap == 'function' ? srcMap() : defMap();		
						
			ME.doCallback('init');
			
			if(bindMe)
				binder();
				
			ME.doCallback('finishedInit');
					
		};
		
		defMap = function() {

			if(UA === undefined || srcMap !== undefined)
				return whichSrc;
				
			var chosenSrc = whichSrc;
			
			switch(true) {
				
				case(UA.Venue == 'phone'):
					chosenSrc = UA.Pixels >= 2 ? 'src-phonex2' : 'src-phone';
					break;
				
				case(UA.Venue == 'tablet'):
					chosenSrc = UA.Pixels >= 2 ? 'src-tabletx2' : 'src-tablet';
					break;
					
				case(UA.Venue == 'desktop'):
					chosenSrc = UA.Pixels >= 2 ? 'src-desktopx2' : 'src-desktop';
					break;
									
			}

			return chosenSrc;
				
		};
		
		binder = function() {
									
			$(_w)
				.on('resize._picky', function() {
					wTrigger();
				});
				
			$(document.body)
				.on('scroll._picky', function() {
					wTrigger();
				});
			
			// trigger first run ...
			wStopped();
					
		};
		
		wTrigger = function() {
			
			wIsStopped = false;
			clearTimeout(wChangeTimer);
			wChangeTimer = setTimeout( wStopped , 150 );
			
		};
		
		wStopped = function() {
			
			wIsStopped = true;			
												
			ME.doCallback('picking');
			
			$(_w).trigger('picky_picking');
			$('body').removeClass('_picky_finished');
			$(selector + ':not("._picky_picked")').each(function() {
				ME.pickMe( $(this) );
			});
			
		};
		
		ME.pickMe = function(dummy, which_src, force) {
						
			which_src = which_src === undefined || !which_src ? whichSrc : which_src;
			which_src = which_src.replace('data-', '');
			force = force === undefined ? false : force;
						
			if((!dummy.inView(pad) || dummy.hasClass('_picky_picking') || dummy.hasClass('_picky_picked') && !force)) 
				return; 
																						
			dummy.addClass("_picky_picking");
							
			var no_script = dummy.find('noscript'),
				src = dummy.data(which_src) === undefined ? dummy.data('src-default') : dummy.data(which_src), 
				img = new Image(), 
				imgClass = dummy.data('class'),
				imgAlt = dummy.data('alt'),
				imgLoad_handler;	
			
			src = src !== undefined ? src : getNoscriptSrc(dummy);
			
			imgLoad_handler = function() {
				
				if(dummy.hasClass('_picky_bg')) {
					dummy.css({'background-image' : 'url(' + src + ')'});
				} else {
					dummy.prepend($(this));
				}
				
				if(_UAjammer.Browser.Name == 'msie' && _UAjammer.Browser.Version <= 8) 
					$(this).height( ($(this).height() * $(this).width() ) / this.width);

				$(this).removeClass('_picky_picking').attr('alt', imgAlt);
				setTimeout(function(){
					dummy.removeClass('_picky_picking').addClass('_picky_picked');
					isFinished();
				}, 10);
				
			};
			
			// add the loading classes before we even start ...
			$(img).addClass(imgClass).addClass('_picky_picking');

			// test to see if there is already an image that is trying to load this src ...
			if (!origin[src]) {
				
				// store the hash
				origin[src] = img;
				
				// do stuff when it loads
				img.onload = imgLoad_handler;
											
			} else {
				
				// listen for that first image to load bind that to our current image ...
				var originimg = $(origin[src]);
				
				// see if it's loaded already ...
				if (originimg.hasClass('_picky_picked')) {
					originimg.on('load', imgLoad_handler.bind(img));
				// call immediately ...
				} else {
					imgLoad_handler.bind(img)();
				}
			}
			
			dummy.data('pref-src', src);
			img.src = 	src;
						
		};
		
		getNoscriptSrc = function(dummy) {
			
			var noscript = dummy.find('noscript')[0];
			return $(noscript).html().match(/src="([^"]+)"/)[1];
			
		};
		
		isFinished = function() {
					
			if($(selector + ":not(._picky_picked)").length <= 0) {
				$('body').addClass('_picky_finished');
				$(_w).trigger('picky_finished');
				ME.doCallback('finished');
			}
			
		};	
		
		return ME;
			
	})();
	
	/**
	 * Apply the ikelos function to the supplied scope (window)
	 */
	_scope._pickyImg = _pickyImg;

})((jQuery || $), (typeof scope == 'undefined' ? window :  scope));

/**
 * Expose fingaFingaz as an AMD
 */
if (typeof define === "function") {
	define("_pickyImg", [], function () { return _pickyImg; } );
}