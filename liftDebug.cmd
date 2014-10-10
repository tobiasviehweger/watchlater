start /B node --debug app.js
timeout /T 2 > nul
start /B node-inspector
timeout /T 2 > nul
start /B http://127.0.0.1:8080/debug?port=5858