import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('vschrono.display', () => {
        const panel = vscode.window.createWebviewPanel(
            'vschronowindow',
            'VSChrono Tracker',
            vscode.ViewColumn.One,
            { enableScripts: true }
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
	<script>
		const vscode = acquireVsCodeApi(); // Acquire VSCode api for handling state

		let timerInterval;
		let seconds = 0;
        let isRunning = false;

		// Restore the state if available as VSCode destroys webviews on tab out
		const previousState = vscode.getState();
		if (previousState) {
			seconds = previousState.seconds || 0;
			isRunning = previousState.isRunning || false;
			updateTimerDisplay();

			if (isRunning) {
				startTimer(true); // Automatically resume the timer if it was running
			}
		}

		function updateTimerDisplay() {
			document.getElementById('timer').textContent = new Date(seconds * 1000).toISOString().substr(11, 8);
		}

		function startTimer(isRestoring = false) {
			if (!timerInterval) {
				isRunning = true;
				timerInterval = setInterval(() => {
					seconds++;
					updateTimerDisplay();
					saveState(); // Save state after each tick
				}, 1000);

				if (!isRestoring) saveState(); // Save when starting normally
			}
		}

		function stopTimer() {
			clearInterval(timerInterval);
			timerInterval = null;
			isRunning = false;
			saveState(); // Save the state when the timer is stopped
		}

		function resetTimer() {
			clearInterval(timerInterval);
			timerInterval = null;
			seconds = 0;
			isRunning = false;
			updateTimerDisplay();
			saveState(); // Save the state when the timer is reset
		}

		function saveState() {
			vscode.setState({
				seconds: seconds,
				isRunning: isRunning
			});
		}
	</script>
    </html>`;
}

export function deactivate() {}
