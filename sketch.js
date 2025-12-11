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

let emotion = "";

let calmButton;
let calm = false;
let calmLog = [];

let excitementButton;
let excitement = false;
let excitementLog = [];

let stressButton;
stress = false;
let stressLog = [];

let shockButton;
let shock = false;
let shockLog = [];

let happinessButton;
let happiness = false;
let happinessLog = [];

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
StartSavebutton.mousePressed(startSaving);
StartSavebutton.style("font-family", "VT323");

StopSave = createButton('Download data');
StopSave.center();
StopSave.position(width/2, buttonYpos);
StopSave.mousePressed(downloadData);
StopSave.style("font-family", "VT323");

audioCueTimestamp = createButton('Audio cue playing');
audioCueTimestamp.position(width-audioCueTimestamp.width, buttonYpos);
audioCueTimestamp.style("font-family", "VT323");
audioCueTimestamp.mousePressed(()=>{
     audioCue = true;
    setTimeout(audioCueReset, 206000);});


name = createInput("Enter Name");
name.position(15, 60);
name.style("font-family","VT323" );


calmButton = createButton('Calm');
calmButton.style('background-color', 'rgb(253, 221, 164)');
calmButton.style('border-width', "0px");
calmButton.style("font-family", "VT323");
calmButton.hide();
calmButton.mousePressed(() => { emotion = "Calm"
    calm = true; 
    excitement = false;
    stress = false;
    shock = false;
    happiness = false;
});

excitementButton = createButton('Excitement');
excitementButton.style('background-color', 'rgb(241, 162, 41)');
excitementButton.style('border-width', "0px");
excitementButton.style("font-family", "VT323");
excitementButton.hide();
excitementButton.mousePressed(() => { emotion = "Excitement";
    excitement = true;
      calm = false;
    stress = false;
    shock = false;
    happiness = false;
 });

stressButton = createButton('Stress');
stressButton.style('background-color', 'rgb(213, 108, 80)');
stressButton.style('border-width', "0px");
stressButton.style("font-family", "VT323");
stressButton.hide();
stressButton.mousePressed(() => { emotion = "Stress"; 
    excitement = false;
      calm = false;
    stress = true;
    shock = false;
    happiness = false;
});

shockButton = createButton('Shock');
shockButton.style('background-color', 'rgb(198, 63, 119)');
shockButton.style('border-width', "0px");
shockButton.style("font-family", "VT323");
shockButton.hide();
shockButton.mousePressed(() => { emotion = "Shock";
  excitement = false;
      calm = false;
    stress = false;
    shock = true;
    happiness = false;
 });

happinessButton = createButton('Happiness');
happinessButton.style('background-color', 'rgb(189, 47, 152)');
happinessButton.style('border-width', "0px");
happinessButton.style("font-family", "VT323");
happinessButton.hide();
happinessButton.mousePressed(() => { emotion = "Happiness"; 
   excitement = false;
      calm = false;
    stress = false;
    shock = false;
    happiness = true;
});
}


function draw() {
    background(0);

galvanicLog.unshift(sensorValues[0]);
if (galvanicLog.length > width){
    galvanicLog.pop();}

heartrateLog.unshift (sensorValues[1]);
if (heartrateLog.length > width){
    heartrateLog.pop();} 
    
cueLog.unshift (audioCue);
if (cueLog.length > width){
    cueLog.pop();}

calmLog.unshift (calm);
if (calmLog.length > width){
    calmLog.pop();}

excitementLog.unshift (excitement);
if (excitementLog.length > width){
    excitementLog.pop();}

stressLog.unshift (stress);
if (stressLog.length > width){
    stressLog.pop();}

shockLog.unshift (shock);
if (shockLog.length > width){
    shockLog.pop();}

happinessLog.unshift (happiness);
if (happinessLog.length > width){
    happinessLog.pop();}        

        // Display individual sensor values

    if (saving){
allData.push({
            "timestamp": new Date().toISOString(), 
            "galvanic sensor": sensorValues[0],
            "heart rate": sensorValues[1], 
            "name": name.value(),
            "reading": allData.length + 1,
            "audio cue" : audioCue,
            "emotion": emotion
    })
}



//display text:
textFont("VT323");
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


      for (let i = 0; i < cueLog.length; i++){
if (cueLog[i] == true){
calmButton.show();
excitementButton.show();
stressButton.show();
shockButton.show();
happinessButton.show();
fill(253, 221, 164);
    if (calmLog[i] == true){
fill(253, 221, 164);
    }
    else if (excitementLog[i] == true) {
fill(241, 162, 41);
    }
    else if (stressLog[i]== true){
        fill(213, 108, 80);
    }
    else if (shockLog[i]== true){
        fill(198, 63, 119)
    }
    else if (happinessLog[i]==true){
        fill(189,47,152);
    }
}
else{
    noFill();
}
rect(i*5, 160, 5, height-320);
}

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
    emotion = "";
    calm = false;
    excitement = false;
    stress = false;
    shock = false;
    happiness = false;
}   

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}




