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
let app_div = document.getElementById('match-app');
let n_row = 4;
let n_col = 5;

const n_numbers = n_row*n_col/2
var puzzle_numbers = []
var puzzle_boxes = []
var box_map = new Map();
var flipped_box_id = null;
var click_disabled = 0;

window.addEventListener('DOMContentLoaded', (event) => {

    // create rows of boxes, set id and class
    for(i=0; i<n_row; i++) {
        let rowid = 'row'+i;
        row_div = document.createElement('div');
        row_div.setAttribute('id', rowid);
        row_div.setAttribute('class', 'mg-row');
        for(j=0; j<n_col; j++){
            let boxid = rowid + '-col'+j;
            rowitem = document.createElement('div');
            rowitem.setAttribute('id', boxid);
            rowitem.innerHTML = i + ', ' + j
            rowitem.setAttribute('class','mg-box');
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
        console.log('bid = '+bid +' '+ n);
        document.getElementById(bid).addEventListener('click', (event) => {

            if (flipped_box_id == null) {
                event.target.innerHTML = n;
                flipped_box_id = bid;
                console.log('null: ' + bid);
            } else {
                console.log('not null bid: ' + bid);
                console.log('not null flipped_box_id: ' + flipped_box_id);
                event.target.innerHTML = n;
                let f_box = document.getElementById(flipped_box_id);
                if (n == f_box.innerHTML) {
                    alert("hooray!!");
                    flipped_box_id = null;
                } else {
                    // click_disabled = 1;
                    setTimeout(function() {
                        event.target.innerHTML = '';
                        f_box.innerHTML = '';
                        flipped_box_id = null;
                    }, 2000);
                    // click_disabled = 0;
                }
            }
        });
    }
});
    
var myMap = new Map();
myMap.set("0", "foo");
myMap.set(1, "bar");
myMap.set({}, "baz");

for (const entry of myMap.entries()) {
  console.log(entry);
}