pickyImg
========
loading different versions of images based on venue, lazy load and all that.


setup :
-----------
- requires: jQuery, [UAjammer](https://github.com/beechertrouble/UAjammer)*, [jQuery.inView](https://github.com/beechertrouble/inView)**
	- *unless you pass your own logic for venue -> data-src mapping or pass <code>whichSrc</code> as an arg.
	- **

markup :
-----------
- some element with <code>data-src-...</code> options.
	- must at least specify a <code>data-src-default</code>  
- wrap should contain a noscript tag with the default image in it.
- something like this :
	- <code><div class="_picky_wrap" data-src-default="path/to/default.jpg" ><noscript><img src="path/to/default.jpg" /></noscript></div></code>


to do :
-----------
- mapping in args
- revisit requirements