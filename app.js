const add      = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;

const operate = (operator, a, b) => {
    if      (operator === '+') return add(a, b);
    else if (operator === '-') return subtract(a, b);
    else if (operator === '*') return multiply(a, b);
    else if (operator === '/') return divide(a, b);
    else {
        console.error('Invalid operator');
    }
}

// add clicked buttons to screen
const screen = document.querySelector('.screen');
let started = false;
const screenBtns = document.querySelectorAll('.concat-screen');
screenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (started) screen.innerText += btn.textContent;
        else {
            screen.innerText = btn.textContent;
            started = true;
        }
})
});

// clear button
const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
    started = false;
    screen.innerText = '0';
});

// delete button
const deleteBtn = document.querySelector('#delete-btn');
deleteBtn.addEventListener('click', () => {
    if (!started) return;

    let newStr;
    if (screen.innerText.length === 1){ 
        newStr = '0';
        started = false;
    } else newStr = screen.innerText.substring(0, screen.innerText.length - 1);

    screen.innerText = newStr;
});