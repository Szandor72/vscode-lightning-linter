vscode-linter-lightning
=========================

This VSCODE linter plugin provides
an interface to [the Lightning Linter in the Heroku Toolbelt](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/cli_intro.htm).

##Features
- per file linting on save or open (deviation from default cli behaviour which scans whole directories only)
- will only lint lightning component .js files, no others
- show errors only // ignore warnings

## Installation
### `Toolbelt` installation
Before installing this plugin, you must ensure that `Heroku CLI toolbelt` is installed on your
system. For detailed instructions see [Heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

### Notes for Windows
- please install Ruby before installing Heroku
- Heroku will otherwise install its own instance of Ruby incl PATH vars. These might cause issues
- tested on a Win10 machine with most recent Windows Insider Built

### Plugin installation

Makre sure you `heroku` is added to your PATH. After verifying that `Lightning Linter` works from your terminal, proceed to install the extension. 


### Kudos to
- [Chuck Jonas](https://github.com/ChuckJonas) 
- [VSCode Apex PMD](https://github.com/ChuckJonas/vscode-apex-pmd) - from which I learned how to build this. 
- The Heroku Lightning Team
