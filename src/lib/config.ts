'use strict';
import * as vscode from 'vscode';

export class Config{
    //public useDefaultRuleset: boolean;
    //public rulesetPath: string;
    public Path: string;
    public runOnFileOpen: boolean;
    public runOnFileSave: boolean;
    public ignoreWarnings: boolean;

    public constructor(){
        let config = vscode.workspace.getConfiguration('lightningLinter');
        //this.useDefaultRuleset = config.get('useDefaultRuleset') as boolean;
        this.Path = config.get('Path') as string; 
        //this.rulesetPath = config.get('rulesetPath') as string;
        this.runOnFileOpen = config.get('runOnFileOpen') as boolean;
        this.runOnFileSave = config.get('runOnFileSave') as boolean;
        this.ignoreWarnings = config.get('ignoreWarnings') as boolean;
    }
}