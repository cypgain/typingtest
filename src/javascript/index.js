import '../sass/style.scss'

import { french } from './words'

const words = french

let getRandomSentence = (wordsCount) => {
    let sentence = ""

    for (let i = 0; i < wordsCount; i++) {
        sentence += words[Math.floor(Math.random() * Math.floor(words.length - 1))]

        if (i != (wordsCount - 1))
            sentence += " "
    }

    return sentence
}

let updateSentence = (sentence, charsTyped) => {
    const typingElement = document.querySelector("#typing")
    const sentenceChars = sentence.split('')
    
    typingElement.innerHTML = ""

    sentence = ""

    for (let i = 0; i < sentenceChars.length; i++) {
        if (i == charsTyped.length) {
            sentence += "<span id='current'>" + sentenceChars[i] + "</span>"
        } else if (i < charsTyped.length) {
            if (charsTyped[i] == sentenceChars[i]) {
                sentence += "<span id='good'>" + sentenceChars[i] + "</span>"
            } else {
                sentence += "<span id='bad'>" + sentenceChars[i] + "</span>"
            }
        } else {
            sentence += sentenceChars[i]
        }
    }

    typingElement.innerHTML = sentence
}

let detectFinish = (sentence, charsTyped) => {
    const sentenceChars = sentence.split('')

    if (charsTyped.length >= sentenceChars.length) {
        return true
    }

    return false
}

let countErrors = (sentence, charsTyped) => {
    const sentenceChars = sentence.split('')

    let errors = 0

    for (let i = 0; i < sentenceChars.length; i++) {
        if (sentenceChars[i] != charsTyped[i]) {
            errors++
        }
    }

    return errors
} 

let average = (array) => array.reduce((a, b) => a + b) / array.length;

let updateAverage = () => {
    const averageElement = document.querySelector("#average")

    if (window.localStorage.getItem('wpm') != undefined) { 
        const wpmArray = JSON.parse(window.localStorage.getItem('wpm'))

        averageElement.innerHTML = Math.round(average(wpmArray)) + " WPM MOYEN"
    }
}

const timerElement = document.querySelector("#timer")
const wordsCount = 50
let sentence = getRandomSentence(wordsCount)
let charsTyped = []
let interval;
let timer = 0

updateSentence(sentence, charsTyped)
updateAverage()

document.addEventListener('keypress', (e) => {
    if (interval == undefined) {
        interval = setInterval(() => {
            timer++
            timerElement.innerHTML = timer + "s"
        }, 1000)
    }

    charsTyped.push(e.key)
    updateSentence(sentence, charsTyped)

    if (detectFinish(sentence, charsTyped)) {
        clearTimeout(interval)
        interval = undefined

        const wpm = Math.round(((((sentence.split('').length) - countErrors(sentence, charsTyped)) / 5) * 60) / timer)

        timerElement.innerHTML = wpm + " WPM"

        let wpmArr = [wpm]

        if (window.localStorage.getItem('wpm') != undefined) {
            wpmArr = JSON.parse(window.localStorage.getItem('wpm'))
            wpmArr.push(wpm)
        }

        window.localStorage.setItem('wpm', JSON.stringify(wpmArr))
        updateAverage()
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key == "Backspace") {
        if (charsTyped.length > 0) {
            charsTyped.pop()
            updateSentence(sentence, charsTyped)
        }
    } else if (e.key == "Tab") {
        timer = 0

        if (interval != undefined) {
            clearTimeout(interval)
            interval = undefined
        }

        sentence = getRandomSentence(wordsCount)
        charsTyped = []

        updateSentence(sentence, charsTyped)
        timerElement.innerHTML = timer + "s"

        e.preventDefault()
    }
})