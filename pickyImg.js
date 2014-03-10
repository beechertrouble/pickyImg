/** 
* v1.00
* progressive img loader ...
* needs UAjammer to work ...
*/
var _pickyImg = function _pickyImg(args) {
	
	var ME = this,
		args = args || {},
		W = window,
		pad = args.pad || $(W).height(),
		wChangeTimer,
		wIsStopped = true,
		whichSrc,
		origin = {},
		callbacks = {
			init : args.init || null,
			picking : args.picking || null,
			finished : args.finished || null
		},
		// methods
		init, binder, wStopped, pickMe, isFinished
		;
			
	init = function() {
		
		// defaults ...
		switch(true) {
			
			case(_UAjammer.Venue == 'phone'):
				whichSrc = _UAjammer.Pixels >= 2 ? 'data-680' : 'data-340';
				break;
			
			// @todo : revisit who gets retina ? ... 
			case((_UAjammer.Venue == 'tablet' || _UAjammer.Venue == 'desktop') && _UAjammer.Pixels >= 2):
				whichSrc = 'data-1880';
				break;
				
			case(_UAjammer.Venue == 'desktop'):
			case(_UAjammer.Venue == 'tablet'):
			default:
				whichSrc = 'data-960';
				break;
								
		}
		
		$(document).ready(function() {
			
			binder();
			
		});	
		
		ME.doCallback('init');
		
	};
	
	ME.doCallback = function(event) {
				
		var func = callbacks[event];
			
		if(func !== undefined && typeof callbacks[event] == 'function')
			func();
			
	};
	
	binder = function() {
					
		$(W).on('scroll resize', function() {
			
			wIsStopped = false;
			clearTimeout(wChangeTimer);
			wChangeTimer = setTimeout( wStopped , 150 );
				
		});
		
		$('body')
			.on('wStopped', "._picky:not(._picky_picked)", function() {
													
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
				
		if(dummy.inView(pad) && !dummy.is('._picky_picking')) {
						
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
				
		if($("._picky:not(._picky_picked)").length <= 0) {
			$('body').addClass('_picky_finished');
			$(W).trigger('picky_finished');
			ME.doCallback('finished');
		}
		
	};
	
	// jam it ...
	if(args.immediately === undefined || args.immediately)
		init();	
		
};