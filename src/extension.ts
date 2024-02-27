import { TIMEOUT } from "dns";
import path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "typescript-toolbox.implement-interface",
    async (e) => {
      const destinationPath = getDestinationPath(e);
      const className = path.basename(destinationPath, ".ts");
      const newContent = await buildClassContent(e, className);
      createFile(destinationPath, newContent).then((newFileUri) => {
        vscode.workspace.openTextDocument(newFileUri).then((document) => {
          vscode.window.showTextDocument(document).then(async (editor) => {
            setTimeout(async () => {
              quickFixAddImport(document);
              setTimeout(async () => {
                await quickFixGenerateStubs(document);
                vscode.window.showInformationMessage("Implemented!");
              }, 1000);
            }, 5000);
          });
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

function getDestinationPath(sourceUri: vscode.Uri): string {
  const interfaceExtName = path.extname(sourceUri.path);
  const interfaceFileName = path.basename(sourceUri.path, interfaceExtName);
  const interfaceDirPath = path.dirname(sourceUri.path);
  const targetPath = path.join(
    interfaceDirPath,
    `${interfaceFileName}Impl${interfaceExtName}`
  );
  return targetPath;
}

function createFile(targetPath: string, content: string): Promise<vscode.Uri> {
  const targetUri = vscode.Uri.file(targetPath);

  return new Promise<vscode.Uri>((resolve, reject) => {
    try {
      const contentCodePoints = content
        .split("")
        .map((char) => char.charCodeAt(0));
      const contentByteArray = new Uint8Array(contentCodePoints);

      vscode.workspace.fs.writeFile(targetUri, contentByteArray).then(() => {
        resolve(targetUri);
      });
    } catch (err) {
      console.log(err);
    }
  });
}

async function buildClassContent(interfaceFile: vscode.Uri, className: string) {
  const document = await vscode.workspace.openTextDocument(interfaceFile);

  const firstLineWords = document.lineAt(0).text.split(" ");
  const interfaceName = firstLineWords.find(
    (val, index) => firstLineWords[index - 1] === "interface"
  );

  let newContent = `export class ${className} implements ${interfaceName}{}`;

  return newContent;
}

function quickFixGenerateStubs(document: vscode.TextDocument): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const rangeStart = document.getText().indexOf("class") + 7;
      const startPosition = document.positionAt(rangeStart);
      const range = new vscode.Range(startPosition, startPosition);

      const codeActions = await vscode.commands.executeCommand(
        "vscode.executeCodeActionProvider",
        document.uri,
        range
      );
      if (codeActions && Array.isArray(codeActions)) {
        codeActions.forEach(async (codeAction) => {
          if (codeAction.title.startsWith("Implement interface")) {
            await vscode.workspace.applyEdit(codeAction.edit);
            await vscode.commands.executeCommand(
              codeAction.command.command,
              ...codeAction.command.arguments
            );
            resolve();
          }
        });
      }
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

function quickFixAddImport(document: vscode.TextDocument): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const rangeStart = document.getText().indexOf("implements") + 12;
      const positionStart = document.positionAt(rangeStart);
      const range = new vscode.Range(positionStart, positionStart);

      const codeActions = await vscode.commands.executeCommand(
        "vscode.executeCodeActionProvider",
        document.uri,
        range
      );
      if (codeActions && Array.isArray(codeActions)) {
        codeActions.forEach(async (codeAction) => {
          if (codeAction.title.startsWith("Add import from")) {
            await vscode.workspace.applyEdit(codeAction.edit);
            await vscode.commands.executeCommand(
              codeAction.command.command,
              ...codeAction.command.arguments
            );
            resolve();
          }
        });
      }
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

export function deactivate() {}
