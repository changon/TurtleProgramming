concurrently \
	'babel --watch src/*.es6 --out-dir=.' \
	'pug --watch --pretty *.pug' \
	'live-server --no-browser'
