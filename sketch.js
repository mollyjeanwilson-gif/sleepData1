// Serial Bridge Example - Multiple Sensors with JSON
// This sketch receives MULTIPLE values and stores them in JSON format

let bridge;
let sensorValues = [0, 0]; // Array to hold current sensor values
let allData = []; // Array to store all readings


let mapGalvanic;
let mapHeartrate;

let galvanicLog = [];
let heartrateLog = [];

let StartSavebutton;
let StopSave;

let saving = false;

let audioCueTimestamp;
let audioCue = false;

let name;

let use_value = false;

let margin = 10;
let buttonYpos;

function setup() {
    createCanvas(windowWidth, windowHeight-50);
buttonYpos = height - 40;
    // Connect to Serial Bridge
    bridge = new SerialBridge();

    // Listen for data from arduino_1
    bridge.onData('device_1', (data) => {
        // Console log the raw data as it arrives
        console.log("Raw data received:", data);

        // Split the data by comma
        let values = data.split(",");

        // Loop through and convert all values to numbers
        for (let i = 0; i < values.length; i++) {
            sensorValues[i] = parseInt(values[i]);
        }

    });

StartSavebutton = createButton('Start saving data');
StartSavebutton.position(margin, buttonYpos);
StopSave = createButton('download data');
StopSave.center();
StopSave.position(width/2, buttonYpos);

StartSavebutton.mousePressed(startSaving);
StopSave.mousePressed(downloadData);

audioCueTimestamp = createButton('audio cue playing');
audioCueTimestamp.position(width-audioCueTimestamp.width, buttonYpos);
audioCueTimestamp.mousePressed(()=>{
     audioCue = true;
    setTimeout(audioCueReset, 5000);
});

name = createInput("Enter Name");
name.position(15, 60);

}


function draw() {
    background(0);



console.log(mapGalvanic);

galvanicLog.unshift(sensorValues[0]);
if (galvanicLog.length > width){
    galvanicLog.pop();}

heartrateLog.unshift (sensorValues[1]);
if (heartrateLog.length > width){
    heartrateLog.pop();}       

        // Display individual sensor values
   noStroke();
        fill(150);
        textSize(14);
    text('Connect serial bridge to device_1', 10, 40);
    text('Connect galvanic sensor to A1 and heartrate to A0', 10, 20);
    text('')
    fill(0, 0, 255);
    text(`Galvanic: ${sensorValues[0]}`, 10, 90);

    if(sensorValues[1] >900)
        { fill(255,0,0);}
    else {fill(255);}
    text(`Heartrate: ${sensorValues[1]}`, 10, 110);
  
  

    fill(0);
    text(`Readings collected: ${allData.length}`, 10, 130);
    fill(150);
      text(new Date().toISOString(), 10, 150);
  


    if (saving){
allData.push({
            "timestamp": new Date().toISOString(), 
            "galvanic sensor": sensorValues[0],
            "heart rate": sensorValues[1], 
            "audio cue" : audioCue,
            "name": name.value(),
            "reading": allData.length + 1 })
}

stroke(0, 0, 255);
noFill();
beginShape();

for (let i = 0; i < galvanicLog.length; i++) {
  let x = i *5
  let y = map(galvanicLog[i], 0, 800, 200, height/2);
  splineVertex(x, y);
  circle(x, y, 3);
}

endShape();


stroke(255, 0, 0);
noFill();
beginShape();

for (let i = 0; i < heartrateLog.length; i++) {
  let x = i*5
  let y = map(heartrateLog[i], 0, 1023, 200, height/2);
  splineVertex(x, y);
  circle(x, y, 3);
}

endShape();


}



function startSaving(){
    saving = true;
}

function downloadData() {
    saving = false;
    if (allData.length > 0) { // Only download if we have data
        saveJSON(allData, 'galvanic.json'); // Save as JSON file
        console.log("Downloaded " + allData.length + " readings!"); // Tell us it worked
    }
}

function audioCueReset(){
    audioCue = false;
}   

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


