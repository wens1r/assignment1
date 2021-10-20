/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/
let song1;
let song2;
let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let control0 = 0, control1 = 0, control2 = 0;
let bassCircle;


function setup() {

    angleMode(DEGREES);
    rectMode(CENTER);

song1 = createAudio('assets/assets_sounds_bubbles.mp3');
song2 = createAudio('assets/assets_audio_Basquiat.mp3');

  
createCanvas(windowWidth, windowHeight);

///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
///////////////////////////////////////////////////////////////////    

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM3");
 /////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////////////////////////
 ////////////////////////////////////////////////////////////////////////////
  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);

 
}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////



// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}


// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  control0 = splitter[0];                 //put the first sensor's data into a variable
  control1 = splitter[1];
  control2 = splitter[2]; 



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {
  
    textSize(20);
    text("Click to listen", windowWidth / 2 - 70, height/ 20);
    
    if (control1 > 1) {
    ellipse(width / 2, height / 2, control1);
    }
    
    bass();
    melody();   
}

function bass() {
    
    if (control0 == 1) {
      song1.loop();
      waveTwo();
    }
  if (control0 == 0) {
       song1.stop();
    }  
}

function melody() {
    if (control2 < 5) {
        song2.play(); 
        waves();
    } else if (control2 > 10) {
        song2.stop();
    }
}


function waves() {
    
    translate(width/2, height/2);
    
    for (var i = 0; i < 50; i++){
        push()
        
        rotate(sin(frameCount + i) * 100);
        
        var r = map(sin(frameCount), -1, 1, 50, 255);
        var g = map(cos(frameCount / 2), -1, 1, 50, 255);
        var b = map(sin(frameCount / 4), -1, 1, 50, 255);
        
        stroke(r,g,b);
        rect(0,0,500 - i * 3, 500 - i * 3, 200 - i);
        pop()
        
        
    }
   
}

function waveTwo() {
    
    translate(width/2, height/2);
    
    for (var i = 0; i < 100; i++){
        push()     
        rotate(sin(frameCount + i) * 100)
        rect(0,0,200 - i*2, 200 - i, 200 - i)
        pop()
    }
    
}











  

 