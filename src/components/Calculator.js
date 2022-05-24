import { useEffect, useState } from "react";
import "../styles/Calculator.css";
import { keys } from "../data/keys";
import Key from "./Key";

const Calculator = () => {
  const [result, setResult] = useState(0);
  const [query, setQuery] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let historyStr = localStorage.getItem("calculatorHistory");
    if (historyStr !== null) {
      setHistory(JSON.parse(historyStr));
    }
  }, []);
  const calculateResult = (newQuery) => {
    let answer = 0;
    let lastOperator = null;
    for (const ele of newQuery) {
      if (isNaN(ele)) {
        lastOperator = ele;
      } else if (lastOperator !== null) {
        switch (lastOperator) {
          case "/":
            answer /= parseFloat(ele);
            break;
          case "*":
            answer *= parseFloat(ele);
            break;
          case "-":
            answer -= parseFloat(ele);
            break;
          case "+":
            answer += parseFloat(ele);
            break;
          default:
            break;
        }
        lastOperator = null;
      } else {
        answer = ele;
      }
    }
    setResult(answer);
  };

  const handleClick = (label, value) => {
    if (value === null) {
      return;
    }
    switch (value) {
      case "clearEnd":
        if (query.length !== 0 && !isNaN(query[query.length - 1])) {
          let newQuery = [...query];
          newQuery.splice(query.length - 1);
          setQuery(newQuery);
          calculateResult(newQuery);
        }
        return;
      case "clear":
        setQuery([]);
        calculateResult([]);
        return;
      case "back":
        if (query.length !== 0) {
          let newQuery = [...query];
          let last = query[query.length - 1];
          newQuery.splice(query.length - 1);
          if (last.length !== 1) {
            last = last.slice(0, -1);
            newQuery.push(last);
          }
          setQuery(newQuery);
          calculateResult(newQuery);
        }
        return;
      default:
        break;
    }
    switch (value) {
      case "/":
      case "*":
      case "-":
      case "+":
        if (query.length !== 0 && !isNaN(query[query.length - 1])) {
          let newQuery = [...query, value];
          setQuery(newQuery);
          calculateResult(newQuery);
        }
        return;

      default:
        break;
    }

    if (value === "=") {
      if (query.length > 1 && !isNaN(query[query.length - 1])) {
        let newHistory = [...history, { query, result }];
        setHistory(newHistory);
        setQuery([result]);
        localStorage.setItem(JSON.stringify(newHistory));
      }

      return;
    }

    if (query.length === 0 && value !== ".") {
      setQuery([value]);
      calculateResult([value]);
      return;
    }
    if (!isNaN(query[query.length - 1])) {
      let last = query[query.length - 1] + value;
      let newQuery = [...query];
      newQuery.splice(query.length - 1);
      newQuery.push(last);
      setQuery(newQuery);
      calculateResult(newQuery);
    } else {
      if (value !== ".") {
        setQuery([...query, value]);
        calculateResult([...query, value]);
      }
    }
  };

  const handleHistoryClick = (ele) => {
    setQuery(ele.query);
    setResult(ele.result);
  };

  return (
    <div className="container">
      <div className="calculator">
        <div className="display-area">
          <p>
            {query && query.length !== 0
              ? query.join(" ")
              : "Use keypad to calculate..."}
          </p>
          <h1>{result}</h1>
        </div>
        <div className="keys-area">
          {keys.map((ele, i) => (
            <Key
              key={"Key_" + i}
              label={ele.label}
              value={ele.value}
              onClick={handleClick}
            />
          ))}
        </div>
      </div>
      <div className="hitory">
        <div className="display-area">
          {history && history.length !== 0 ? (
            <>
              <h3>History</h3>
              {history.map((ele) => (
                <div className="history-div">
                  <p
                    className="history-item"
                    onClick={(e) => {
                      handleHistoryClick(ele);
                    }}
                  >
                    {ele?.query?.join(" ")} = {ele?.result}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p>There's no history yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Calculator;
