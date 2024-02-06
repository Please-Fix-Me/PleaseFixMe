import { generate } from "random-words";

export default function generatePassword() {
    const result = generate({
        min: 3,
        max: 6,
        exactly: 1,
        wordsPerString: 3,
        separator: '',
        formatter: (word, index) => {
            return word.slice(0, 1).toUpperCase().concat(word.slice(1))
        },
    })

    var tempPwrd = typeof result === "string" ? result : result[0];
    return tempPwrd;
}