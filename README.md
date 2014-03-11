pickyImg
========
loading different versions of images based on venue, lazy load and all that.


setup :
-----------
- requires: jQuery, [UAjammer](https://github.com/beechertrouble/UAjammer)
	- * UAjammer necessary to determine veniew - unless you pass your own logic for venue -> data-src mapping or pass <code>whichSrc</code> as an arg.
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

usage :
-----------


customization :
-----------
 - optional args for `init()` :
```
 var args = { // all of these are optional...
 		selector : '._picky', // selector(s) to use for bindings, defaults to '._picky'
 		pad : 0, // defaults to window height
 		whichSrc : 'data-src-to-use', // defaults to choosing based on UAjammer venue ** OR 'data-src-default' when no UAjammer is present
 		srcMap : function, // defaults to using UAjammer and default logic **
 		callbacks : {...} // you can pass funtions for certain callbacks ***
 	};
 _pickyImg.init(args);
```

** SRC Logic :
-----------


*** Callbacks :
-----------


to do :
-----------
- revisit requirements