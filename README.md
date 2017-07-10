vscode-linter-lightning
=========================

This VSCODE linter plugin provides
an interface to [the Lightning Linter in the Heroku Toolbelt](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/cli_intro.htm) or in alternative to [Salesforce DX CLI](https://developer.salesforce.com/tools/sfdxcli).

## Features
- per file linting on save or open (deviation from default cli behaviour which scans whole directories only)
- will only lint lightning component .js files, no others
- show errors only // ignore warnings

## Installation
### `Toolbelt` installation
Before installing this plugin, you must ensure that `Heroku CLI toolbelt` is installed on your
system. For detailed instructions see [Heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

If you instead want to run Salesforce DX make sure to install [the CLI from here](https://developer.salesforce.com/tools/sfdxcli).

### Notes for Windows
- please install Ruby before installing Heroku
- Heroku will otherwise install its own instance of Ruby incl PATH vars. These might cause issues
- tested on a Win10 machine with most recent Windows Insider Built

### Notes for Mac
- initial release did not support Mac, it does now.

### Plugin installation

Makre sure you `heroku` is added to your PATH. After verifying that `Lightning Linter` works from your terminal, proceed to install the extension. 


### Kudos to
- [Chuck Jonas](https://github.com/ChuckJonas) 
- [VSCode Apex PMD](https://github.com/ChuckJonas/vscode-apex-pmd) - from which I learned how to build this. 
- The Heroku Lightning Team
- [René Winkelmeyer](https://twitter.com/muenzpraeger) for adding Salesforce DX CLI Support
