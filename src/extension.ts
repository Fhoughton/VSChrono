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
        let startTime = null; // Store the start time as a Date object
        let elapsedTime = 0; // Store elapsed time when timer is stopped
        let isRunning = false;

		// Restore the state if available as VSCode destroys webviews on tab out
		const previousState = vscode.getState();
		if (previousState) {
			startTime = previousState.startTime ? new Date(previousState.startTime) : null;
			elapsedTime = previousState.elapsedTime || 0;
			isRunning = previousState.isRunning || false;
			updateTimerDisplay();

			if (isRunning) {
				startTimer(true); // Automatically resume the timer if it was running
			}
		}

		function updateTimerDisplay() {
			const currentTime = new Date();
            const totalElapsedSeconds = isRunning ? elapsedTime + Math.floor((currentTime - startTime) / 1000) : elapsedTime;
            document.getElementById('timer').textContent = new Date(totalElapsedSeconds * 1000).toISOString().substr(11, 8);
		}

		function startTimer(isRestoring = false) {
            if (!timerInterval) {
                isRunning = true;

                if (!isRestoring) {
                    startTime = new Date(); // Set start time to current time
                }

                timerInterval = setInterval(() => {
                    updateTimerDisplay(); // Correctly update the timer display
                    saveState(); // Save state after each update
                }, 1000);

                if (!isRestoring) saveState(); // Save when starting normally
            }
		}

		function stopTimer() {
			clearInterval(timerInterval);
			timerInterval = null;

            // Calculate the elapsed time when stopping the timer
            elapsedTime += Math.floor((new Date() - startTime) / 1000);
			isRunning = false;
			saveState(); // Save the state when the timer is stopped
		}

		function resetTimer() {
			clearInterval(timerInterval);
			timerInterval = null;
			elapsedTime = 0;
            startTime = null;
			isRunning = false;
			updateTimerDisplay();
			saveState(); // Save the state when the timer is reset
		}

		function saveState() {
			vscode.setState({
				startTime: startTime ? startTime.toISOString() : null,
				elapsedTime: elapsedTime,
				isRunning: isRunning
			});
		}
	</script>
    </html>`;
}

export function deactivate() {}
