/*
    Christopher Boartfield
    CPSC 5200A02
    04/05/2026
    Project 2: ASCIImation
*/

"use strict";

(function () {
    // variables to keep track of animation state
    let timer = null;       // holds the setInterval ID
    let currentFrame = 0;   // which frame we're on
    let frames = [];        // array of frames split from the text
    let savedText = "";     // saves the full text so we can restore on stop

    // wait for the page to load before setting up events
    window.onload = function () {
        // grab all the UI elements we need
        let textarea = document.getElementById("textarea");
        let startBtn = document.getElementById("start");
        let stopBtn = document.getElementById("stop");
        let animationSelect = document.getElementById("animation");
        let fontSizeSelect = document.getElementById("fontsize");
        let turboCheckbox = document.getElementById("turbo");

        // -- Start button: splits text into frames and begins animation --
        startBtn.onclick = function () {
            // save the text so we can put it back when we stop
            savedText = textarea.value;

            // split on 5 equals signs + newline to get individual frames
            frames = savedText.split("=====\n");

            // start from the first frame
            currentFrame = 0;
            textarea.value = frames[currentFrame];

            // figure out delay based on turbo checkbox
            let delay = turboCheckbox.checked ? 50 : 250;

            // start the animation timer
            timer = setInterval(nextFrame, delay);

            // disable start and animation select, enable stop
            startBtn.disabled = true;
            animationSelect.disabled = true;
            stopBtn.disabled = false;
        };

        // -- Stop button: stops the animation and restores original text --
        stopBtn.onclick = function () {
            clearInterval(timer);
            timer = null;

            // put the original text back in the box
            textarea.value = savedText;

            // re-enable start and animation select, disable stop
            stopBtn.disabled = true;
            startBtn.disabled = false;
            animationSelect.disabled = false;
        };

        // -- Animation dropdown: loads the selected animation into the textarea --
        animationSelect.onchange = function () {
            let choice = animationSelect.value;
            if (choice === "Blank") {
                textarea.value = "";
            } else {
                // use the ANIMATIONS array from animations.js
                textarea.value = ANIMATIONS[choice];
            }
        };

        // -- Font size dropdown: changes the textarea font size right away --
        fontSizeSelect.onchange = function () {
            // the value attribute on each option is already like "7pt", "12pt", etc.
            textarea.style.fontSize = fontSizeSelect.value;
        };

        // -- Turbo checkbox: switches between 50ms and 250ms delay --
        turboCheckbox.onchange = function () {
            // only change the timer if the animation is actually running
            if (timer !== null) {
                // clear the old timer and start a new one with the new speed
                clearInterval(timer);
                let delay = turboCheckbox.checked ? 50 : 250;
                timer = setInterval(nextFrame, delay);
            }
        };

        // -- helper function to advance to the next frame --
        function nextFrame() {
            currentFrame++;
            // loop back to the beginning if we passed the last frame
            if (currentFrame >= frames.length) {
                currentFrame = 0;
            }
            textarea.value = frames[currentFrame];
        }
    };
})();