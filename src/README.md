The `browser`/`renderer` dichotomy was confusing. Fortunately it was changed to `main`/`renderer`.

The folder `main` is in reference to the JavaScript that runs in the context of (Node.js/io.js).
It was formally called `browser`. The folder `renderer` is in reference to the JavaScript that runs
in Chromium.

References:
- https://github.com/atom/electron/pull/1313
- https://github.com/atom/electron/issues/1287
