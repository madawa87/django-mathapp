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
let feedbackModal = {
    div: document.getElementById("feedback-modal"),
    h3: document.getElementById("feedback-h3"),
    button: document.getElementById("feedback-button")
};

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
const timer = {
    timePassed: 0,
    timeLeft: TIMELIMIT,
    timerInterval: null,
    timerPaused: false
};

function onTimesUp() {
    clearInterval(timer.timerInterval);
}

function startTimer() {
    resetRemainingTimeDiv();
    timer.timerInterval = setInterval(() => {
        if (timer.timerPaused) return;

        timer.timePassed = timer.timePassed += 1;
        timer.timeLeft = TIMELIMIT - timer.timePassed;
        if (timer.timeLeft < 0) {
            timer.timeLeft = 0;
        }
        setRemainingTimeDiv();
        setRemainingTimeDivColor(timer.timeLeft);
        
        if (timer.timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function setRemainingTimeDivColor(timeLeft) {
    const { l4, l3, l2, l1 } = REMAINING_TIME_COLOR_CODES;
    const target_div = document.getElementById("time-left-div");
    const target_img = document.getElementById("reward_image");
    const target_reward = document.getElementById("reward_coins");
    
    if (timeLeft >= l4.threshold) {
        target_div.classList.remove(l1.color);
        target_div.classList.add(l4.color);
        target_reward.innerHTML = l4.reward;
        // target_img.src = pb_4_src;
    } else if (timeLeft >= l3.threshold) {
        target_div.classList.remove(l4.color);
        target_div.classList.add(l3.color);
        target_reward.innerHTML = l3.reward;
        // target_img.src = pb_3_src;
    } else if (timeLeft >= l2.threshold) {
        target_div.classList.remove(l3.color);
        target_div.classList.add(l2.color);
        target_reward.innerHTML = l2.reward;
        // target_img.src = pb_2_src;
    } else{
        target_div.classList.remove(l2.color);
        target_div.classList.add(l1.color);
        target_reward.innerHTML = l1.reward;
        // target_img.src = pb_1_src;
    }
}

function setRemainingTimeDiv() {
    const width_perc = `width: ${(100*timer.timeLeft/TIMELIMIT).toFixed(0)}%`;
    document.getElementById("time-left-div").setAttribute("style", width_perc);
}

function resetRemainingTimeDiv() {
    const target_div = document.getElementById("time-left-div");
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l1.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l2.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l3.color);
    target_div.classList.add(REMAINING_TIME_COLOR_CODES.l4.color);
    target_div.setAttribute("style", "width: 100%");
}

function updateInventory(inc_bool, pass_inc) {
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
            timeLeft: timer.timeLeft
        })
    }).then(res => {
        return res.json();
    }).then((data) => {
        if (data['updated']) {
            document.getElementById("pk-b1").innerText = data['pb1'];
            document.getElementById("pk-b2").innerText = data['pb2'];
            document.getElementById("pk-b3").innerText = data['pb3'];
            document.getElementById("pk-b4").innerText = data['pb4'];
            document.getElementById("coin1").innerText = data['coin'];
            document.getElementById("comp1").innerText = data['comp'];
            document.getElementById("passes-span-lf").innerText = data['lt_passes'];
        }
    });
}

let db_streak_span = document.getElementById('db-streak');
let ub_streak_span = document.getElementById('ub-streak');
let mb_streak_span = document.getElementById('mb-streak');
let passes_span = document.getElementById('passes-span');

function updateStreak(is_correct) {
    if (is_correct) {
        component_streak = component_streak + 2;
        component_streak_p.innerHTML = component_streak;
        component_streak_div.style.width = `${component_streak}%`;
    }

    let pass_increment = 0;
    if (is_correct && timer.timeLeft > 5) {
        dive_streak ++;
        if (timer.timeLeft > 10) {
            ultra_streak ++;
        } else {
            ultra_streak = 0;
        }
        if (timer.timeLeft > 15) {
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
        pass_increment++;
    }
    if (ultra_streak >= 5) {
        passes_span.innerText = parseInt(passes_span.innerText) + 1;
        ultra_streak = 0;
        pass_increment++;
    }
    if (master_streak >= 3) {
        passes_span.innerText = parseInt(passes_span.innerText) + 1;
        master_streak = 0;
        pass_increment++;
    }

    db_streak_span.innerText = dive_streak;
    ub_streak_span.innerText = ultra_streak;
    mb_streak_span.innerText = master_streak;
    return pass_increment;
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
    const button_bg = "bg-green-600";
    const button_bg_wr = "bg-red-600";
    const button_bg_hv = "hover:bg-green-500";
    const button_bg_hv_wr = "hover:bg-red-500";

    if (is_correct) {
        feedbackModal.h3.innerText = givenAnswer +" is the correct answer!!";
        modal_sym_circ.classList.remove(circ_col_wr);
        modal_sym_circ.classList.add(circ_col);

        modal_sym_svg.classList.remove(svg_stroke_wr);
        modal_sym_svg.classList.add(svg_stroke);
        modal_sym_svg.setAttribute('fill', 'rgb(22 163 74)');
        
        modal_sym_svg_path.setAttribute('d', svg_path);

        feedbackModal.button.classList.remove(button_bg_wr);
        feedbackModal.button.classList.remove(button_bg_hv_wr);
        feedbackModal.button.classList.add(button_bg);
        feedbackModal.button.classList.add(button_bg_hv);
        feedbackModal.button.innerText = "Next Question";
        
        return
    }
    // modal_h3.innerText = inputAnswer.value +" is the wrong answer!!";
    feedbackModal.h3.innerText = givenAnswer +" is the wrong answer!!";
    modal_sym_circ.classList.remove(circ_col);
    modal_sym_circ.classList.add(circ_col_wr);
    
    modal_sym_svg.classList.remove(svg_stroke);
    modal_sym_svg.classList.add(svg_stroke_wr);
    modal_sym_svg.setAttribute('fill', 'rgb(220 38 38)');
    
    modal_sym_svg_path.setAttribute('d', svg_path_wr);
    
    feedbackModal.button.classList.remove(button_bg);
    feedbackModal.button.classList.remove(button_bg_hv);
    feedbackModal.button.classList.add(button_bg_wr);
    feedbackModal.button.classList.add(button_bg_hv_wr);
    feedbackModal.button.innerText = "Try Again";
    return;

}

export { 
    csrftoken,

    feedbackModal,
    setModal,

    startTimer,
    timer,
    TIMELIMIT,

    mathQuestion,
    updateInventory,
    updateStreak
};