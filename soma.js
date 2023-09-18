function checkInputs(event, otherInput, sumBtn, clearBtn) {
  let value1Ok = event.target.value != "";
  let value2Ok = otherInput.value != "";
  sumBtn.disabled = !(value1Ok && value2Ok);
  clearBtn.disabled = !(value1Ok || value2Ok);
}

function getIntValue(input) {
  return Math.abs(parseInt(input.value));
}

function spanText(class_, content) {
  return `<span class="${class_}">${content}</span>`;
}

function sumCols(index, carry, span, rows) {
  const td_num1 = rows[1].children[index].textContent;
  const td_num2 = rows[2].children[index].textContent;
  let sum_col = carry + (parseInt(td_num1) || 0) + (parseInt(td_num2) || 0);

  let text = `${spanText("num1", td_num1)} + ${spanText(
    "num2",
    td_num2
  )} = ${sum_col}`;

  let carrySpan = spanText("carry", 1);

  if (carry) {
    rows[0].children[index].textContent = carry;
    text = `(${carrySpan} +) ${text}`;
  }

  if (sum_col >= 10) {
    sum_col = sum_col.toString().slice(-1);
    carry = 1;
    text = `${text} (vai ${carrySpan})`;
  } else {
    carry = 0;
  }
  span.innerHTML = text;
  rows[3].children[index].textContent = sum_col;

  return carry;
}

const NUM_1_INPUT = document.getElementById("num1");
const NUM_2_INPUT = document.getElementById("num2");

const SUM_BTN = document.getElementById("sum_btn");
const CLEAR_BTN = document.getElementById("clear_btn");

const SPAN = document.getElementById("operation");
const ROWS = document.getElementById("rows").children;

let ongoing = false;
let sumLenght;
let currentCol;
let carry;

NUM_1_INPUT.addEventListener("input", (e) =>
  checkInputs(e, NUM_2_INPUT, SUM_BTN, CLEAR_BTN)
);

NUM_2_INPUT.addEventListener("input", (e) =>
  checkInputs(e, NUM_1_INPUT, SUM_BTN, CLEAR_BTN)
);

SUM_BTN.addEventListener("click", () => {
  if (!ongoing) {
    ongoing = true;

    let num1 = getIntValue(NUM_1_INPUT);
    let num2 = getIntValue(NUM_2_INPUT);

    const MAX = Math.max(num1, num2);
    const MIN = Math.min(num1, num2);
    const SUM = num1 + num2;

    [num1, num2] = [MAX, MIN];
    sumLenght = SUM.toString().length;

    NUM_1_INPUT.value = num1;
    NUM_2_INPUT.value = num2;

    for (const row of ROWS) {
      row.innerHTML = "<td></td>".repeat(sumLenght + 2);
    }

    let nums = ["", num1, num2, ""];

    for (let r = 0; r < ROWS.length; r++) {
      let str = nums[r].toString().padStart(sumLenght + 2, " ");

      for (let i = ROWS[r].children.length - 1; i >= 0; i--) {
        ROWS[r].children.item(i).textContent = str[i];
      }
    }

    document.querySelector("#tr2 td").textContent = "+";
    currentCol = 0;
    carry = 0;
    NUM_1_INPUT.readOnly = true;
    NUM_2_INPUT.readOnly = true;
    ROWS[2].style.borderWidth = "medium";
  } else {
    carry = sumCols(sumLenght + 1 - currentCol, carry, SPAN, ROWS);
    currentCol++;

    if (currentCol >= sumLenght) {
      console.log("done");
      SUM_BTN.disabled = true;
    }
  }
});

CLEAR_BTN.addEventListener("click", () => {
  NUM_1_INPUT.readOnly = false;
  NUM_2_INPUT.readOnly = false;
  NUM_1_INPUT.value = "";
  NUM_2_INPUT.value = "";

  SUM_BTN.disabled = true;
  CLEAR_BTN.disabled = true;

  SPAN.textContent = " ";

  for (const row of ROWS) {
    row.innerHTML = "<td> </td>";
  }
  ROWS[2].style.borderWidth = "0px";
  ongoing = false;
});

console.log(`Each value must be between 0 and 4500000000000000`);
