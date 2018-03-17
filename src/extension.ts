'use strict';

import * as vscode from 'vscode';
import {lightningLinter} from './lib/lightningLinter';
import {Config} from './lib/config';
import * as Path from 'path';

export function activate(context: vscode.ExtensionContext) {

    //setup config
    let config = new Config();
    const collection = vscode.languages.createDiagnosticCollection('lightningLinter');
    const outputchannel = vscode.window.createOutputChannel('lightningLinter');

    //setup commands
    context.subscriptions.push(
         vscode.commands.registerCommand('lightningLinter.showOutput', () => {
            outputchannel.show();
        })
    );

    const linter = new lightningLinter(outputchannel, config.ignoreWarnings);

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

