0.5.0 / 2015-xx-yy
------------------
- moved from `localStorage` to `obsidian/keys.db` to store keys

0.4.0 / 2015-07-06
------------------
- changed add stealth address icon
- add tooltips on side menu buttons
- changed copy stealth address icon
- added type-ahead support for pseudonyms
- logging
- refactored config file handling to improve Linux support
- upgraded build process (uses latest Electron version. Bumps to `v0.29.1` from `v0.21.2`)
- resize main window to fix issue on Windows
- bug fix on fetching old blocks if upgrading without pseudonym support

0.3.0 / 2015-06-01
----------------------
- converted to [JavaScript Standard Style](https://github.com/feross/standard)
- upgrade React.js to 0.13
- restructured code
- removed Browserify and associated libraries
- upgraded `react-bootstrap`
- pseudonym registry

0.2.2 / 2015-04-11
------------------
- button to show debug window

0.2.1 / 2015-03-31
------------------
- bugfix if `OP_RETURN` payload is not 33 bytes, causes an error
- included Linux build

0.2.0 / 2015-03-30
------------------
- builds now include icon
- supports multiple languages: English, Spanish, and Chinese (simplified)
- bugfix if receiver input had whitespace, would cause error

0.1.0 / 2015-03-16
------------------
- full stealth sending / receiving support
- new logo integrated

0.0.3 / 2015-01-12
------------------
- BlackCoin-qt integration
- livereload

0.0.2 / 2014-12-28
------------------
- changed color scheme to black and gold
- produced runnable builds for both Windows and Mac OS X
- made accounts persistent
- amounts update on startup
- generate raw txs (unfortunately can't send since BlackCoin explorers don't support push)

0.0.1 / 2014-12-21
------------------
- initial structure of code setup
- create simple accounts
- connect to BlackCoin network via `http://blkchain.info`
