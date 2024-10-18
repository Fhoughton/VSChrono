import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('vschrono.display', () => {
        const panel = vscode.window.createWebviewPanel(
            'vschronowindow',
            'VSChrono Tracker',
            vscode.ViewColumn.One,
            {}
        );

        // HTML content for the webview
        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Time Tracker</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin: 0;
                padding: 20px;
            }
            .timer {
                font-size: 48px;
                margin: 20px 0;
            }
            button {
                font-size: 16px;
                padding: 10px 20px;
                margin: 5px;
            }
        </style>
    </head>
    <body>
        <h1>Time Tracker</h1>
        <div class="timer" id="timer">00:00:00</div>
        <button onclick="startTimer()">Start</button>
        <button onclick="stopTimer()">Stop</button>
        <button onclick="resetTimer()">Reset</button>
    </body>
    </html>`;
}

export function deactivate() {}
