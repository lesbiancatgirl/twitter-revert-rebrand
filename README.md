# Twitter Revert Rebrand

A Chrome extension to revert the Twitter UI to the pre-Musk era

## Installation

Since the extension is not on the Chrome webstore, you can install it by loading it as an unpacked extension

### Github release

1. Download the [latest release](https://github.com/lesbiancatgirl/twitter-revert-rebrand/releases/latest)
2. Extract the contents of the zip into any folder
3. Open your browser's extensions page (`chrome://extensions` or similar)
4. Enable developer mode, click "load unpacked" and select the folder containing the `manifest.json` file

### Build from source

1. Install [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org)
2. Run `git clone https://github.com/lesbiancatgirl/twitter-revert-rebrand` from the terminal to clone the repo into a new folder
3. Inside the folder, run `npm i` to install all the dependencies, then `npm run build` to build
4. Open your browser's extensions page
5. Enable developer mode, click "load unpacked" and select the "dist" folder
6. Run `git pull` to update at any time (you will have to rebuild afterwards)

## Credits

Inspired by [cygaar/old-twitter](https://github.com/cygaar/old-twitter) (no longer maintained)
