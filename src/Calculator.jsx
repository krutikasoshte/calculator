import { useState } from "react";

export default function Calculator() {
  const [tokens, setTokens] = useState([]);
  const [currentInput, setCurrentInput] = useState("0");
  const [justCalculated, setJustCalculated] = useState(false);
  const [equationDone, setEquationDone] = useState("");

  const roundResult = (num) => Math.round(num * 1e10) / 1e10;

  const appendNumber = (number) => {
    if (justCalculated) {
      setTokens([]);
      setEquationDone("");
      setCurrentInput(number === "." ? "0." : number);
      setJustCalculated(false);
      return;
    }
    if (currentInput === "0" && number !== ".") {
      setCurrentInput(number);
    } else if (number === "." && currentInput.includes(".")) {
      return;
    } else {
      setCurrentInput(currentInput + number);
    }
  };

  const chooseOperator = (op) => {
    setJustCalculated(false);
    setEquationDone("");
    setTokens([...tokens, currentInput, op]);
    setCurrentInput("0");
  };

  const calculate = () => {
    if (currentInput === "") return;
    const fullTokens = [...tokens, currentInput];
    if (fullTokens.length < 3) return;

    let pass1 = [];
    let i = 0;
    while (i < fullTokens.length) {
      const token = fullTokens[i];
      if (token === "×" || token === "÷") {
        const prev = parseFloat(pass1.pop());
        const next = parseFloat(fullTokens[i + 1]);
        const result =
          token === "×" ? prev * next : next === 0 ? "Error" : prev / next;
        pass1.push(result.toString());
        i += 2;
      } else {
        pass1.push(token);
        i++;
      }
    }

    if (pass1.includes("Error")) {
      setCurrentInput("Error");
      setTokens([]);
      setEquationDone("");
      setJustCalculated(true);
      return;
    }

    let result = parseFloat(pass1[0]);
    for (let j = 1; j < pass1.length; j += 2) {
      const op = pass1[j];
      const num = parseFloat(pass1[j + 1]);
      if (op === "+") result += num;
      if (op === "-") result -= num;
    }

    setEquationDone(fullTokens.join(" ") + " =");
    setCurrentInput(roundResult(result).toString());
    setTokens([]);
    setJustCalculated(true);
  };

  const clearAll = () => {
    setTokens([]);
    setCurrentInput("0");
    setEquationDone("");
    setJustCalculated(false);
  };

  const toggleSign = () => {
    if (currentInput === "0") return;
    setCurrentInput(
      currentInput.startsWith("-") ? currentInput.slice(1) : "-" + currentInput
    );
  };

  const percent = () => {
    setCurrentInput((parseFloat(currentInput) / 100).toString());
  };

  const topLine = justCalculated ? equationDone : tokens.join(" ");

  const numberBtn =
    "h-16 rounded-lg text-xl font-medium text-[#f4f1ea] bg-[#1f3352] hover:bg-[#2a4265] active:scale-95 transition-all";
  const functionBtn =
    "h-16 rounded-lg text-base font-medium text-[#e0c47c] bg-transparent border border-[#c9a24b66] hover:bg-[#c9a24b1a] active:scale-95 transition-all";
  const operatorBtn =
    "h-16 rounded-lg text-xl font-medium text-[#c9a24b] bg-transparent border border-[#c9a24b] hover:bg-[#c9a24b1f] active:scale-95 transition-all";
  const equalsBtn =
    "h-16 rounded-lg text-xl font-bold text-[#0f1b2d] bg-gradient-to-br from-[#e0c47c] to-[#c9a24b] shadow-lg shadow-[#c9a24b4d] hover:brightness-105 active:scale-95 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1220] to-[#16243b] p-6">
      <div className="w-full max-w-sm bg-[#0f1b2d] rounded-2xl p-6 border border-[#c9a24b40] shadow-2xl">
        <div className="text-right px-2 pt-6 pb-4 mb-5 border-b border-[#c9a24b33]">
          <div className="min-h-[22px] text-base text-[#8fa1b8] tracking-wide break-all">
            {topLine || "\u00A0"}
          </div>
          <div className="text-5xl font-light text-[#f4f1ea] tracking-wide break-all">
            {currentInput}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button className={functionBtn} onClick={clearAll}>AC</button>
          <button className={functionBtn} onClick={toggleSign}>+/-</button>
          <button className={functionBtn} onClick={percent}>%</button>
          <button className={operatorBtn} onClick={() => chooseOperator("÷")}>÷</button>

          <button className={numberBtn} onClick={() => appendNumber("7")}>7</button>
          <button className={numberBtn} onClick={() => appendNumber("8")}>8</button>
          <button className={numberBtn} onClick={() => appendNumber("9")}>9</button>
          <button className={operatorBtn} onClick={() => chooseOperator("×")}>×</button>

          <button className={numberBtn} onClick={() => appendNumber("4")}>4</button>
          <button className={numberBtn} onClick={() => appendNumber("5")}>5</button>
          <button className={numberBtn} onClick={() => appendNumber("6")}>6</button>
          <button className={operatorBtn} onClick={() => chooseOperator("-")}>-</button>

          <button className={numberBtn} onClick={() => appendNumber("1")}>1</button>
          <button className={numberBtn} onClick={() => appendNumber("2")}>2</button>
          <button className={numberBtn} onClick={() => appendNumber("3")}>3</button>
          <button className={operatorBtn} onClick={() => chooseOperator("+")}>+</button>

          <button className={`${numberBtn} col-span-2 text-left pl-6`} onClick={() => appendNumber("0")}>0</button>
          <button className={numberBtn} onClick={() => appendNumber(".")}>.</button>
          <button className={equalsBtn} onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  );
}