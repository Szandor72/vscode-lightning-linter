import * as vscode from 'vscode';
import * as ChildProcess from 'child_process'
import * as fs from 'fs';
import * as path from 'path';

export class lightningLinter{
    private _Path: string;
    private _rulesetPath: string;
    private _outputChannel: vscode.OutputChannel;
    private _ignoreWarnings: boolean;

    public constructor(outputChannel: vscode.OutputChannel, Path: string, ignoreWarnings: boolean){
        this._Path = Path;
        this._outputChannel = outputChannel;
        this._ignoreWarnings = ignoreWarnings;
    }

    public run(fileName: string, collection: vscode.DiagnosticCollection){
        //if(!this.checkPath()) return;
        let fullPath = fileName;
        let dirPath = fullPath.substring(0, fullPath.lastIndexOf('\\')+1); 
        let file = fullPath.substring(dirPath.length,fullPath.length);
        let cmd = 'heroku lightning:lint '+dirPath+' --files '+file+' -j';
        
        this._outputChannel.appendLine('Linter Command: ' + cmd);
        //try {
        ChildProcess.exec(cmd, (error, stdout, stderr) => {
            this._outputChannel.appendLine('error:' +  error);
            this._outputChannel.appendLine('stderr:' +  stderr);

            if (stdout && stdout.includes("ruleId")) {
                let resultArray = JSON.parse(stdout);
                let problemsMap = new Map<string,Array<vscode.Diagnostic>>();
                for (let i = 0; i < resultArray[0].result.length; i++) {
                    let result = resultArray[0].result[i];
                    this._outputChannel.appendLine('stderr:' +  JSON.stringify(result));
                    try {
                        let problem = this.createDiagonistic(JSON.stringify(result));
                        if(!problem) continue;
                        if(!this._ignoreWarnings) {
                            if(problemsMap.has(fullPath)) {
                                problemsMap.get(fullPath).push(problem);
                            }else {
                                problemsMap.set(fullPath,[problem]);
                            }
                        } else {
                            if(problem.severity !== vscode.DiagnosticSeverity.Warning){
                                if(problemsMap.has(fullPath)) {
                                    problemsMap.get(fullPath).push(problem);
                                }else {
                                    problemsMap.set(fullPath,[problem]);
                                }
                            }
                        }
                        
                     } catch (ex) {
                         this._outputChannel.appendLine(ex);
                     }
                }
                problemsMap.forEach(function(value, key){
                    let uri = vscode.Uri.file(key);
                    console.log(value);
                    console.log(key);
                    vscode.workspace.openTextDocument(uri).then(doc => {
                    //fix ranges to not include whitespace
                        for(let i = 0; i < value.length; i++){
                            let prob = value[i];
                            let line = doc.lineAt(prob.range.start.line);
                            prob.range = new vscode.Range(
                                            new vscode.Position(line.range.start.line, line.firstNonWhitespaceCharacterIndex),
                                            line.range.end
                                        );
                        }
                        collection.delete(uri);
                        collection.set(uri , value);
                    }, reason => {
                        console.log(reason);
                        //this._outputChannel.appendLine(reason);
                    });
                });
            }        
        });
    }

    createDiagonistic(result: string): vscode.Diagnostic{
        let resultObject = JSON.parse(result);

        //var type = "error";
        //                if (result.severity === 1) {
        //                    type = "warning";
         //               } 
        //format: "Problem","Package","File","Priority","Line","Description","Ruleset","Rule"
       // let parts = line.split(',');
        let lineNum = resultObject.line-1;
        let column = resultObject.column;
        let msg = '';
        if(resultObject.fatal === true) {
            msg += 'FATAL! ';
        }
        msg += resultObject.message;
        

        let level: vscode.DiagnosticSeverity;
        level = vscode.DiagnosticSeverity.Error;
        if (resultObject.severity === 1) {
            level = vscode.DiagnosticSeverity.Warning;
        }
        let problem = new vscode.Diagnostic(
            new vscode.Range(new vscode.Position(lineNum,column),new vscode.Position(lineNum,column)),
            msg,
            level
        );
        problem.source = 'Lightning Linter';
        return problem;
    }

    getFilePath(line: String): string{
        let parts = line.split(',');
        return this.stripQuotes(parts[2]);
    }

    checkPath(): boolean{
        if(this.dirExists(this._Path)){
            return true;
        }
        this._outputChannel.appendLine(this._Path);
        vscode.window.showErrorMessage('Heroku Toolbelt Path not set. Please see Installation Instructions.');
        return false;
    }

    checkRulesetPath(): boolean{
        if(this.fileExists(this._rulesetPath)){
            return true;
        }
        vscode.window.showErrorMessage(`No Ruleset not found at ${this._rulesetPath}. Ensure configuration correct or change back to the default.`);
        return false;
    }

    //=== Util ===
    fileExists(filePath){
        try{
            let stat = fs.statSync(filePath);
            return stat.isFile();
        }catch (err){
            return false;
        }
    }

    dirExists(filePath){
        try{
            let stat = fs.statSync(filePath);
            return stat.isDirectory();
        }catch (err){
            return false;
        }
    }

    stripQuotes(s : string): string{
        return s.substr(1, s.length-2);
    }
}


