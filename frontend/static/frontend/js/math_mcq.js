choice_div = document.getElementById('choice-div');

function checkChoice(id, ans) {
    const url = `http://127.0.0.1:8000/api/mcquestions/${id}/checkMCQChoice/`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'x-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            choice: ans
        })})
        .then((resp) => resp.json())
        .then((data) => {
            feedback_modal_div.classList.remove("hidden");
            modal_button.focus();
            console.log(data);
            if (data['correct'] == true) {
                set_modal(true, ans)
                // update streaks
                pass_inc = updateStreak(true);
            
                updateInventory(true, pass_inc);
                populateLvlMCQDB();
                
                clearInterval(timerInterval);
                timePassed = 0;
                timeLeft = TIME_LIMIT - timePassed;
                startTimer();
            }
            else {
                // answer is wrong
                set_modal(false, ans);
                pass_inc = updateStreak(false);
                updateInventory(false, pass_inc);
            }

        });
}

function populateLvlMCQDB() {
    choice_div.innerHTML = '';
    
    let url = 'http://127.0.0.1:8000/api/getLevelRandomMCQ/';
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
            console.log(data);
            equn.innerText = data['question'];
            if (data['question'].length >= 50) {
                equn.classList.remove("text-3xl");
                equn.classList.add("text-xl");
            }
            console.log(data['s_choices']);
            const ch_list = data['s_choices'].split(',').map(ch => ch.trim());
            console.log(ch_list);

            for(const ch of ch_list) {
                ch_div = document.createElement('div');
                ch_div.setAttribute('id', data['id']);
                ch_div.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    timer_paused = true;
                    checkChoice(data['id'], ch);
                });
                ch_div.innerHTML = ch;
                console.log(ch);
                ch_div.setAttribute('class','flex items-center justify-center h-12 grow m-2 border-2 border-cyan-200 rounded-lg bg-gradient-to-r from-purple-300 to-indigo-300 hover:from-indigo-300 hover:to-purple-300');
                choice_div.appendChild(ch_div);
            }
        });
}
populateLvlMCQDB();

function onTimesUp() {
    clearInterval(timerInterval);
}

function startTimer() {
    resetRemainingTimeDiv();
    timerInterval = setInterval(() => {
        if (timer_paused) return;

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
    target_img = document.getElementById("reward_image");
    target_reward = document.getElementById("reward_coins");
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
    const width_perc = `width: ${(100*timeLeft/TIME_LIMIT).toFixed(0)}%`;
    document.getElementById("time-left-div").setAttribute("style", width_perc);
}
function resetRemainingTimeDiv() {
    console.log("resetting time remainin div");
    target_div = document.getElementById("time-left-div");
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l1.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l2.color);
    target_div.classList.remove(REMAINING_TIME_COLOR_CODES.l3.color);
    target_div.classList.add(REMAINING_TIME_COLOR_CODES.l4.color);
    target_div.setAttribute("style", "width: 100%");
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
            document.getElementById("coin1").innerText = data['coin'];
            document.getElementById("comp1").innerText = data['comp'];
            document.getElementById("passes-span-lf").innerText = data['lt_passes'];
            // console.log("new coins = " + data['coins']);
        }
    })
}


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
