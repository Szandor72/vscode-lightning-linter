'use strict';
import * as vscode from 'vscode';

export class Config{
    public runOnFileOpen: boolean;
    public runOnFileSave: boolean;
    public ignoreWarnings: boolean;
    public useSfdx: boolean;

    public constructor(){
        let config = vscode.workspace.getConfiguration('lightningLinter');
        this.runOnFileOpen = config.get('runOnFileOpen') as boolean;
        this.runOnFileSave = config.get('runOnFileSave') as boolean;
        this.ignoreWarnings = config.get('ignoreWarnings') as boolean;
        this.useSfdx = config.get('useSfdx') as boolean;
    }
}