# Common server and client code for Coect projects

[![Build Status](https://travis-ci.org/dogada/coect.svg)](https://travis-ci.org/dogada/coect)

Server-side code is located at `server/`.

Client-side code is located at `client/`.

It's expected that `jQuery` and `Site` (from `coect-site`) available globally,
rest of modules are processed with [Browserify](http://browserify.org/).

All UI is made from small [RiotJs](http://riotjs.com/) React-like components.
Each component manages own html, javascript and css. Examples of such components
you can see at `coect-umedia` and other Coect-based apps.

[page.js](https://visionmedia.github.io/page.js/) is used for url routing at the
moment. `page.js` works well but we may migrate to built-in RiotJs router added
in 2.3 version.

[Bootstrap 3](http://getbootstrap.com/) is used as CSS-framework. We use
LESS at the moment but there is a plan to move most of styles inside RiotJs
components.

More info about Coect technology you can find on
[www.coect.net](http://www.coect.net) and in my blog at
[dogada.org](https://dogada.org) (works on `coect-umedia` actually).


Copyright (C) 2015 Dmytro V. Dogadailo

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.
