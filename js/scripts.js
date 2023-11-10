const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");

class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.currentOperation = "";
  }

  addDigit(digit) {
    if (digit === "." && this.currentOperationText.innerText.includes(".")) {
      return;
    }
    this.currentOperation = digit;
    this.updateScreen();
  }

  processOperation(operation) {
    if (this.currentOperationText.innerText === "" && operation !== "C") {
      if (this.previousOperationText.innerText !== "") {
        this.changeOperation(operation);
      }
      return;
    }

    let operationValue;
    let previous = +this.previousOperationText.innerText.split(" ")[0];
    let current = +this.currentOperationText.innerText;

    switch (operation) {
      case "+":
        operationValue = previous + current;
        break;
      case "-":
        operationValue = previous - current;
        break;
      case "*":
        operationValue = previous * current;
        break;
      case "/":
        operationValue = previous / current;
        break;
      case "DEL":
        this.processDelOperator();
        return;
      case "CE":
        this.processClearCurrentOperator();
        return;
      case "C":
        this.processClearOperator();
        return;
      case "=":
        this.processEqualOperator();
        return;
      default:
        return;
    }
    this.updateScreen(operationValue, operation, current, previous);
    this.saveCalculation(operationValue, operation, current, previous);
  }

  updateScreen(operationValue = null, operation = null, current = null, previous = null) {
    if (operationValue === null) {
      this.currentOperationText.innerText += this.currentOperation;
    } else {
      if (previous === 0) {
        operationValue = current;
      }
      this.previousOperationText.innerText = `${operationValue} ${operation}`;
      this.currentOperationText.innerText = "";
    }
  }

  changeOperation(operation) {
    const mathOperations = ["*", "-", "+", "/"];
    if (!mathOperations.includes(operation)) {
      return;
    }
    this.previousOperationText.innerText =
      this.previousOperationText.innerText.slice(0, -1) + operation;
  }

  processDelOperator() {
    this.currentOperationText.innerText =
      this.currentOperationText.innerText.slice(0, -1);
  }

  processClearCurrentOperator() {
    this.currentOperationText.innerText = "";
  }

  processClearOperator() {
    this.currentOperationText.innerText = "";
    this.previousOperationText.innerText = "";
  }

  processEqualOperator() {
    let operation = this.previousOperationText.innerText.split(" ")[1];
    this.processOperation(operation);
  }

  saveCalculation(operationValue, operation, current, previous) {
    const calculation = {
      expression: `${previous} ${operation} ${current}`,
      result: operationValue,
      time: new Date().toLocaleTimeString()
    };
    let calculations = JSON.parse(localStorage.getItem("calculations")) || [];
    calculations.push(calculation);
    localStorage.setItem("calculations", JSON.stringify(calculations));
  }
}

const calc = new Calculator(previousOperationText, currentOperationText);

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;

    if (+value >= 0 || value === ".") {
      calc.addDigit(value);
    } else {
      calc.processOperation(value);
    }
  });
});

function showHistory() {
  let calculations = JSON.parse(localStorage.getItem("calculations")) || [];
  console.log(calculations); // Substitua por uma implementação para exibir na interface
}

showHistory();