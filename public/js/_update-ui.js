// write event handler functions here and DOM updating funtions for each
// state change. Don't use these functions here--use them in main.js

(function _updateUI() {
    'use strict';

    const countDisplay = $('#count-display');

    function renderCount(currentState) {
        if (String(currentState.count).length < 2) countDisplay.html('0' + currentState.count);
        else countDisplay.html(currentState.count);
    }

    function buzzer() {
        const buzzer = document.getElementById('buzzer');
        buzzer.currentTime = 0;
        buzzer.play();
    }

    const start = {
        element: $('#start-button'),
        mouseup: function(currentState) {
            renderCount(currentState);
        }
    };

    const strict = {
        element: $('#strict-button'),
        mouseup: function(currentState) {
            if(currentState.strict === 'on') strict.element.addClass('on');
            else strict.element.removeClass('on');
        }
    };

    const onOff = {
        element: $('#on-off-button'),
        onclick: function(currentState) {
            if(currentState.power === 'on') {
                onOff.element.addClass('on');
                start.element.addClass('on');
                renderCount(currentState);
            }
            else {
                onOff.element.removeClass('on');
                start.element.removeClass('on');
                strict.element.removeClass('on active');
                countDisplay.html('&nbsp;&nbsp;');
            }
        }
    };

    const MainButton = function(color, note) {
        this.element = $(`#button-${color}`);
        this.audio = document.getElementById(`${note}-audio`);
    };

    MainButton.prototype.mousedown = function() {
        this.audio.currentTime = 0;
        this.audio.play();
        this.element.addClass('pressed');
    };

    MainButton.prototype.mouseup = function() {
        this.element.removeClass('pressed');
    };

    const mainButtons = {
        green: new MainButton('green', 'c'),
        red: new MainButton('red', 'e'),
        yellow: new MainButton('yellow', 'g'),
        blue: new MainButton('blue', 'a')
    };

    const onDonePlayingSequence = function(currentState) {
        renderCount(currentState);
    };

    module.exports.renderCount = renderCount;
    module.exports.buzzer = buzzer;
    module.exports.start = start;
    module.exports.strict = strict;
    module.exports.onOff = onOff;
    module.exports.mainButtons = mainButtons;
    module.exports.onDonePlayingSequence = onDonePlayingSequence;

})();
