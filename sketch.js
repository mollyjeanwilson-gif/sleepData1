// Serial Bridge Example - Multiple Sensors with JSON
// This sketch receives MULTIPLE values and stores them in JSON format

//calm 253, 221, 164 38s
//excitement/anxiety 241, 162, 41 30s
//stress/tension 213, 108, 80 50s
//calm 253, 221, 164 33s
//shock/surprise 198, 63, 119 15s
//happiness 189,47,152 40s
//colour values for the emotional states

//setting up variables
let bridge;
let sensorValues = [0, 0]; 
// Array to hold current sensor values
let allData = []; 
// Array to store all readings


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

        // Loop through  data and convert all values to real numbers
        for (let i = 0; i < values.length; i++) {
            sensorValues[i] = parseInt(values[i]);
        }



    });

//set up buttons to start saving and download JSON
StartSavebutton = createButton('Start saving data');
StartSavebutton.position(margin, buttonYpos);
StartSavebutton.mousePressed(startSaving);
StartSavebutton.style("font-family", "VT323");

StopSave = createButton('Download data');
StopSave.center();
StopSave.position(width/2, buttonYpos);
StopSave.mousePressed(downloadData);
StopSave.style("font-family", "VT323");

//audio cue button makes audio cue true for 206s (the length of the audio track)
audioCueTimestamp = createButton('Audio cue playing');
audioCueTimestamp.position(width-audioCueTimestamp.width, buttonYpos);
audioCueTimestamp.style("font-family", "VT323");
audioCueTimestamp.mousePressed(()=>{
     audioCue = true;
    setTimeout(audioCueReset, 206000);});
//setTimeout means the audioCueReset happens after 206000 milliseconds

//input name
name = createInput("Enter Name");
name.position(15, 60);
name.style("font-family","VT323" );


//buttons for emotions, in the colours we chose for each emotion
//when one emotion is pressed it becomes true (in the JSON) the other ones become false
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

//going through the data (sensorValues[0] is galvanic) and [1] is heartrate
//unshift adds the new data to the front of the array rather than the end so that the graph can appear to roll across the screen
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

//save JSON
// if save button is pressed saving=true

    
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



//display text, with reminders about how to set up the experement as we kept connecting the sensors to the wrong pins
    
textFont("VT323");
noStroke();
        fill(155);
        textSize(14);
    text('Connect serial bridge to device_1', 10, 40);
    text('Connect galvanic sensor to A0 and heartrate to A1', 10, 20);
    text('')
    fill(255);
    text(`Galvanic: ${sensorValues[0]}`, 10, 90);

    text(`Heartrate: ${sensorValues[1]}`, 10, 110);
    fill(255);
    text(`Readings collected: ${allData.length}`, 10, 130);
    fill(150);
    text(new Date().toISOString(), 10, 150);

//the emotion buttons only show when the audio cue button is pressed
      for (let i = 0; i < cueLog.length; i++){
if (cueLog[i] == true){
calmButton.show();
excitementButton.show();
stressButton.show();
shockButton.show();
happinessButton.show();

    //a block of colour comes on screen when each emotion is pressed
    //the fill colour is dictated by the emotion
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

//draws the data in a graph
// uses what we have been unshifing into each log
// for loop to go through each value
// space between each value is 5
// remapped to fit the screen
// spline vertex simply creates a curve  between the points
    
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

// repeats the same with the galvanic data
    
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



// other functions:


//makes the saving button turn saving to true when pressed
function startSaving(){
    saving = true;
}

//i should have changed the name of the json file this caused issues - i just kept reworking old code
//this saves the data and sends a message to console to dbl check
//resets saving to false
function downloadData() {
    saving = false;
    if (allData.length > 0) { // Only download if we have data
        saveJSON(allData, 'galvanic.json'); // Save as JSON file
        console.log("Downloaded " + allData.length + " readings!"); // Tell us it worked
    }
}

//does what it says , makes all emotions false, audio cue is not playing, no emotion being tried to be evoked
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




