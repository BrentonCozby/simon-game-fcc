// Planning: don't write DOM code here. Write DOM code in _updateui.js
// Planning: emit the stateChange event here using the 'detail' parameter to pass data
import updateUI from './_update-ui'

const mainButtonsUI = updateUI.mainButtons;

(function _gameLogic() {
    const state = {
        power: 'off',
        sequence: [],
        strict: 'off',
        count: 0,
        humanTurn: false,
        crawler: 0,
        loser: false,
    }

    function stateChangeEvent(body) {
        const event = new CustomEvent('stateChanged', {
            detail: body,
        })
        return event
    }

    function simonAddStep() {
        let color = null
        if (Math.random() * 4 < 1) color = 'green'
        else if (Math.random() * 4 < 2) color = 'red'
        else if (Math.random() * 4 < 3) color = 'yellow'
        else if (Math.random() * 4 <= 4) color = 'blue'

        document.dispatchEvent(stateChangeEvent({
            sequence: color,
        }))
    }

    function playSequence(addStep) {
        document.dispatchEvent(stateChangeEvent({
            // prevent user from pressing main buttons
            humanTurn: false,
        }))

        if (addStep) {
            simonAddStep()
        }

        state.sequence.forEach((color, index) => {
            window.setTimeout(() => {
                mainButtonsUI[color].mousedown()
            }, 700 * (index + 1))
            window.setTimeout(() => {
                mainButtonsUI[color].mouseup()
                if (index === state.sequence.length - 1) {
                    updateUI.renderCount(state)
                    document.dispatchEvent(stateChangeEvent({
                        // allow user to press main buttons
                        humanTurn: true,
                    }))
                    document.dispatchEvent(new Event('donePlayingSequence'))
                }
            }, 700 * (index + 1) + 200)
        })
    }

    const start = {
        mouseup() {
            document.dispatchEvent(stateChangeEvent({
                sequence: 'reset',
                count: 'reset',
                crawler: 'reset',
                loser: false,
            }))
            playSequence(true)
        },
    }

    const strict = {
        mouseup() {
            const event = stateChangeEvent({
                strict: 'toggle',
            })
            document.dispatchEvent(event)
        },
    }

    const onOff = {
        onclick() {
            const event = stateChangeEvent({
                power: 'toggle',
                sequence: 'reset',
                strict: 'reset',
                count: 'reset',
            })
            document.dispatchEvent(event)
        },
    }

    const mainButtons = {
        // only runs when state.humanTurn is true or
        // when state.loser is false
        // or when state.power is off
        mouseup(color) {
            if (state.sequence[state.crawler] !== color) {
                window.setTimeout(updateUI.buzzer, 70)
                if (state.strict === 'on') {
                    document.dispatchEvent(stateChangeEvent({
                        loser: true,
                    }))
                } else {
                    document.dispatchEvent(stateChangeEvent({
                        crawler: 'reset',
                    }))
                    window.setTimeout(() => {
                        playSequence(false)
                    }, 700)
                }
                return false
            }
            if (state.crawler === state.sequence.length - 1) {
                document.dispatchEvent(stateChangeEvent({
                    count: 'increment',
                }))
                updateUI.renderCount(state)
                window.setTimeout(() => {
                    playSequence(true)
                }, 600)
                document.dispatchEvent(stateChangeEvent({
                    crawler: 'reset',
                }))
                return false
            }

            document.dispatchEvent(stateChangeEvent({
                crawler: 'increment',
            }))
        },
    }

    function onStateChange(detail) {
        Object.keys(detail).forEach(prop => {
            // change the state
            const value = detail[prop]
            switch (prop) {
                case 'power':
                    if (value === 'reset') state.power = 'off'
                    else if (state.power === 'off') state.power = 'on'
                    else state.power = 'off'
                    break
                case 'sequence':
                    if (value === 'reset') state.sequence = []
                    else if (!state.humanTurn) state.sequence.push(value)
                    break
                case 'strict':
                    if (value === 'reset') state.strict = 'off'
                    else if (state.strict === 'off') state.strict = 'on'
                    else state.strict = 'off'
                    break
                case 'count':
                    if (value === 'reset') state.count = 0
                    else state.count += 1
                    break
                case 'humanTurn':
                    state.humanTurn = value
                    break
                case 'crawler':
                    if (value === 'reset') state.crawler = 0
                    else state.crawler += 1
                    break
                case 'loser':
                    state.loser = value
                    break
                default:
                    console.log(`switch statement could not match case:\n\t${prop}: ${value}`) // eslint-disable-line no-console
            }
        })
    }

    module.exports.start = start
    module.exports.strict = strict
    module.exports.onOff = onOff
    module.exports.state = state
    module.exports.onStateChange = onStateChange
    module.exports.mainButtons = mainButtons
}())
