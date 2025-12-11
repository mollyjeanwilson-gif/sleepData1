// Serial Bridge Example - Multiple Sensors with JSON
// This sketch receives MULTIPLE values and stores them in JSON format


//calm 253, 221, 164 38s
//excitement/anxiety 241, 162, 41 30s
//stress/tension 213, 108, 80 50s
//calm 253, 221, 164 33s
//shock/surprise 198, 63, 119 15s
//happiness 189,47,152 40s

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
let cueLog = [];
let cueColors = [
  [253, 221, 164], // calm
  [241, 162, 41],  // excitement
  [213, 108, 80],  // stress
  [253, 221, 164], // calm
  [198, 63, 119],  // shock
  [189, 47, 152]   // happiness
];

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
StopSave = createButton('Download data');
StopSave.center();
StopSave.position(width/2, buttonYpos);

StartSavebutton.mousePressed(startSaving);
StopSave.mousePressed(downloadData);

audioCueTimestamp = createButton('Audio cue playing');
audioCueTimestamp.position(width-audioCueTimestamp.width, buttonYpos);

audioCueTimestamp.mousePressed(()=>{
     audioCue = true;
    setTimeout(audioCueReset, 206000);});

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
    
cueLog.unshift (audioCue);
if (cueLog.length > width){
    cueLog.pop();}

        // Display individual sensor values

    if (saving){
allData.push({
            "timestamp": new Date().toISOString(), 
            "galvanic sensor": sensorValues[0],
            "heart rate": sensorValues[1], 
            "name": name.value(),
            "reading": allData.length + 1,
        "audio cue" : audioCue,
    })
}

for (let i = 0; i < cueLog.length; i++){
if (cueLog[i] == true){
   setInterval(calmColour, 38000);
   setInterval(excitementColour, 30000);
   setInterval(stressColour, 50000);
   setInterval(calmColour, 33000);
   setInterval(shockColour, 15000);
   setInterval(happinessColour, 40000);

}
else{
    noFill();
}
rect(i*5, 0, 5, height);
}

stroke(255);
noFill();
beginShape();
for (let i = 0; i < galvanicLog.length; i++) {
  let x = i *5
  let y = map(galvanicLog[i], 0, 800, 200, height/2);
  splineVertex(x, y);
  circle(x, y, 3);
}

endShape();



stroke(255);
noFill();
beginShape();

for (let i = 0; i < heartrateLog.length; i++) {
  let x = i*5
  let y = map(heartrateLog[i], 0, 1023, 200, height/2);
  splineVertex(x, y);
  circle(x, y, 3);

    
    
}

endShape();


//display text:
noStroke();
        fill(155);
        textSize(14);
    text('Connect serial bridge to device_1', 10, 40);
    text('Connect galvanic sensor to A1 and heartrate to A0', 10, 20);
    text('')
    fill(255);
    text(`Galvanic: ${sensorValues[0]}`, 10, 90);

    text(`Heartrate: ${sensorValues[1]}`, 10, 110);
    fill(255);
    text(`Readings collected: ${allData.length}`, 10, 130);
    fill(150);
      text(new Date().toISOString(), 10, 150);
  
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

function changeColour(){

}

function calmColour(){
   fill(253, 221, 164);
}
function excitementColour(){
   fill(241, 162, 41);
}
function stressColour(){
   fill(213, 108, 80);
}
function shockColour(){
   fill(198, 63, 119);
}
function happinessColour(){
   fill(189,47,152);
}   

//calm 253, 221, 164 38s
//excitement/anxiety 241, 162, 41 30s
//stress/tension 213, 108, 80 50s
//calm 253, 221, 164 33s
//shock/surprise 198, 63, 119 15s
//happiness 189,47,152 40s

