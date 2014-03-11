pickyImg
========
For loading different versions of images based on venue, lazy loading and all that. By default, it uses UAjammer's venue attribute to decide which src to load - not window width. BUT you can override that and roll your own logic if you like.


setup :
-----------
- requires: jQuery, [UAjammer](https://github.com/beechertrouble/UAjammer)
	- UAjammer necessary to determine venue - unless you pass your own logic for venue -> data-src mapping -OR- pass <code>whichSrc</code> as an arg.
	- see 'SRC Logic' below for more details.


markup :
-----------
- some element with <code>data-src-...</code> options.
	- must at least specify a <code>data-src-default</code>  
- wrap should contain a noscript tag with the default image in it.
- something like this :
```
<div class="_picky" data-class="classes-to-be-applied-to-loaded-image" 
	data-src-default="path/to/default.jpg" 
	... other data-srcs here ... >
	<noscript><img src="path/to/default.jpg" /></noscript>
</div>
```
- for responsive/liquid images :
	- you'll need some css (see 'fancy' below')
	- reccommend you use the padding-top method
		- example 4/3 image :
```
<div class="_picky" style="padding-top:75%;"
	... >
	<noscript><img src="path/to/default_4_3.jpg" /></noscript>
</div>
```
	

usage :
-----------
- <code> _pickyImg.init()</code>

customization :
-----------
 - optional args for `init()` :
```javascript
 var args = { // all of these are optional...
 		selector : '._picky', // selector to use for bindings, defaults to '._picky' ...
 		pad : 0, // defaults to window height... *
 		whichSrc : 'data-src-to-use', // defaults to choosing based on UAjammer venue ** -OR- 'data-src-default' when no UAjammer is present...
 		srcMap : function(){...}, // must return the 'data-src' attribute to use, defaults to using UAjammer and default logic ** ...
 		bindMe : true, // use defualt binding, defaults to true *** ...
 		callbacks : {...} // you can pass funtions for certain callbacks **** ...
 	};
 _pickyImg.init(args);
```

fancy :
-----------
- use the included css to things like spinners, slick fade-ins and whatnot,
- OR - roll your own using the reserved classes :
	- `_picky_picking`
	- `_picky_picked`
- you want to load into a background-image?
	- ok - just give your picky element the `_picky_bg` class



* padding :
-----------	
- This is for when to consider an element 'in-view' - i.e. when to load the src.
- Applied both above and below the element's position.
- Defaults to 1 window height.


** SRC Logic :
-----------
- this is responsible for choosing the right image src to load - and sets the <code>whichSrc</code> var
- default logic is based on UAjammer venue :
```javascript
switch(true) {
	
	case(UA.Venue == 'phone'):
		chosenSrc = UA.Pixels >= 2 ? 'data-src-phonex2' : 'data-src-phone';
		break;
	
	case(UA.Venue == 'tablet'):
		chosenSrc = UA.Pixels >= 2 ? 'data-src-tabletx2' : 'data-src-tablet';
		break;
		
	case(UA.Venue == 'desktop'):
		chosenSrc = UA.Pixels >= 2 ? 'data-src-desktopx2' : 'data-src-desktop';
		break;
						
}
```

*** default binding :
-----------
- Ceates a more efficient event (wStopped) to detect window scroll and resize (both of which fire more then we need). The wStopped event is triggered 150ms after a user has stopped scrolling/resizing the window. This results in smoother scrolling and possibly less power consumption.
- When wStopped is triggered, picky images that haven't been loaded and are in-view ttry to load their whichSrc.




**** Callbacks :
-----------
- callbacks can be passed in the args as an object -i.e. :
```javascript
 var args = { // optional...
 		callbacks : {
 			init : function(){...}, // fires at end of init() ...
			picking : function(){...}, // fires just before picking - which defaults to the custom event of wStopped *** ...
			finished : function(){...} // fires when there are no more un-picked images ...
 		}
 	};
 _pickyImg.init(args);
```


to do :
-----------
- option for image reload in window resize?
- option for factoring in 
- revisit requirements