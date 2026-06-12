// initial pokeballs
let pk_balls = 10

console.log("🇱🇰");

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
const emoji_name_span = document.getElementById('emoji-name-span');
const reward_pb_img = document.getElementById('reward_image');

// const n_row = 8;
// const n_col = 5;
// const n_row = 6;
// const n_col = 5;
const match_data = JSON.parse(
    document.getElementById("match-data").textContent
);
var n_row = match_data.n_row;
var n_col = match_data.n_col;
if (n_row > 11) {n_row = 10};
if (n_row < 2) {n_row = 2};
if (n_col > 5) {n_col = 5};
if (n_col < 2) {n_col = 2};

if (n_col*n_row % 2 == 1) {n_col = 4; n_row=4};

console.log("shape:", n_row, n_col)

const n_boxes = n_row*n_col;
const n_numbers = 0.5*n_boxes;
let reward_bar_width = 100;
const click_pen = (100-50)/n_boxes;
var puzzle_numbers = [];
var puzzle_symbols = [];
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


function getRandomEmojies(em_arr, n) {
    const shuffled_emo = [...em_arr];

    for (let i = shuffled_emo.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [shuffled_emo[i], shuffled_emo[j]] = [shuffled_emo[j], shuffled_emo[i]];
    }

    return shuffled_emo.slice(0, n);
}

window.addEventListener('DOMContentLoaded', async (event) => {
    // load emoji
    const response = await fetch("http://127.0.0.1:8000/api/emojiCategories/");
    const categories = await response.json();

    const emoji_pool = categories.flag;
    const selected_emoji_set  =getRandomEmojies(emoji_pool, n_numbers);
    console.log(selected_emoji_set);

    selected_emoji_set.forEach(element => {
        console.log(element.emoji)
    });
    

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

            // add image instead of gradient
            rowitem.setAttribute('class','flex items-center justify-center h-12 w-12 m-2 border-2 border-cyan-200 rounded-lg overflow-hidden text-2xl font-medium');
            // By using a combination of hover:border-cyan-400 and an inner shadow, 
            // // you get the exact visual effect of a thicker border without changing layout sizes!
            // rowitem.setAttribute('class', 'flex items-center justify-center h-12 w-12 m-2 border-2 border-cyan-200 rounded-lg overflow-hidden text-2xl font-medium shadow-sm transition-all duration-150 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(34,211,238,0.6),_inset_0_0_0_2px_#22d3ee] cursor-pointer');
            rowitem.style.backgroundImage = `url('${tile_facedown_src}')`;
            rowitem.style.backgroundSize = 'cover';
            rowitem.style.backgroundPosition = 'center';

            // 2. Add the glow when the mouse enters the tile
            rowitem.onmouseenter = function () {
                this.style.boxShadow = '0 0 24px rgba(34, 211, 238, 0.6)'; // Soft cyan glow
                this.style.borderColor = '#22d3ee'; // Brighten border slightly to match
            };

            // 3. Remove the glow when the mouse leaves the tile
            rowitem.onmouseleave = function () {
                this.style.boxShadow = 'none';
                this.style.borderColor = '#cffafe'; // Return to your base border color (cyan-200)
            };

            // gradient bg
            // rowitem.setAttribute('class','flex items-center justify-center h-12 w-12 m-2 border-2 border-cyan-200 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-950 hover:bg-gradient-to-bl text-2xl font-medium');

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

    // set box emoji and box_map
    for (let i=0; i<n_numbers; i++) {
        const emoji = selected_emoji_set.pop();
        const b1_id = shuffled_puzzle_boxes.pop();
        const b2_id = shuffled_puzzle_boxes.pop();
        // document.getElementById(b1_id).innerHTML = emoji.emoji;
        // document.getElementById(b2_id).innerHTML = emoji.emoji;
        document.getElementById(b1_id).innerHTML = '';
        document.getElementById(b2_id).innerHTML = '';

        box_map.set(b1_id, emoji);
        box_map.set(b2_id, emoji);
    }

    
    for (const [bid, emo] of box_map.entries()) {
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
            ev.target.innerHTML = emo.emoji;

            // set bg image empty
            ev.target.style.backgroundImage = '';
            emoji_name_span.innerHTML =  emo.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            console.log(emo.id);
            
            if (flipped_box_id == null) {
                flipped_box_id = bid;
                return;
            }
            
            let f_box = document.getElementById(flipped_box_id);
            
            if (emo.emoji == f_box.innerHTML) {
                // alert("hooray!!");
                reward_bar_width += 3 * click_pen;
                reward_div.setAttribute("style", `width: ${reward_bar_width}%`);
                updateRewards();
                
                flipped_box_id = null;
                dis_div_classes = 'flex items-center justify-center h-12 w-12 m-2 border-1 border-1 border-slate-600 rounded-lg bg-gradient-to-r from-zinc-200 via-slate-300 to-slate-200 opacity-60 text-xl font-medium';
                f_box.setAttribute('class', dis_div_classes);
                ev.target.setAttribute('class',dis_div_classes);
                f_box.parentElement.replaceChild(f_box.cloneNode(true), f_box);
                ev.target.parentElement.replaceChild(ev.target.cloneNode(true), ev.target);
            } else {
                click_disabled = 1;
                setTimeout(function() {
                    emoji_name_span.innerHTML = '&nbsp;';
                    ev.target.innerHTML = '';
                    ev.target.style.backgroundImage = `url('${tile_facedown_src}')`;
                    
                    f_box.innerHTML = '';
                    f_box.style.backgroundImage = `url('${tile_facedown_src}')`;
                    flipped_box_id = null;
                    click_disabled = 0;
                }, 1000);
            }
        });
    }

    // // set box numbers, and box_map
    // for (i=0; i<n_numbers; i++){
    //     let its_in = true, n;
    //     while(its_in){
    //         n = Math.floor(Math.random() * 100);
    //         its_in = puzzle_numbers.includes(n);
    //     }
    //     puzzle_numbers.push(n);
    //     let b1_id = shuffled_puzzle_boxes.pop();
    //     let b2_id = shuffled_puzzle_boxes.pop();
    //     document.getElementById(b1_id).innerHTML = '';
    //     document.getElementById(b2_id).innerHTML = '';

    //     box_map.set(b1_id, n);
    //     box_map.set(b2_id, n);
    // }

    // for (const [bid, n] of box_map.entries()) {
    //     document.getElementById(bid).addEventListener('click', (ev) => {
    //         if (click_disabled) {
    //             return;
    //         }
            
    //         // prevent clicking the same box triggering a match
    //         if (flipped_box_id == bid){
    //             return;
    //         }

    //         reward_bar_width -= click_pen;
    //         if (reward_bar_width < 1) {
    //             reward_bar_width = 1;
    //         }
    //         reward_div.setAttribute("style", `width: ${reward_bar_width}%`);
    //         updateRewards();
    //         ev.target.innerHTML = n;

    //         if (flipped_box_id == null) {
    //             flipped_box_id = bid;
    //             return;
    //         }
            
    //         let f_box = document.getElementById(flipped_box_id);

    //         if (n == f_box.innerHTML) {
    //             // alert("hooray!!");
    //             reward_bar_width += 3 * click_pen;
    //             reward_div.setAttribute("style", `width: ${reward_bar_width}%`);
    //             updateRewards();

    //             flipped_box_id = null;
    //             dis_div_classes = 'flex items-center justify-center h-12 w-12 m-2 border-1 border-1 border-slate-600 rounded-lg bg-gradient-to-r from-zinc-200 via-slate-300 to-slate-200 opacity-60';
    //             f_box.setAttribute('class', dis_div_classes);
    //             ev.target.setAttribute('class',dis_div_classes);
    //             f_box.parentElement.replaceChild(f_box.cloneNode(true), f_box);
    //             ev.target.parentElement.replaceChild(ev.target.cloneNode(true), ev.target);
    //         } else {
    //             click_disabled = 1;
    //             setTimeout(function() {
    //                 ev.target.innerHTML = '';
    //                 f_box.innerHTML = '';
    //                 flipped_box_id = null;
    //                 click_disabled = 0;
    //             }, 1000);
    //         }
    //     });
    // }
});
    
