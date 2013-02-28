/*
--------------------------------
USAGE
 
Start Server, navigate to code directory in Terminal:
> node tcp_echo.js
 
In another new Terminal window, connect to TCP Echo server
> telnet localhost 5000
 
Enter a message in the connected Terminal window and hit return key.
 
*/
var net = require('net');
 
net.createServer(function(socket) {
// New client connection event
socket.on('connect', function(data){
// server log new connection
console.log("Connection from " + socket.remoteAddress);
 
// Say hello when new socket connects
socket.write("Welcome to our humble echo server\n");
});
 
 
// Incoming data event
socket.on('data', function(data) {
console.log("Client said: " + data); // server log
socket.write("You said: " + data); // write to client
});
 
 
// Disconnect event
socket.on('end', function(){
//Log it to the server output
console.log("someone left us.")
});
}).listen(5000);
 
console.log("TCP ECHO SERVER STARTED ON 5000");