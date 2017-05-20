'use strict';

import * as vscode from 'vscode';
import {lightningLinter} from './lib/lightningLinter';
import {Config} from './lib/config';
import * as Path from 'path';

export function activate(context: vscode.ExtensionContext) {

    //setup config
    let config = new Config();
    // if(config.useDefaultRuleset){
    //     config.rulesetPath = context.asAbsolutePath(path.join('rulesets', 'apex_ruleset.xml'));
    // }
    //setup instance vars
    const collection = vscode.languages.createDiagnosticCollection('lightningLinter');
    const outputchannel = vscode.window.createOutputChannel('lightningLinter');

    //setup commands
    context.subscriptions.push(
         vscode.commands.registerCommand('lightningLinter.showOutput', () => {
            outputchannel.show();
        })
    );

    const linter = new lightningLinter(outputchannel, config.Path, config.ignoreWarnings);

    context.subscriptions.push(
        vscode.commands.registerCommand('lightningLinter.runWorkspace', () => {
            linter.run(vscode.workspace.rootPath, collection);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('lightningLinter.runFile', (fileName: string) => {
            if(!fileName){
                fileName = vscode.window.activeTextEditor.document.fileName;
            }
            linter.run(fileName, collection);
        })
    );

    //setup listeners
    if(config.runOnFileOpen){
        vscode.workspace.onDidSaveTextDocument((textDocument) => {
            if(textDocument.languageId == 'javascript'){
                return vscode.commands.executeCommand('lightningLinter.runFile', textDocument.fileName);
            }
        });
    }

    if(config.runOnFileSave){
        vscode.workspace.onDidOpenTextDocument((textDocument) => {
            if(textDocument.languageId == 'javascript'){
                return vscode.commands.executeCommand('lightningLinter.runFile', textDocument.fileName);
            }
        });
    }

    vscode.workspace.onDidCloseTextDocument((textDocument) => {
        collection.delete(textDocument.uri);
    });
}

export function deactivate() {}

