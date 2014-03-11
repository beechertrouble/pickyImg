pickyImg
========
loading different versions of images based on venue, lazy load and all that.


setup :
-----------
- requires: jQuery, [UAjammer](https://github.com/beechertrouble/UAjammer)
	- * UAjammer necessary to determine veniew - unless you pass your own logic for venue -> data-src mapping or pass <code>whichSrc</code> as an arg.


markup :
-----------
- some element with <code>data-src-...</code> options.
	- must at least specify a <code>data-src-default</code>  
- wrap should contain a noscript tag with the default image in it.
- something like this :
	```<div class="_picky_wrap" data-class="classes-to-be-applied-to-loaded-image" data-src-default="path/to/default.jpg" >
	<noscript><img src="path/to/default.jpg" /></noscript>
	</div>

classes, attributes, etc. :
-----------
- ._picky_bg : tells pickImg to load the src in as the background image of the  


to do :
-----------
- mapping in args
- revisit requirements