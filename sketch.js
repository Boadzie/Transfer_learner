let classifier;
let featureExtractor;
let video;
let loss;
let happy = 0;
let sad = 0;

function setup() {
    noCanvas();
    // Create a video element
    video = createCapture(VIDEO);
    // Append it to the videoContainer DOM element
    video.parent('videoContainer');
    // Extract the already learned features from MobileNet
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    // Create a new classifier using those features and give the video we want to use
    classifier = featureExtractor.classification(video, videoReady);
    // Create the UI buttons
    setupButtons();


    // Save model
    saveBtn = select('#save');
    saveBtn.mousePressed(function () {
        classifier.save();
    });

    // Load model
    loadBtn = select('#load');
    loadBtn.changed(function () {
        classifier.load(loadBtn.elt.files, function () {
            select('#modelStatus').html('Custom Model Loaded!');
        });

    });

}

// A function to be called when the model has been loaded
function modelReady() {
    select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
    select('#videoStatus').html('Video ready!');
}


// Classify the current frame.
function classify() {
    classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
    // When the Cat button is pressed, add the current frame
    // from the video with a label of "cat" to the classifier
    buttonA = select('#catButton');
    buttonA.mousePressed(function () {
        classifier.addImage('happy');
        select('#amountOfCatImages').html(happy++);
    });

    // When the Dog button is pressed, add the current frame
    // from the video with a label of "dog" to the classifier
    buttonB = select('#dogButton');
    buttonB.mousePressed(function () {
        classifier.addImage('sad');
        select('#amountOfDogImages').html(sad++);
    });

    // Train Button
    train = select('#train');
    train.mousePressed(function () {
        classifier.train(function (lossValue) {
            if (lossValue) {
                loss = lossValue;
                select('#loss').html('Loss: ' + loss);
            } else {
                select('#loss').html('Done Training! Final Loss: ' + loss);
            }
        });
    });

    // Predict Button
    buttonPredict = select('#buttonPredict');
    buttonPredict.mousePressed(classify);
}


// Show the results
function gotResults(err, result) {
    if (err) {
        console.error(err);
    }
    select('#result').html(result);
    classify();
}