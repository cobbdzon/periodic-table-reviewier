// util
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// main functions
async function loadElementsRegistry() {
    const response = await fetch("./elements.json")
    const json_data = await response.json()

    return json_data.elements
}

function giveRandomElement(elements_registry) {
    const atomic_number = randomInt(1, elements_registry.length)
    const chemical_symbol = elements_registry[atomic_number - 1][0]
    const chemical_name = elements_registry[atomic_number - 1][1]

    return [atomic_number, chemical_symbol, chemical_name]
}

function trimElementInfo(element) {
    const n_info_to_trim = randomInt(1, 2)

    const element_info = Array.from(element) // clone
    for (let i = 0; i < n_info_to_trim; i++) {
        const random_index = randomInt(0, element_info.length - 1)
        element_info[random_index] = "?"
    }

    return [element_info, element[0]]
}

document.addEventListener("DOMContentLoaded", () => {
    const input_atomic_number = document.getElementById("atomic_number")
    const input_chemical_symbol = document.getElementById("chemical_symbol")
    const input_chemical_name = document.getElementById("chemical_name")

    const element_inputs = [input_atomic_number, input_chemical_symbol, input_chemical_name]

    const button_random_element = document.getElementById("random_element")
    const button_check_answer = document.getElementById("check_answer")

    const answer_reveal = document.getElementById("answer_reveal")
    const wrong_emoji = document.getElementById("wrong_emoji")

    const elements_promise = loadElementsRegistry()

    function randomElementClicked() {
        elements_promise
            .then(giveRandomElement)
            .then(trimElementInfo).then(([element_info, original_atomic_number]) => {
                [atomic_number, chemical_symbol, chemical_name] = element_info

                button_check_answer.removeAttribute("disabled")
                for (let i = 0; i < 3; i++) {
                    element_inputs[i].removeAttribute("disabled")

                    element_inputs[i].value = element_info[i]

                    if (element_info[i] != "?") {
                        element_inputs[i].setAttribute("disabled", "")
                    }
                }

                answer_reveal.style.display = "none"
                wrong_emoji.style.display = "none"
                localStorage.setItem("cobbdzon-ptr-atomicnumber", String(original_atomic_number))
            })
    }

    function checkAnswerClicked() {
        const user_inputs = [input_atomic_number.value, input_chemical_symbol.value, input_chemical_name.value]

        elements_promise.then((elements_registry) => {
            const atomic_number = Number(localStorage.getItem("cobbdzon-ptr-atomicnumber"))
            const answers = Array.from(elements_registry[atomic_number - 1])
            answers.unshift(String(atomic_number))

            answer_reveal.innerText = answers[0] + " : " + answers[1]  + " : " + answers[2]
            
            // compare
            let all_correct = true
            for (let i = 0; i < 3; i++) {
                const user_input = user_inputs[i]
                const answer  = answers[i]

                // has wrong asnwer
                if (user_input != answer) {
                    all_correct = false
                    answer_reveal.style.color = "#FF0000"
                    wrong_emoji.style.display = "unset"
                    break
                }
            }

            // all right answers
            if (all_correct) {
                answer_reveal.style.color = "#00FF00"
            }

            answer_reveal.style.display = "unset"
            button_check_answer.setAttribute("disabled", "")
        })
    }

    button_random_element.onclick = randomElementClicked
    button_check_answer.onclick = checkAnswerClicked

    input_chemical_name.addEventListener("focusout", () => {
        input_chemical_name.value = input_chemical_name.value.toUpperCase()
    })

    randomElementClicked()
})