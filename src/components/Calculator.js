import "./Calculator.css"
import React, {useState} from "react";
import CalculatorButton from "./CalculatorButton";
import backspacePNG from "../assets/images/backspace-arrow.png";
import arrowSVG from "../assets/svg/arrow-down.svg";

function Calculator() {
    const [displayValue, setDisplayValue] = useState("");

    //setting the theme color
    const acCol = "#41591d",
        signsCol = "#6e5525",
        numbersCol = "#463b22",
        equalCol = "#9B6600FF";

    //I should be able to find actual number where the cursor is
    const findLastNumber = (value) => {
        let lastNumber = "";
        let i = value.length - 1;
        while (i >= 0 && !operators.includes(value[i])) {
            lastNumber += value[i];
            i--;
        }
        return lastNumber;
    }

    function removeTrailingZeros(num) {
        return num.toString().replace(/(\.\d*?[1-9])0+$/g,
            '$1').replace(/\.$/, '');
    }

    const numberHandler = (value) => setDisplayValue(
        displayValue + value);
    const operators = "+−÷×";

    const toNumbers = (value) => {
        const valueLength = value.length;

        for (let i = 0; i < valueLength; i++) {
            switch (value[i]) {
                case "%":
                    value = value.slice(0, i) + "×0.01" + value.slice(i + 1);
                    break;
                case "π":
                    value = value.slice(0, i) + "×3.14159265359"
                        + value.slice(i + 1);
                    break;
                default:
            }
        }
        return value;
    }

    const countOperators = (parsedExp, operator) => {
        if (operator === "+−") {
            while (parsedExp.operators.length !== 0) {
                if (parsedExp.operators[0] === "−") {
                    parsedExp.numbers[0] = parsedExp.numbers[0] -
                        parsedExp.numbers[1];
                } else if (parsedExp.operators[0] === "+") {
                    parsedExp.numbers[0] = parsedExp.numbers[0] +
                        parsedExp.numbers[1];
                } else {
                    new Error();
                }
                parsedExp.numbers.splice(1, 1);
                parsedExp.operators.splice(0, 1);
            }
        } else if (operator === "×÷") {
            let i = 0;
            while (i !== parsedExp.operators.length) {
                if (parsedExp.operators[i] === "÷") {
                    parsedExp.numbers[i] = parsedExp.numbers[i] /
                        parsedExp.numbers[i + 1];
                } else if (parsedExp.operators[i] === "×") {
                    parsedExp.numbers[i] = parsedExp.numbers[i] *
                        parsedExp.numbers[i + 1];
                } else {
                    i++;
                    continue;
                }
                parsedExp.numbers.splice(i + 1, 1);
                parsedExp.operators.splice(i, 1);
            }
        }
    }

    const parseExp = (value) => {
        const signsRegExp = /[+÷×]|−(?=\d)/g;
        let parsed = {}

        parsed.numbers = value.split(signsRegExp);
        parsed.operators = value.match(signsRegExp);


        for (let i = 0; i < parsed.numbers.length; i++) {
            parsed.numbers[i] = parseFloat(parsed.numbers[i]);
        }

        return parsed
    }
    const countExpression = (exp) => {
        let result;
        const parsedExp = parseExp(toNumbers(exp));

        if (parsedExp.operators !== null) {
            countOperators(parsedExp, "×÷");
            countOperators(parsedExp, "+−");
        }

        if (parsedExp.numbers.length === 1) {
            if (parsedExp.numbers[0].toString().length > 13)
                result = parsedExp.numbers[0].toFixed(13);
            else result = parsedExp.numbers[0];
        }

        return removeTrailingZeros(result);
    }

    const calculate = () => {
        let result;
        let valueLength = displayValue.length;
        let expFull = displayValue;

        if (expFull.includes("(")) {
            for (let i = 0; i < valueLength; i++) {
                if (expFull[i] === "(" &&
                    !operators.includes(expFull[i - 1]) && i !== 0) {
                    expFull = expFull.slice(0, i) + "×"
                        + expFull.slice(i);
                }
            }
            valueLength = expFull.length;
            for (let i = valueLength - 1; i >= 0; i--) {
                if (expFull[i] === "(") {
                    let from = i, to = i, expPart;

                    while (expFull[to] !== ")" &&
                    to !== valueLength) to++;
                    expPart = expFull.slice(from + 1, to);
                    expFull = expFull.slice(0, from) +
                        countExpression(expPart).toString() +
                        expFull.slice(to + 1);
                }
            }
        }

        result = countExpression(expFull);
        setDisplayValue(result.toString());
    }

    const dotHandler = () => {
        if (!findLastNumber(displayValue).includes("."))
            setDisplayValue(displayValue + ".");
    }
    const signHandler = (sign) => {
        const valueLength = displayValue.length;
        const lastChar = displayValue[valueLength - 1];

        if ((displayValue === "" && sign !== "−") || sign === lastChar) return;
        if (displayValue === "" && sign === "−") {
            setDisplayValue(displayValue + "-");
            return;
        }

        if (operators.includes(lastChar)) {
            if (sign === "−") {
                setDisplayValue(displayValue + "−");
            } else {
                if (operators.includes(displayValue[valueLength - 2])) {
                    setDisplayValue(displayValue.slice(0, -2) + sign);
                } else {
                    setDisplayValue(displayValue.slice(0, -1) + sign);
                }
            }
        } else if (lastChar === "(") {
            setDisplayValue(displayValue + "-");
        } else {
            setDisplayValue(displayValue + sign);
        }
    }
    const bracketsHandler = () => {
        const lastChar = displayValue[displayValue.length - 1];
        const openBracketsCount =
            (displayValue.match(/\(/g) || []).length;
        const closeBracketsCount =
            (displayValue.match(/\)/g) || []).length;

        if (operators.includes(lastChar) ||
            closeBracketsCount >= openBracketsCount) {
            setDisplayValue(displayValue + "(");
        } else {
            setDisplayValue(displayValue + ")");
        }
    }
    const clearHandler = () => setDisplayValue("");
    const backspaceHandler = () =>
        setDisplayValue(displayValue.slice(0, -1));

    return (
        <div className={"calculator"}>
            <div className={"display"}>
                <input type={"text"} value={displayValue}
                       onChange={(e) =>
                           setDisplayValue(e.target.value)}/>
            </div>
            <div style={{margin: "1rem 0"}} className={"button-bar top-buttons"}>
                <div onClick={() => signHandler("√")}><p>√</p></div>
                <div onClick={() => signHandler("π")}><p>π</p></div>
                <div onClick={() => signHandler("^")}><p>^</p></div>
                <div onClick={() => signHandler("!")}><p>!</p></div>
                <button className={"arrow-button"}
                        style={{backgroundColor: numbersCol}}>
                    <img src={arrowSVG} alt={"arrow"}/>
                </button>
            </div>
            <div className={"button-bar"}>
                <div onClick={clearHandler}>
                    <CalculatorButton backgroundColor={acCol}>
                        AC
                    </CalculatorButton>
                </div>
                <div onClick={bracketsHandler}>
                    <CalculatorButton sign={"mid"} backgroundColor={signsCol}>
                        ( )
                    </CalculatorButton>
                </div>
                <div onClick={() => signHandler("%")}>
                    <CalculatorButton sign={"mid"} backgroundColor={signsCol}>
                        %
                    </CalculatorButton>
                </div>
                <div onClick={() => signHandler("÷")}>
                    <CalculatorButton sign={"small"} backgroundColor={signsCol}>
                        ÷
                    </CalculatorButton>
                </div>
            </div>
            <div className={"button-bar"}>
                <div onClick={() => numberHandler(7)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        7
                    </CalculatorButton>
                </div>
                <div onClick={() => numberHandler(8)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        8
                    </CalculatorButton>
                </div>
                <div onClick={() => numberHandler(9)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        9
                    </CalculatorButton>
                </div>
                <div onClick={() => signHandler("×")}>
                    <CalculatorButton sign={"small"} backgroundColor={signsCol}>
                        ×
                    </CalculatorButton>
                </div>
            </div>
            <div className={"button-bar"}>
                <div onClick={() => numberHandler(4)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        4
                    </CalculatorButton>
                </div>
                <div onClick={() => numberHandler(5)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        5
                    </CalculatorButton>
                </div>
                <div onClick={() => numberHandler(6)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        6
                    </CalculatorButton>
                </div>
                <div onClick={() => signHandler("−")}>
                    <CalculatorButton sign={"small"} backgroundColor={signsCol}>
                        −
                    </CalculatorButton>
                </div>
            </div>
            <div className={"button-bar"}>
                <div onClick={() => numberHandler(1)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        1
                    </CalculatorButton>
                </div>
                <div onClick={() => numberHandler(2)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        2
                    </CalculatorButton>
                </div>
                <div onClick={() => numberHandler(3)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        3
                    </CalculatorButton>
                </div>
                <div onClick={() => signHandler("+")}>
                    <CalculatorButton sign={"small"} backgroundColor={signsCol}>
                        +
                    </CalculatorButton>
                </div>
            </div>
            <div className={"button-bar"}>
                <div onClick={() => numberHandler(0)}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        0
                    </CalculatorButton>
                </div>
                <div onClick={() => dotHandler(".")}>
                    <CalculatorButton sign={"mid"} backgroundColor={numbersCol}>
                        •
                    </CalculatorButton>
                </div>
                <div onClick={backspaceHandler}>
                    <CalculatorButton backgroundColor={numbersCol}>
                        <img src={backspacePNG} alt={"backspace"}
                             style={{marginTop: "0.5rem"}}/>
                    </CalculatorButton>
                </div>
                <div onClick={calculate}>
                    <CalculatorButton sign={"small"} backgroundColor={equalCol}>
                        =
                    </CalculatorButton>
                </div>
            </div>
        </div>
    )
}

export default Calculator;