import gameLogic from './_game-logic.js';
import updateUI from './_update-ui.js';

(function main() {
    'use strict';

    $(document).on('stateChanged', function(e) {
        gameLogic.onStateChange(e.originalEvent.detail);
    });

    $(document).on('donePlayingSequence', function() {
        updateUI.onDonePlayingSequence(gameLogic.state);
    });

    const startBtn = $('#start-button');
    const strictBtn = $('#strict-button');
    const onOffBtn = $('#on-off-button');

    startBtn.on('mouseup', function() {
        if(gameLogic.state.power === 'off') return false;
        gameLogic.start.mouseup();
        updateUI.start.mouseup(gameLogic.state);
    });
    strictBtn.on('mouseup', function() {
        if(gameLogic.state.power === 'off') return false;
        gameLogic.strict.mouseup();
        updateUI.strict.mouseup(gameLogic.state);
    });
    onOffBtn.on('click', function() {
        gameLogic.onOff.onclick();
        updateUI.onOff.onclick(gameLogic.state);
    });

    // initialize click handlers for the main buttons
    let buttonsUI = updateUI.mainButtons;
    let buttonsGL = gameLogic.mainButtons;
    for (let color in buttonsUI) {
        if (buttonsUI.hasOwnProperty(color)) {
            buttonsUI[color].element.on('mousedown', function() {
                if( gameLogic.state.power === 'off' ||
                    gameLogic.state.humanTurn === false ||
                    gameLogic.state.loser === true
                ) return false;
                buttonsUI[color].mousedown();
            });
            buttonsUI[color].element.on('mouseup', function() {
                if( gameLogic.state.power === 'off' ||
                    gameLogic.state.humanTurn === false ||
                    gameLogic.state.loser === true
                ) return false;
                buttonsUI[color].mouseup();
                buttonsGL.mouseup(color);
            });
        }
    }

})();
