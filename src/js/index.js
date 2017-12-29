import gameLogic from './_game-logic'
import updateUI from './_update-ui';

(function main() {
    $(document).on('stateChanged', (e) => {
        gameLogic.onStateChange(e.originalEvent.detail)
    })

    $(document).on('donePlayingSequence', () => {
        updateUI.onDonePlayingSequence(gameLogic.state)
    })

    const startBtn = $('#start-button')
    const strictBtn = $('#strict-button')
    const onOffBtn = $('#on-off-button')

    startBtn.on('mouseup', () => {
        if (gameLogic.state.power === 'off') return false

        gameLogic.start.mouseup()
        updateUI.start.mouseup(gameLogic.state)
    })
    strictBtn.on('mouseup', () => {
        if (gameLogic.state.power === 'off') return false

        gameLogic.strict.mouseup()
        updateUI.strict.mouseup(gameLogic.state)
    })
    onOffBtn.on('click', () => {
        gameLogic.onOff.onclick()
        updateUI.onOff.onclick(gameLogic.state)
    })

    // initialize click handlers for the main buttons
    const buttonsUI = updateUI.mainButtons
    const buttonsGL = gameLogic.mainButtons

    Object.keys(buttonsUI).forEach(color => {
        buttonsUI[color].element.on('mousedown', () => {
            if (gameLogic.state.power === 'off' ||
                gameLogic.state.humanTurn === false ||
                gameLogic.state.loser === true
            ) return false
            buttonsUI[color].mousedown()
        })
        buttonsUI[color].element.on('mouseup', () => {
            if (gameLogic.state.power === 'off' ||
                gameLogic.state.humanTurn === false ||
                gameLogic.state.loser === true
            ) return false
            buttonsUI[color].mouseup()
            buttonsGL.mouseup(color)
        })
    })
}())
