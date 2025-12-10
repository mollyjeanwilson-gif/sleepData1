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

let use_value = false;

function setup() {
    createCanvas(400, 400);

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
StopSave = createButton('download data');

StartSavebutton.mousePressed(startSaving);
StopSave.mousePressed(downloadData);

audioCueTimestamp = createButton('audio cue playing');
audioCueTimestamp.mousePressed(()=>{
     audioCue = true;
    setTimeout(audioCueReset, 10000);// 100 ms pulse
});
      
}


function draw() {
    background(220);


mapGalvanic =map(sensorValues[0], 450, 600, 0, height/2);
mapHeartrate =map(sensorValues[1], 0, 1023, 0, height/2);

galvanicLog.unshift(mapGalvanic);
if (galvanicLog.length > width){
    galvanicLog.pop();}

heartrateLog.unshift (mapHeartrate);
if (heartrateLog.length > width){
    heartrateLog.pop();}       

        // Display individual sensor values
   noStroke();
        fill(150);
        textSize(14);
    text('Connect serial bridge to device_1', 10, 40);
    text('Connect galvanic sensor to A1 and heartrate to A0', 10, 20);
    text('')
    fill(0);
    text(`Galvanic: ${sensorValues[0]}`, 10, 70);

    if(sensorValues[1] >900)
        { fill(255,0,0);}
    else {fill(0);}
    text(`Heartrate: ${sensorValues[1]}`, 10, 90);
  
  

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
            "reading": allData.length + 1 })
}

noFill();
stroke('blue');
  beginShape();
  // starting from the left margin, work towards the right margin
  for (let i = 0; i < galvanicLog.length; i ++) {
    if (use_value) {
      // jiggle our points up and down
     vertex(i, 200);
      circle(i, 200, 3);
    } else {
      // draw our points directly on a straight line

         splineVertex(i * 10, 200 + galvanicLog[i]);
      circle(i * 10, 200 + galvanicLog[i], 3);
    }
  }
  endShape();

  stroke('red');
  beginShape();
  // starting from the left margin, work towards the right margin
  for (let i = 0; i < heartrateLog.length ; i ++) {
    if (use_value) {
      // jiggle our points up and down
     vertex(i, 200);
      circle(i, 200, 3);
    } else {
      // draw our points directly on a straight line

         vertex(i * 10, 200 + heartrateLog[i]);
      circle(i * 10, 200 + heartrateLog[i], 3);
    }
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


