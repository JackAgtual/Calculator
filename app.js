// state variables
let started = false;
let operationState;
let prevNum;
let prevBtn; 
let prevOpBtn;
const opBtnDefaultColor = 'rgb(238, 169, 21)';
const opBtnTargetColor = 'rgb(241, 246, 251)';

const operations = ['+', '-', '*', '/'];

// Helper functions
const add      = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;

const operate = (operator, a, b) => {
    let ans;
    if      (operator === '+') ans = add(a, b);
    else if (operator === '-') ans = subtract(a, b);
    else if (operator === '*') ans = multiply(a, b);
    else if (operator === '/') ans = divide(a, b);
    else {
        console.error('Invalid operator');
    }

    return Math.round(ans * 100) / 100;
};

const isValidEval = evalStr => {
    // check if evaluation is valid
    let invalidEnds = [...operations, '.'];
    let okStart = ['+', '-', '.']; // evalStr can start with these chars

    // starts or ends with invalid char
    for (let i = 0; i < invalidEnds.length; i++) {
        if ((evalStr.startsWith(invalidEnds[i]) && !okStart.includes(invalidEnds[i])) || 
            evalStr.endsWith(invalidEnds[i])) return false;
    }

    // two invalid chars next to each other
    for (let i = 1; i < evalStr.length; i++) {
        if (invalidEnds.includes(evalStr.charAt(i)) && 
            invalidEnds.includes(evalStr.charAt(i-1))) return false;
    }

    // contains an operation (can't be first +/-)
    let hasOp = false;
    const startIdx = okStart.includes(evalStr.charAt(0)) ? 1 : 0;
    for (let i = startIdx; i < evalStr.length; i++) {
        if (operations.includes(evalStr.charAt(i))) {
            hasOp = true;
            break;
        }
    }
    if (!hasOp) return false;
    
    return true;
};

const evalExpression = (evalStr, operationState) => {
    
    // operation state is defined (not first time clicking operation)
    if (operationState) return operate(operationState, prevNum, Number(screen.innerText));

    // get index of operation
    let opIdx;
    for (let i = 0; i < evalStr.length; i++) {
        if (operations.includes(evalStr.charAt(i))){
            opIdx = i;
            break;
        }
    }
    
    // evaluate expression
    let op = evalStr.charAt(opIdx);
    let num1 = Number(evalStr.substring(0, opIdx));
    let num2 = Number(evalStr.substring(opIdx + 1));
    
    return operate(op, num1, num2);
}
// End helper functions

// add clicked buttons to screen
const screen = document.querySelector('.screen');
const screenBtns = document.querySelectorAll('.concat-screen');
screenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (started) screen.innerText += btn.textContent;
        else {
            screen.innerText = btn.textContent;
            started = true;
        }

        // clear screen if new number is clicked after operation
        if (operationState && operations.includes(prevBtn)) screen.innerText = btn.innerText;
    });
});

// clear button
const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
    started = false;
    screen.innerText = '0';
    operationState = null;
    prevNum = null;
    if (prevOpBtn) prevOpBtn.style['background-color'] = opBtnDefaultColor;
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

// equal btn 
const equalBtn = document.querySelector('#equals');
equalBtn.addEventListener('click', () => {
    const evalStr = screen.innerText;

    // reset operation btns
    prevOpBtn.style['background-color'] = opBtnDefaultColor;

    if (operationState) {
        screen.innerText = operate(operationState, prevNum, Number(evalStr));
        operationState = null;
        return;
    }

    if (!isValidEval(evalStr)) return;

    screen.innerText = evalExpression(evalStr).toString();
    operationState = null;
});

// evaluate expression when operation btn is clicked 
const opBtns = document.querySelectorAll('.operation');
opBtns.forEach(opBtn => {
    opBtn.addEventListener('click', () => {
        
        // toggle btn styles
        if (prevOpBtn) prevOpBtn.style['background-color'] = opBtnDefaultColor;
        opBtn.style['background-color'] = opBtnTargetColor;
        prevOpBtn = opBtn;

        // if previous button is operation don't do calculation, just switch operation state
        if (operations.includes(prevBtn) && started) {
            operationState = opBtn.innerText;
            return;
        }

        // evaluate the expression if there's and expression on the screen
        let ans = operationState ? evalExpression(screen.innerText, operationState) : Number(screen.innerText);
        screen.innerText = ans;

        // update operationState
        operationState = opBtn.innerText;
        prevNum = ans;
    });
});

// percentage button
const pcntBtn = document.querySelector('#percent');
pcntBtn.addEventListener('click', () => {
    const num = Number(screen.innerText) / 100;
    screen.innerText = `${Math.round(num * 100) / 100}`;
})

// Save previous btn
const allBtns = document.querySelectorAll('button');
allBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        prevBtn = btn.innerText;
    });
});
