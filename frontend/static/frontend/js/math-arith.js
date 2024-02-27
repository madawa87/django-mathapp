import { 
    csrftoken, feedbackModal, setModal, TIMELIMIT,
    timer, startTimer, mathQuestion, updateInventory, 
    updateStreak 
} from "./modules/math-base.js";

feedbackModal.button.addEventListener('click', function (ev) {
    feedbackModal.div.classList = [];
    feedbackModal.div.classList.add('hidden');
    timer.timerPaused = false;
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

populateLvlEquationDB();
startTimer();

// focus on answer input
answerInput.focus();

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
            time_left: timer.timeLeft
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

let submit_button = document.getElementById('submit');

answerInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        timer.timerPaused = true;
        checkAnswer();

        console.log(answerInput.value);
        feedbackModal.div.classList.remove("hidden");
        feedbackModal.button.focus();

        let pass_inc = 0;

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
            
            clearInterval(timer.timerInterval);
            timer.timePassed = 0;
            timer.timeLeft = TIMELIMIT - timer.timePassed;
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
