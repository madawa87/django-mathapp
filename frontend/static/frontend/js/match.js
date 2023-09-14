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

////////////////////////////////////////////////////////
const app_div = document.getElementById('match-app');
const reward_div = document.getElementById('reward-meter-div');
const reward_pb_img = document.getElementById('reward_image');

const n_row = 6;
const n_col = 5;

const n_boxes = n_row*n_col;
const n_numbers = 0.5*n_boxes;
let reward_bar_width = 100;
const click_pen = (100-50)/n_boxes;
var puzzle_numbers = [];
var puzzle_boxes = [];
var box_map = new Map();
var flipped_box_id = null;
var click_disabled = 0;

const REWARD_COLOR_CODES = {
    l1: {
        color: "bg-red-500",
        threshold: 50,
        pb: pb_1_src
    },
    l2: {
        color: "bg-orange-500",
        pb: pb_3_src,
        threshold: 75
    },
    l3: {
        color: "bg-yellow-400",
        pb: pb_2_src,
        threshold: 95
    },
    l4: {
        color: "bg-green-500",
        pb: pb_4_src
    }
};

function updateRewards() {
    const { l1, l2, l3, l4 } = REWARD_COLOR_CODES;

    if (reward_bar_width < l1.threshold) {
        reward_pb_img.src = l1.pb;
    }
    else if (reward_bar_width < l2.threshold) {
        reward_pb_img.src = l2.pb;
    }
    else if (reward_bar_width < l3.threshold) {
        reward_pb_img.src = l3.pb;
    }
    else {
        reward_pb_img.src = l4.pb;

    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    // create rows of boxes, set id and class
    for(i=0; i<n_row; i++) {
        let rowid = 'row'+i;
        row_div = document.createElement('div');
        row_div.setAttribute('id', rowid);
        row_div.setAttribute('class', 'flex flex-row items-center justify-center h-14 m-2');
        for(j=0; j<n_col; j++){
            let boxid = rowid + '-col'+j;
            rowitem = document.createElement('div');
            rowitem.setAttribute('id', boxid);
            rowitem.innerHTML = i + ', ' + j
            rowitem.setAttribute('class','flex items-center justify-center h-12 w-12 m-2 border-2 border-cyan-200 rounded-lg bg-gradient-to-r from-purple-300 to-indigo-300 hover:from-indigo-300 hover:to-purple-300');
            row_div.appendChild(rowitem);
            puzzle_boxes.push(boxid);
        }
        app_div.appendChild(row_div);
    }

    // shuffle puzzle boxes array
    let shuffled_puzzle_boxes = puzzle_boxes.map(value => ({value, sort:Math.random() }))
        .sort((a,b) => a.sort - b.sort)
        .map(({ value }) => value);
    // alert(shuffled_puzzle_boxes);

    // set box numbers, and box_map
    for (i=0; i<n_numbers; i++){
        let its_in = true, n;
        while(its_in){
            n = Math.floor(Math.random() * 100);
            its_in = puzzle_numbers.includes(n);
        }
        puzzle_numbers.push(n);
        let b1_id = shuffled_puzzle_boxes.pop();
        let b2_id = shuffled_puzzle_boxes.pop();
        document.getElementById(b1_id).innerHTML = '';
        document.getElementById(b2_id).innerHTML = '';

        box_map.set(b1_id, n);
        box_map.set(b2_id, n);
    }

    for (const [bid, n] of box_map.entries()) {
        document.getElementById(bid).addEventListener('click', (ev) => {
            if (click_disabled) {
                return;
            }
            
            // prevent clicking the same box triggering a match
            if (flipped_box_id == bid){
                return;
            }

            reward_bar_width -= click_pen;
            if (reward_bar_width < 1) {
                reward_bar_width = 1;
            }
            reward_div.setAttribute("style", `width: ${reward_bar_width}%`);
            updateRewards();
            ev.target.innerHTML = n;

            if (flipped_box_id == null) {
                flipped_box_id = bid;
                return;
            }
            
            let f_box = document.getElementById(flipped_box_id);

            if (n == f_box.innerHTML) {
                // alert("hooray!!");
                reward_bar_width += 3 * click_pen;
                reward_div.setAttribute("style", `width: ${reward_bar_width}%`);
                updateRewards();

                flipped_box_id = null;
                dis_div_classes = 'flex items-center justify-center h-12 w-12 m-2 border-1 border-1 border-slate-600 rounded-lg bg-gradient-to-r from-zinc-200 via-slate-300 to-slate-200 opacity-60';
                f_box.setAttribute('class', dis_div_classes);
                ev.target.setAttribute('class',dis_div_classes);
                f_box.parentElement.replaceChild(f_box.cloneNode(true), f_box);
                ev.target.parentElement.replaceChild(ev.target.cloneNode(true), ev.target);
            } else {
                click_disabled = 1;
                setTimeout(function() {
                    ev.target.innerHTML = '';
                    f_box.innerHTML = '';
                    flipped_box_id = null;
                    click_disabled = 0;
                }, 1000);
            }
        });
    }
});
    
