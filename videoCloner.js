const fluentFfmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Function to create a directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Function to generate a random value within a specified range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

async function cloneVideo(inputVideoFile, outputVideoDir, numberOfCopies) {
  // Ensure the output directory exists
  ensureDirectoryExists(outputVideoDir);

  const inputFileName = path.basename(inputVideoFile, path.extname(inputVideoFile));

  for (let i = 1; i <= numberOfCopies; i++) {
    // Create a new fluent-ffmpeg instance for the input video file.
    const ffmpegInstance = new fluentFfmpeg(inputVideoFile);

    // Generate a random contrast adjustment (small change)
    const randomContrast = 1.0 + random(-0.1, 0.1);

    // Construct the full path to the output video file with the updated naming convention.
    const outputFileName = `${inputFileName}_v${i}.mp4`;
    const outputVideoFile = path.join(outputVideoDir, outputFileName);

    // Log the output file path for debugging.
    console.log(`Output file path (${i}):`, outputVideoFile);

    // Clone the input video to the specified output file with contrast adjustment
    await new Promise((resolve, reject) => {
      ffmpegInstance
        .on('end', resolve)
        .on('error', reject)
        .output(outputVideoFile)
        .audioCodec('aac')
        .videoCodec('libx264')
        .videoFilter(`eq=contrast=${randomContrast}`)
        .run();
    });
  }
}

// Start the video cloning process.
const inputVideoFile = process.argv[2];
const outputVideoDir = process.argv[3];

if (inputVideoFile && outputVideoDir) {
  const numberOfCopies = 5; // Change this to the desired number of copies
  cloneVideo(inputVideoFile, outputVideoDir, numberOfCopies)
    .then(() => {
      console.log('Video cloning complete.');
    })
    .catch(error => {
      console.error('Error:', error);
    });
} else {
  console.error('Usage: node videoCloner.js <inputVideoFile> <outputVideoDir>');
}
