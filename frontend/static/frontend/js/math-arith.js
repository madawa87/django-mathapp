import { csrftoken, feedback_modal_div, modal_button, setModal, TIMELIMIT, timePassed,
    timeLeft, timerPaused, timerInterval, startTimer, mathQuestion, updateInventory, updateStreak } from "./modules/math-base.js";

console.log("____ imported ___");

modal_button.addEventListener('click', function (ev) {
    feedback_modal_div.classList = [];
    feedback_modal_div.classList.add('hidden');
    timerPaused = false;
    answerInput.focus();
});

let ans = document.getElementById('correct-answer');
let answerInput = document.getElementById('answer-input');
let q_type_p = document.getElementById('q-type-p');
let q_id = 0

let difficulty_level = 1;

function clearStreaks() {
    component_streak = component_streak_default;
    dive_streak = 0;
    ultra_streak = 0;
    master_streak = 0;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function populateEquationJS() {
    console.log("generating eqn in JS");
    
    op_arr = ['+', '-']
    let operator = op_arr[~~(Math.random() * op_arr.length)];
    console.log("operator = " + operator);
    const op1 = getRandomInt(150);
    const op2 = getRandomInt(99);
    console.log("op1 = " + op1);
    console.log("op2 = " + op2);
    
    let answer = 0
    if (operator === '+') {
        answer = op1 + op2;
    }
    else {
        answer = op1 - op2;
    }
    console.log("ans = " + answer);
    mathQuestion.innerText = '' + op1 + ' ' + operator + ' ' + op2 + ' =';
    ans.innerText = answer;
}

function populateEquationDB() {
    let url = 'http://127.0.0.1:8000/api/randomQuestion/';
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);

            mathQuestion.innerText = '' + data['operand1'] + ' ' + data['operator'] + ' ' + data['operand2'];
            ans.innerText = data['answer'];
            q_type_p.innerHTML = data['type']
            q_id = data['id']
        });
        answerInput.value = '';
        // generateEquation();
    }

function populateLvlEquationDB() {
    let url = 'http://127.0.0.1:8000/api/levelRandomQuestion/';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            level: difficulty_level,
        })})
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            if (data['ans_method'] == 'MCQ') {
                
            }
            mathQuestion.innerText = '' + data['operand1'] + ' ' + data['operator'] + ' ' + data['operand2'];
            ans.innerText = data['answer'];
            q_type_p.innerHTML = data['type']
            q_id = data['id']
        });
    answerInput.value = '';
}

// populateEquationDB();
populateLvlEquationDB();
// focus on answer input
answerInput.focus();

const TR1_THRESHOLD = l1_thr;
const TR2_THRESHOLD = l2_thr;
const TR3_THRESHOLD = l3_thr;

const REMAINING_TIME_COLOR_CODES = {
    l1: {
        reward: 'x 1',
        color: "bg-red-500",
        threshold: l1_thr,
    },
    l2: {
        reward: 'x 2',
        color: "bg-orange-500",
        threshold: l2_thr,
    },
    l3: {
        reward: 'x 3',
        color: "bg-yellow-400",
        threshold: l3_thr
    },
    l4: {
        reward: 'x 4',
        color: "bg-green-500",
        threshold: l4_thr
    }
};


startTimer();

function checkAnswer() {
    let url = `http://127.0.0.1:8000/api/questions/${q_id}/checkAnswer/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            answer: answerInput.value,
            time_left: timeLeft
        })
    }).then(res => {
        return res.json()
    }).then((data) => {
        console.log(data)
        if (data['correct']) {
            // answer is corrrect
            console.log("correct");
        }
        else {
            // answer is wrong
            console.log("wrong answer");
        }
    });
}

// function updateCoins(inc) {
//     console.log("updating pballs..");

//     // using new built in template tags in Django, defined user_id in math.html template
//     const uid = JSON.parse(document.getElementById('user_id').textContent);
//     let url = `http://127.0.0.1:8000/api/users/${uid}/updateCoins/`
//     let coin_inc = 0;
//     if (inc) {
//         coin_inc = Math.ceil(timeLeft/5)
//     } else {
//         coin_inc = -1;
//     }
//     console.log("pballs change = " + coin_inc);

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//             'x-CSRFToken' : csrftoken
//         },
//         body: JSON.stringify({
//             amount: coin_inc
//         })
//     }).then(res => {
//         console.log("res : " + res)
//         return res.json()
//     }).then((data) => {
//         if (data['updated']) {
//             document.getElementById("pk-b1").innerText = data['coins'];
//             console.log("new coins = " + data['coins']);
//         }
//     })
// }


// function updatePballs(inc) {
//     console.log("updating pballs..");

//     // using new built in template tags in Django defined user_id in math.html template
//     const uid = JSON.parse(document.getElementById('user_id').textContent);
//     let url = `http://127.0.0.1:8000/api/users/${uid}/updatePokeballs/`

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//             'x-CSRFToken' : csrftoken
//         },
//         body: JSON.stringify({
//             inc: inc,
//             timeLeft: timeLeft
//         })
//     }).then(res => {
//         console.log("res : " + res)
//         return res.json()
//     }).then((data) => {
//         if (data['updated']) {
//             document.getElementById("pk-b1").innerText = data['pb1'];
//             document.getElementById("pk-b2").innerText = data['pb2'];
//             document.getElementById("pk-b3").innerText = data['pb3'];
//             document.getElementById("pk-b4").innerText = data['pb4'];
//             // console.log("new coins = " + data['coins']);
//         }
//     })
// }


// function updateInventory(inc_bool, pass_inc) {
//     console.log("updating inventory..");

//     // using new built in template tags in Django defined user_id in math.html template
//     const uid = JSON.parse(document.getElementById('user_id').textContent);
//     let url = `http://127.0.0.1:8000/api/users/${uid}/updateInventory/`

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/json',
//             'x-CSRFToken' : csrftoken
//         },
//         body: JSON.stringify({
//             inc: inc_bool,
//             inc_pass: pass_inc,
//             timeLeft: timeLeft
//         })
//     }).then(res => {
//         console.log("res : " + res)
//         return res.json()
//     }).then((data) => {
//         if (data['updated']) {
//             document.getElementById("pk-b1").innerText = data['pb1'];
//             document.getElementById("pk-b2").innerText = data['pb2'];
//             document.getElementById("pk-b3").innerText = data['pb3'];
//             document.getElementById("pk-b4").innerText = data['pb4'];
//             document.getElementById("coin1").innerText = data['coin'];
//             document.getElementById("comp1").innerText = data['comp'];
//             document.getElementById("passes-span-lf").innerText = data['lt_passes'];
//             // console.log("new coins = " + data['coins']);
//         }
//     })
// }


let submit_button = document.getElementById('submit');

// let db_streak_span = document.getElementById('db-streak');
// let ub_streak_span = document.getElementById('ub-streak');
// let mb_streak_span = document.getElementById('mb-streak');
// let passes_span = document.getElementById('passes-span');

// function updateStreak(is_correct) {
//     if (is_correct) {
//         component_streak = component_streak + 2;
//         component_streak_p.innerHTML = component_streak;
//         component_streak_div.style.width = `${component_streak}%`
//     }

//     pass_inc = 0;
//     if (is_correct && timeLeft > 5) {
//         dive_streak ++;
//         if (timeLeft > 10) {
//             ultra_streak ++;
//         } else {
//             ultra_streak = 0;
//         }
//         if (timeLeft > 15) {
//             master_streak ++;
//         } else {
//             master_streak = 0;
//         }
//     }
//     else {
//         dive_streak = 0;
//         ultra_streak = 0;
//         master_streak = 0;
//     }

//     if (dive_streak >= 10) {
//         passes_span.innerText = parseInt(passes_span.innerText) + 1;
//         dive_streak = 0;
//         pass_inc++;
//     }
//     if (ultra_streak >= 5) {
//         passes_span.innerText = parseInt(passes_span.innerText) + 1;
//         ultra_streak = 0;
//         pass_inc++;
//     }
//     if (master_streak >= 3) {
//         passes_span.innerText = parseInt(passes_span.innerText) + 1;
//         master_streak = 0;
//         pass_inc++;
//     }

//     db_streak_span.innerText = dive_streak;
//     ub_streak_span.innerText = ultra_streak;
//     mb_streak_span.innerText = master_streak;
//     return pass_inc;
// }

answerInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        timerPaused = true;
        checkAnswer();

        console.log(answerInput.value);
        feedback_modal_div.classList.remove("hidden");
        modal_button.focus();

        if (answerInput.value === ans.innerText) {
            // answer is correct
            setModal(true);
            
            // update streaks
            pass_inc = updateStreak(true);
            
            updateInventory(true, pass_inc);
            // reload current page
            // window.location.href = window.location.href;
            
            // populate equation instead of reloading current page
            // populateEquationDB();
            populateLvlEquationDB();
            
            clearInterval(timerInterval);
            timePassed = 0;
            timeLeft = TIMELIMIT - timePassed;
            startTimer();
        }
        else {
            // answer is wrong
            setModal(false);
            pass_inc = updateStreak(false);
            updateInventory(false, pass_inc);
            answerInput.value = ''
        }
    }
});
