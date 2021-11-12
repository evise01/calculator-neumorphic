import styled, {css, ThemeProvider} from "styled-components";
import {useEffect, useState} from "react";
import {LightDown} from "@styled-icons/entypo/LightDown";
import {Moon} from "@styled-icons/entypo/Moon";
import {darkTheme, lightTheme} from "./Theme";

// -- CONSTANTS --
const PLUS = 'plus';
const MINUS = 'minus';
const CROSS = 'cross';
const DIVIDE = 'divide';
const NON_ACTION = null;

const Calculator = styled.div`
  background-color: ${props => props.theme.background};
  width: 100vw;
  height: 100vh;
  padding: 40px 20px;
`;

const Display = styled.div`
  text-align: right;
  margin-bottom: 25px;
  width: 330px;
  height: 100px;
  padding: 2px 4px;
`;

const Result = styled.div`
  font-size: 54px;
  color: ${props => props.theme.text.dark};
`;

const Summary = styled.div`
  font-size: 18px;
  color: ${props => props.theme.summaryColor};
`;

const FunctionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 70px);
  grid-template-rows: repeat(5, 70px);
  column-gap: 20px;
  row-gap: 20px;
`;

const Button = styled.button`
  font-family: 'SF Pro Display', sans-serif;
  font-size: 36px;
  border: 0;
  border-radius: 100%;
  background-color: ${props => props.theme.background};
  filter: drop-shadow(5px 5px 12px ${props => props.theme.shadow.dropShadow5512}) drop-shadow(-5px -5px 10px ${props => props.theme.shadow.dropShadow5510}) drop-shadow(0 4px 4px #00000025);
  box-shadow: inset -3px -3px 10px ${props => props.theme.shadow.innerShadow3310};
  cursor: pointer;

  &:active {
    filter: drop-shadow(-2px -2px 5px ${props => props.theme.shadow.active.dropShadow225}) drop-shadow(1px 1px 5px ${props => props.theme.shadow.active.dropShadow115});
    box-shadow: inset -6px -6px 10px ${props => props.theme.shadow.active.innerShadow6610}, inset 4px 4px 10px ${props => props.theme.shadow.active.innerShadow4410};
  }
}
`;

const RegularButton = styled(Button)`
  ${props =>
          props.color === undefined &&
          css`
            color: ${props => props.theme.text.primary};

            &&:hover {
              color: ${props => props.theme.text.hover};
            }
          `
  }

  ${props =>
          props.color === 'orange' &&
          css`
            color: ${props => props.theme.orange.primary};

            &&:hover {
              color: ${props => props.theme.orange.hover};
            }
          `
  }

  ${props =>
          props.color === 'blue' &&
          css`
            color: ${props => props.theme.blue.primary};

            &&:hover {
              color: ${props => props.theme.blue.hover};
            }
          `
  }
`;

const LongXButton = styled(RegularButton)`
  grid-row: span 2;
  border-radius: 40px;
`;

const LongYButton = styled(RegularButton)`
  grid-column: span 2;
  border-radius: 40px;
  text-align: left;
  padding: 0 25px;
`;

const SwitchModeButton = styled(Button)`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40px;
  height: 40px;
  font-size: 0;
  color: ${props => props.theme.text.primary};

  &&:hover {
    color: ${props => props.theme.text.hover};
  }
`;

const App = () => {
    // -- States --
    const [theme, setTheme] = useState('light');
    const [summary, setSummary] = useState('');
    const [result, setResult] = useState('');
    const [calculations, setCalculations] = useState({
        numberOne: 0,
        action: NON_ACTION,
        numberTwo: 0,
    });
    const [isAllClear, setIsAllClear] = useState(false);
    const [disableActions, setDisableActions] = useState(false);

    // -- Handlers --
    const themeSwitch = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light');
    }

    const clearHandler = () => {
        if (!isAllClear) { // Just Clear one char
            if (summary[summary.length - 1] === ' ') { // In case there is two spaces + an operator
                setSummary((preState) => (preState.slice(0, -3)));
            } else { // In case there is just a number
                setSummary((preState) => (preState.slice(0, -1)));
            }
        } else { // All Clear
            setSummary('');
            setResult('');
            setDisableActions(false);
            setIsAllClear(false);
        }
    }

    const inputHandler = (e) => {
        const value = e.target.innerHTML;
        let num1;
        switch (value) {
            case "+":
                setDisableActions(true);
                num1 = Number(summary); // Convert the string to number
                setCalculations((preState) => ({...preState, action: PLUS, numberOne: num1}));
                setSummary((preState) => (preState + " " + value + " "));
                return;
            case "-":
                setDisableActions(true);
                num1 = Number(summary); // Convert the string to number
                setCalculations((preState) => ({...preState, action: MINUS, numberOne: num1}))
                setSummary((preState) => (preState + " " + value + " "));
                return;
            case "÷":
                setDisableActions(true);
                num1 = Number(summary); // Convert the string to number
                setCalculations((preState) => ({...preState, action: DIVIDE, numberOne: num1}));
                setSummary((preState) => (preState + " " + value + " "));
                return;
            case "×":
                setDisableActions(true);
                num1 = Number(summary); // Convert the string to number
                setCalculations((preState) => ({...preState, action: CROSS, numberOne: num1}));
                setSummary((preState) => (preState + " " + value + " "));
                return;
            default:
                setSummary((preState) => (preState + value));
                return;
        }
    }

    useEffect(() => {
        const num2 = Number(summary.slice(
            calculations.numberOne.toString().length + 3, summary.length));
        setCalculations((preState) => ({...preState, numberTwo: num2}));
    }, [calculations.numberOne, summary]);

    const resultHandler = () => {
        setIsAllClear(true);
        const action = calculations.action;
        const numberOne = calculations.numberOne;
        const numberTwo = calculations.numberTwo;

        switch (action) {
            case PLUS:
                setResult(numberOne + numberTwo);
                return;
            case MINUS:
                setResult(numberOne - numberTwo);
                return;
            case CROSS:
                setResult(numberOne * numberTwo);
                return;
            case DIVIDE:
                setResult(numberOne / numberTwo);
                return;
            default:
                return;
        }
    }
    // -- Render --
    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <Calculator>
                <Display>
                    <Summary>{summary}</Summary>
                    <Result>{result}</Result>
                </Display>
                <FunctionButtons>
                    <RegularButton style={{fontSize: 30}} onClick={clearHandler} color={'orange'}>
                        {isAllClear ? 'AC' : 'C'}
                    </RegularButton>
                    <RegularButton
                        color={'blue'}
                        onClick={inputHandler}
                        disabled={disableActions}
                    >÷</RegularButton>
                    <RegularButton
                        color={'blue'}
                        onClick={inputHandler}
                        disabled={disableActions}
                    >×</RegularButton>
                    <RegularButton
                        color={'blue'}
                        onClick={inputHandler}
                        disabled={disableActions}
                    >-</RegularButton>
                    <RegularButton onClick={inputHandler}>7</RegularButton>
                    <RegularButton onClick={inputHandler}>8</RegularButton>
                    <RegularButton onClick={inputHandler}>9</RegularButton>
                    <LongXButton
                        color={'blue'}
                        onClick={inputHandler}
                        disabled={disableActions}
                    >+</LongXButton>
                    <RegularButton onClick={inputHandler}>4</RegularButton>
                    <RegularButton onClick={inputHandler}>5</RegularButton>
                    <RegularButton onClick={inputHandler}>6</RegularButton>
                    <RegularButton onClick={inputHandler}>1</RegularButton>
                    <RegularButton onClick={inputHandler}>2</RegularButton>
                    <RegularButton onClick={inputHandler}>3</RegularButton>
                    <LongXButton
                        color={'orange'}
                        onClick={resultHandler}
                    >=</LongXButton>
                    <LongYButton onClick={inputHandler}>0</LongYButton>
                    <RegularButton onClick={inputHandler}>.</RegularButton>
                </FunctionButtons>
            </Calculator>
            <SwitchModeButton onClick={themeSwitch}>
                {theme === 'dark' ? <LightDown size={"20"}/> : <Moon size={"20"}/>}
            </SwitchModeButton>
        </ThemeProvider>
    );

}

export default App;
