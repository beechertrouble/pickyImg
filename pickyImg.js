/** 
* pickyImg (https://github.com/beechertrouble/pickyImg) 
* a venue-based img loader ...
* by beechertrouble (http://beechbot.com)
* v0.0.1
* needs jQuery, and maybe UAjammer to work ...
*/
var _pickyImg = (function _pickyImg(W, $) {
	
	var ME = this,
		UA = W._UAjammer !== undefined ? W._UAjammer : undefined,
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
		binder, wStopped, pickMe, isFinished, defMap
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
		pad = args.pad || $(W).height();
		whichSrc = args.whichSrc || 'data-src-default';
		srcMap = args.srcMap || undefined;
		selector = args.selector || '._picky';
		bindMe = args.bindMe !== undefined ? args.bindMe : true;
		callbacks = {
			init : args.init || null,
			picking : args.picking || null,
			finished : args.finished || null
		};
				
		whichSrc = typeof srcMap == 'function' ? srcMap() : defMap();		
		
		if(bindMe)
			binder();
		
		ME.doCallback('init');
		
	};
	
	defMap = function() {
		
		if(UA === undefined || args.whichSrc !== undefined)
			return whichSrc;
			
		var chosenSrc = whichSrc;
		
		switch(true) {
			
			case(UA.Venue == 'phone'):
				chosenSrc = UA.Pixels >= 2 ? 'data-src-phonex2' : 'data-src-phone';
				break;
			
			case(UA.Venue == 'tablet'):
				chosenSrc = UA.Pixels >= 2 ? 'data-src-tabletx2' : 'data-src-tablet';
				break;
				
			case(UA.Venue == 'desktop'):
				chosenSrc = UA.Pixels >= 2 ? 'data-src-desktopx2' : 'data-desktop';
				break;
								
		}
		
		return chosenSrc;
			
	};
	
	binder = function() {
					
		$(W).on('scroll resize', function() {
			
			wIsStopped = false;
			clearTimeout(wChangeTimer);
			wChangeTimer = setTimeout( wStopped , 150 );
				
		});
		
		$('body')
			.on('wStopped', selector + ":not(._picky_picked)", function() {
													
				ME.doCallback('picking');
				
				$(W).trigger('picky_picking');
				$('body').removeClass('_picky_finished');
				pickMe($(this));
				
			});
		
		// trigger first run ...
		wStopped();
		
	};
	
	wStopped = function() {
		
		wIsStopped = true;
		$(W).trigger('wStopped');
		$('body *').trigger('wStopped');
		
	};
	
	pickMe = function(dummy) {
				
		if(dummy.inView(pad) && !dummy.hasClass('._picky_picking')) {
						
			dummy.addClass("_picky_picking");
							
			var no_script = dummy.find('noscript'),
				src = dummy.attr(whichSrc), 
				img = new Image(), 
				imgClass = dummy.attr('data-class'),
				imgAlt = dummy.attr('data-alt'),
				imgLoad_handler;

			imgLoad_handler = function() {
				
				if(dummy.is('._picky_bg')) {
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
			
			dummy.attr('data-pref-src', src);
			img.src = 	src;
		
		}
		
	};
	
	isFinished = function() {
				
		if($(selector + ":not(._picky_picked)").length <= 0) {
			$('body').addClass('_picky_finished');
			$(W).trigger('picky_finished');
			ME.doCallback('finished');
		}
		
	};	
	
	return this;
		
}(window, jQuery));