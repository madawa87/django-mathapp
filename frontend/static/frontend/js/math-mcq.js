import { 
    csrftoken, feedbackModal, setModal, TIMELIMIT,
    timer, startTimer, mathQuestion, updateInventory, 
    updateStreak 
} from "./modules/math-base.js";

const choice_div = document.getElementById('choice-div');
let difficulty_level = 1;

// div for math equation of word question
// let mathQuestion = document.getElementById('math-eqn');

feedbackModal.button.addEventListener('click', function (ev) {
    feedbackModal.div.classList = [];
    feedbackModal.div.classList.add('hidden');
    timer.timerPaused = false;
});

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
            feedbackModal.div.classList.remove("hidden");
            feedbackModal.button.focus();
            console.log(data);
            if (data['correct'] == true) {
                setModal(true, ans)
                // update streaks
                let pass_inc = updateStreak(true);
            
                updateInventory(true, pass_inc);
                populateLvlMCQDB();
                
                clearInterval(timer.timerInterval);
                timer.timePassed = 0;
                timer.timeLeft = TIMELIMIT - timer.timePassed;
                startTimer();
            }
            else {
                // answer is wrong
                setModal(false, ans);
                let pass_inc = updateStreak(false);
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
            mathQuestion.innerText = data['question'];
            if (data['question'].length >= 50) {
                mathQuestion.classList.remove("text-3xl");
                mathQuestion.classList.add("text-xl");
            }
            console.log(data['s_choices']);
            const ch_list = data['s_choices'].split(',').map(ch => ch.trim());
            console.log(ch_list);

            for(const ch of ch_list) {
                let ch_div = document.createElement('div');
                ch_div.setAttribute('id', data['id']);
                ch_div.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    timer.timerPaused = true;
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
