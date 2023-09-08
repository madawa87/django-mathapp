// initial pokeballs
let pk_balls = 10

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// populate math-equn

let equn = document.getElementById('math-eqn');
let ans = document.getElementById('correct-answer');
let input_answer = document.getElementById('answer');
let q_id = 0

// streak values
let dive_streak = 0;
let ultra_streak = 0;
let master_streak = 0;

function clearStreaks() {
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
    equn.innerText = '' + op1 + ' ' + operator + ' ' + op2 + ' =';
    ans.innerText = answer;
}

function populateEquationDB() {
    let url = 'http://127.0.0.1:8000/api/randomQuestion/';
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);

            equn.innerText = '' + data['operand1'] + ' ' + data['operator'] + ' ' + data['operand2'];
            ans.innerText = data['answer'];
            q_id = data['id']
        });

    input_answer.value = '';
    // generateEquation();
}


populateEquationDB();
// focus on answer input
input_answer.focus();

// Credit: Mateusz Rybczonec
const FULL_DASH_ARRAY = 283;
const TR1_THRESHOLD = 15;
const TR2_THRESHOLD = 10;
const TR3_THRESHOLD = 5;

const REMAINING_TIME_COLOR_CODES = {
    l1: {
        color: "bg-green-500"
    },
    l2: {
        color: "bg-yellow-400",
        threshold: TR1_THRESHOLD
    },
    l3: {
        color: "bg-orange-500",
        threshold: TR2_THRESHOLD
    },
    l4: {
        color: "bg-pink-700",
        threshold: TR3_THRESHOLD
    }
};

const TIME_LIMIT = 20;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

startTimer();

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    resetRemainingTimeDiv();
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        if (timeLeft < 0) {
            timeLeft = 0
        }
        setRemainingTimeDiv();
        setRemainingTimeDivColor(timeLeft);

        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function setRemainingTimeDivColor(timeLeft) {
    const { l4, l3, l2, l1 } = REMAINING_TIME_COLOR_CODES;
    target_div = document.getElementById("time-left-div");
    if (timeLeft <= l4.threshold) {
        target_div.classList.remove(l3.color);
        target_div.classList.add(l4.color);
    } else if (timeLeft <= l3.threshold) {
        target_div.classList.remove(l2.color);
        target_div.classList.add(l3.color);
    } else if (timeLeft <= l2.threshold) {
        target_div.classList.remove(l1.color);
        target_div.classList.add(l2.color);
    }
}

function setRemainingTimeDiv() {
    const width_perc = `width: ${(100*timeLeft/TIME_LIMIT).toFixed(0)}%`;
    document.getElementById("time-left-div").setAttribute("style", width_perc);
}
function resetRemainingTimeDiv() {
    console.log("resetting time remainin div");
    target_div = document.getElementById("time-left-div");
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l4.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l3.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l2.color);
    target_div.classList.add(REMAINING_TIME_COLOR_CODES.l1.color);
    target_div.setAttribute("style", "width: 100%");
}


function checkAnswer() {
    console.log("checking...")
    console.log("time left = " + timeLeft)
    let url = `http://127.0.0.1:8000/api/questions/${q_id}/checkAnswer/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            answer: input_answer.value,
            time_left: timeLeft
        })
    }).then(res => {
        return res.json()
    }).then((data) => {
        console.log(data)
        if (data['correct']) {
            console.log("GOOD144");
        }
        else {
            console.log("BAD!!!wwww");
        }
    });
}


function updateCoins(inc) {
    console.log("updating pballs..");

    // using new built in template tags in Django defined user_id in math.html template
    const uid = JSON.parse(document.getElementById('user_id').textContent);
    let url = `http://127.0.0.1:8000/api/users/${uid}/updateCoins/`
    let coin_inc = 0;
    if (inc) {
        coin_inc = Math.ceil(timeLeft/5)
    } else {
        coin_inc = -1;
    }
    console.log("pballs change = " + coin_inc);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'x-CSRFToken' : csrftoken
        },
        body: JSON.stringify({
            amount: coin_inc
        })
    }).then(res => {
        console.log("res : " + res)
        return res.json()
    }).then((data) => {
        if (data['updated']) {
            document.getElementById("pk-b1").innerText = data['coins'];
            console.log("new coins = " + data['coins']);
        }
    })
}


function updatePballs(inc) {
    console.log("updating pballs..");

    // using new built in template tags in Django defined user_id in math.html template
    const uid = JSON.parse(document.getElementById('user_id').textContent);
    let url = `http://127.0.0.1:8000/api/users/${uid}/updatePokeballs/`

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'x-CSRFToken' : csrftoken
        },
        body: JSON.stringify({
            inc: inc,
            timeLeft: timeLeft
        })
    }).then(res => {
        console.log("res : " + res)
        return res.json()
    }).then((data) => {
        if (data['updated']) {
            document.getElementById("pk-b1").innerText = data['pb1'];
            document.getElementById("pk-b2").innerText = data['pb2'];
            document.getElementById("pk-b3").innerText = data['pb3'];
            document.getElementById("pk-b4").innerText = data['pb4'];
            // console.log("new coins = " + data['coins']);
        }
    })
}


function updateInventory(inc_bool, pass_inc) {
    console.log("updating inventory..");

    // using new built in template tags in Django defined user_id in math.html template
    const uid = JSON.parse(document.getElementById('user_id').textContent);
    let url = `http://127.0.0.1:8000/api/users/${uid}/updateInventory/`

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'x-CSRFToken' : csrftoken
        },
        body: JSON.stringify({
            inc: inc_bool,
            inc_pass: pass_inc,
            timeLeft: timeLeft
        })
    }).then(res => {
        console.log("res : " + res)
        return res.json()
    }).then((data) => {
        if (data['updated']) {
            document.getElementById("pk-b1").innerText = data['pb1'];
            document.getElementById("pk-b2").innerText = data['pb2'];
            document.getElementById("pk-b3").innerText = data['pb3'];
            document.getElementById("pk-b4").innerText = data['pb4'];
            document.getElementById("passes-span-lf").innerText = data['lt_passes'];
            // console.log("new coins = " + data['coins']);
        }
    })
}


let submit_button = document.getElementById('submit');

let db_streak_span = document.getElementById('db-streak');
let ub_streak_span = document.getElementById('ub-streak');
let mb_streak_span = document.getElementById('mb-streak');
let passes_span = document.getElementById('passes-span');

function updateStreak(is_correct) {
    pass_inc = 0;
    if (is_correct && timeLeft > 5) {
        dive_streak ++;
        if (timeLeft > 10) {
            ultra_streak ++;
        } else {
            ultra_streak = 0;
        }
        if (timeLeft > 15) {
            master_streak ++;
        } else {
            master_streak = 0;
        }
    }
    else {
        dive_streak = 0;
        ultra_streak = 0;
        master_streak = 0;
    }

    if (dive_streak >= 10) {
        passes_span.innerText = parseInt(passes_span.innerText) + 1;
        dive_streak = 0;
        pass_inc++;
    }
    if (ultra_streak >= 5) {
        passes_span.innerText = parseInt(passes_span.innerText) + 1;
        ultra_streak = 0;
        pass_inc++;
    }
    if (master_streak >= 3) {
        passes_span.innerText = parseInt(passes_span.innerText) + 1;
        master_streak = 0;
        pass_inc++;
    }

    db_streak_span.innerText = dive_streak;
    ub_streak_span.innerText = ultra_streak;
    mb_streak_span.innerText = master_streak;
    return pass_inc;
}

input_answer.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkAnswer();

        console.log(input_answer.value);

        if (input_answer.value === ans.innerText) {
            console.log("correct!!!");
            // update streaks
            pass_inc = updateStreak(true);
            
            // updatePballs(true);
            updateInventory(true, pass_inc);
            alert(input_answer.value + " is the correct answer.");

            // reload current page
            // window.location.href = window.location.href;

            // populate equation instead of reloading current page
            populateEquationDB();

            clearInterval(timerInterval);
            timePassed = 0;
            timeLeft = TIME_LIMIT - timePassed;
            startTimer();
        }
        else {
            console.log("wrong answer!!!");
            // updatePballs(false);
            pass_inc = updateStreak(false);
            updateInventory(false, pass_inc);
            alert(input_answer.value + " is not the correct answer.");
            input_answer.value = ''
        }
    }
});
