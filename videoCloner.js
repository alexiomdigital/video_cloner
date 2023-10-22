// Import the fluent-ffmpeg library.
const fluentFfmpeg = require('fluent-ffmpeg');

// Generate a random value in the specified range.
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate a video with the specified adjustments.
async function generateVideo(inputVideoFile, outputVideoFile, adjustments) {
  // Create a new fluent-ffmpeg instance for the input video file.
  const fluentFfmpeg = new fluentFfmpeg(inputVideoFile);

  // Add the specified adjustments to the fluent-ffmpeg instance.
  for (const [key, value] of Object.entries(adjustments)) {
    fluentFfmpeg.addOptions([`-filter:v`, `${key}=${value}`]);
  }

  // Save the output video file.
  await fluentFfmpeg.output(outputVideoFile).save();
}

// Generate 5 unique videos from the input video file.
async function main() {
  // Get the input video file path.
  const inputVideoFile = './input.mp4';

  // Get the output video directory path.
  const outputVideoDir = './output';

  // Generate 5 unique videos.
  for (let i = 0; i < 5; i++) {
    // Generate a random set of adjustments.
    const adjustments = {
      colorchannelmixer: random(0.5, 1.5),
      contrast: random(0.5, 1.5),
      bitrate: random(500000, 1000000),
      zoom: random(0.5, 1.5),
      rotate: random(-30, 30),
      speed: random(0.5, 1.5),
    };

    // Generate the output video file path.
    const outputVideoFile = `${outputVideoDir}/output${i}.mp4`;

    // Generate the video with the specified adjustments.
    await generateVideo(inputVideoFile, outputVideoFile, adjustments);
  }
}


// Start the video cloning process.
main();