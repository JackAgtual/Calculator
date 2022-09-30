const add      = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;
const operations = ['+', '-', '*', '/'];

// state variables
let started = false;
let operationState;
let prevNum;
let prevBtn; 

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
})
});

// clear button
const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
    started = false;
    screen.innerText = '0';
    operationState = null;
    prevNum = null;
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

// check if evaluation is valid
const isValidEval = evalStr => {
    let operations = ['+', '-', '*', '/']
    let invalidEnds = [...operations, '.'];
    let okStart = ['+', '-', '.'];// evalStr can start with these chars

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
}


// equal btn 
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
    let num1  =Number(evalStr.substring(0, opIdx));
    let num2 = Number(evalStr.substring(opIdx + 1));
    
    return operate(op, num1, num2);
}

const equalBtn = document.querySelector('#equals');
equalBtn.addEventListener('click', () => {
    const evalStr = screen.innerText;

    

    if (operationState) {
        screen.innerText = operate(operationState, prevNum, Number(evalStr));
        operationState = null;
        return;
    }

    if (!isValidEval(evalStr)) return;

    screen.innerText = (Math.round(evalExpression(evalStr) * 100) / 100).toString()
    operationState = null;
});

// evaluate expression when operation btn is clicked 
const opBtns = document.querySelectorAll('.operation');
opBtns.forEach(opBtn => {
    opBtn.addEventListener('click', () => {
        
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
        prevNum = Number(ans);
        
    });
})

const allBtns = document.querySelectorAll('button');
allBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log(`btn: ${btn.innerText}\nstarted: ${started}\nprevNum: ${prevNum}\noperationState: ${operationState}\nprevBnt: ${prevBtn}`);
        prevBtn = btn.innerText;
    })
})