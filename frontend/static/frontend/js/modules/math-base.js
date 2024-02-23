// base module for math pages
// this is started from a copy of main math.js

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

// feedback-modal
let feedback_modal_div = document.getElementById("feedback-modal");
let modal_h3 = document.getElementById("feedback-h3");
let modal_button = document.getElementById("feedback-button");

// div for math equation of word question
let mathQuestion = document.getElementById('math-eqn');

// streak values
const component_streak_default = 10;
let component_streak = component_streak_default;
const component_streak_p = document.getElementById('component-prog-p');
const component_streak_div = document.getElementById('component-prog-div');

let dive_streak = 0;
let ultra_streak = 0;
let master_streak = 0;

function clearStreaks() {
    component_streak = component_streak_default;
    dive_streak = 0;
    ultra_streak = 0;
    master_streak = 0;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// time remaining slider
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

const TIMELIMIT = 20;
let timePassed = 0;
let timeLeft = TIMELIMIT;
let timerInterval = null;
var timerPaused = false;

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    resetRemainingTimeDiv();
    timerInterval = setInterval(() => {
        if (timerPaused) return;

        timePassed = timePassed += 1;
        timeLeft = TIMELIMIT - timePassed;
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
    const target_div = document.getElementById("time-left-div");
    const target_img = document.getElementById("reward_image");
    const target_reward = document.getElementById("reward_coins");
    console.log(target_img.src);
    
    if (timeLeft >= l4.threshold) {
        target_div.classList.remove(l1.color);
        target_div.classList.add(l4.color);
        target_reward.innerHTML = l4.reward
        // target_img.src = pb_4_src;
    } else if (timeLeft >= l3.threshold) {
        target_div.classList.remove(l4.color);
        target_div.classList.add(l3.color);
        target_reward.innerHTML = l3.reward
        // target_img.src = pb_3_src;
    } else if (timeLeft >= l2.threshold) {
        target_div.classList.remove(l3.color);
        target_div.classList.add(l2.color);
        target_reward.innerHTML = l2.reward
        // target_img.src = pb_2_src;
    } else{
        target_div.classList.remove(l2.color);
        target_div.classList.add(l1.color);
        target_reward.innerHTML = l1.reward
        // target_img.src = pb_1_src;
    }
}

function setRemainingTimeDiv() {
    const width_perc = `width: ${(100*timeLeft/TIMELIMIT).toFixed(0)}%`;
    document.getElementById("time-left-div").setAttribute("style", width_perc);
}
function resetRemainingTimeDiv() {
    console.log("resetting time remainin div");
    const target_div = document.getElementById("time-left-div");
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l1.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l2.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l3.color);
    target_div.classList.add(REMAINING_TIME_COLOR_CODES.l4.color);
    target_div.setAttribute("style", "width: 100%");
}

// function updateCoins(inc) {
//     console.log("updating pballs..");

//     // using new built in template tags in Django defined user_id in math.html template
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
            document.getElementById("coin1").innerText = data['coin'];
            document.getElementById("comp1").innerText = data['comp'];
            document.getElementById("passes-span-lf").innerText = data['lt_passes'];
            // console.log("new coins = " + data['coins']);
        }
    })
}


// let submit_button = document.getElementById('submit');

let db_streak_span = document.getElementById('db-streak');
let ub_streak_span = document.getElementById('ub-streak');
let mb_streak_span = document.getElementById('mb-streak');
let passes_span = document.getElementById('passes-span');

function updateStreak(is_correct) {
    if (is_correct) {
        component_streak = component_streak + 2;
        component_streak_p.innerHTML = component_streak;
        component_streak_div.style.width = `${component_streak}%`
    }

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

const modal_sym_circ = document.getElementById('sym-circ');
const modal_sym_svg = document.getElementById('sym-svg');
const modal_sym_svg_path = document.getElementById('sym-svg-path');


function setModal (is_correct, givenAnswer) {
    const circ_col = "bg-green-200";
    const circ_col_wr = "bg-red-200";
    const svg_stroke = "text-green-600";
    const svg_stroke_wr = "text-red-600";
    const svg_path = "M 1 14 L 8 22 L 22 1 L 8 17 Z";
    const svg_path_wr = "M 2 3 L 5 1 L 22 20 L 20 21 Z M 22 3 L 19 1 L 2 20 L 4 21 Z";
    const button_bg = "bg-green-600"
    const button_bg_wr = "bg-red-600"
    const button_bg_hv = "hover:bg-green-500"
    const button_bg_hv_wr = "hover:bg-red-500"


    if (is_correct) {
        modal_h3.innerText = givenAnswer +" is the correct answer!!";
        modal_sym_circ.classList.remove(circ_col_wr);
        modal_sym_circ.classList.add(circ_col);

        modal_sym_svg.classList.remove(svg_stroke_wr);
        modal_sym_svg.classList.add(svg_stroke);
        modal_sym_svg.setAttribute('fill', 'rgb(22 163 74)');
        
        modal_sym_svg_path.setAttribute('d', svg_path);

        modal_button.classList.remove(button_bg_wr);
        modal_button.classList.remove(button_bg_hv_wr);
        modal_button.classList.add(button_bg);
        modal_button.classList.add(button_bg_hv);
        modal_button.innerText = "Next Question";
        
        return
    }
    // modal_h3.innerText = inputAnswer.value +" is the wrong answer!!";
    modal_h3.innerText = givenAnswer +" is the wrong answer!!";
    modal_sym_circ.classList.remove(circ_col);
    modal_sym_circ.classList.add(circ_col_wr);
    
    modal_sym_svg.classList.remove(svg_stroke);
    modal_sym_svg.classList.add(svg_stroke_wr);
    modal_sym_svg.setAttribute('fill', 'rgb(220 38 38)');
    
    modal_sym_svg_path.setAttribute('d', svg_path_wr);
    
    modal_button.classList.remove(button_bg);
    modal_button.classList.remove(button_bg_hv);
    modal_button.classList.add(button_bg_wr);
    modal_button.classList.add(button_bg_hv_wr);
    modal_button.innerText = "Try Again";
    return;

}

// inputAnswer.addEventListener('keypress', function (event) {
//     if (event.key === 'Enter') {
//         event.preventDefault();
//         timerPaused = true;
//         checkAnswer();

//         console.log(inputAnswer.value);
//         feedback_modal_div.classList.remove("hidden");
//         modal_button.focus();

//         if (inputAnswer.value === ans.innerText) {
//             // answer is correct
//             setModal(true);
            
//             // update streaks
//             pass_inc = updateStreak(true);
            
//             updateInventory(true, pass_inc);
//             // reload current page
//             // window.location.href = window.location.href;
            
//             // populate equation instead of reloading current page
//             // populateEquationDB();
//             populateLvlEquationDB();
            
//             clearInterval(timerInterval);
//             timePassed = 0;
//             timeLeft = TIMELIMIT - timePassed;
//             startTimer();
//         }
//         else {
//             // answer is wrong
//             setModal(false);
//             pass_inc = updateStreak(false);
//             updateInventory(false, pass_inc);
//             inputAnswer.value = ''
//         }
//     }
// });


export { 
    csrftoken,
    feedback_modal_div,
    modal_button,
    setModal,

    startTimer,
    timerPaused,
    timerInterval,
    timePassed,
    timeLeft,
    TIMELIMIT,

    mathQuestion,
    updateInventory,
    updateStreak

}