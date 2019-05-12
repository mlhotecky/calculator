import React, {Component} from 'react';
import './App.css';
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { ClearButton } from "./components/ClearButton";
import * as math from 'mathjs';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            prevInput: '',
            equalKey: false,
            operator: null
        }
    }

    componentDidMount() {
        this.App.focus() // zameri okno inputu
    }

    pressKey = (e) => { // funkce pro zadavani hodnot z klavesnice

        e.preventDefault();

        switch (e.key) {
            case 'Enter': this.result();
                break;
            case 'Backspace': this.backspace();
                break;
            case 'Delete': this.clear();
                break;
            case ',': this.addValue('.');
                break;
            default: this.addValue(e.key);
                break
        }
    };

    addValue = value => {

        const allowedOperators = ['+', '-', '*', '/', '.'];
        // resi zadavani povolenych hodnot a znaku
        // a aby nebyl operator zadan driv nez cislo
        if (!allowedOperators.includes(value) && isNaN(parseInt(value))) return;

        const {input, equalKey, prevInput} = this.state;

        if(isNaN(value) && value !== '.') {
            this.setState({
                operator: value,
                input: value,
                prevInput: !isNaN(input) ? input : prevInput, // osetreni prvni hodnoty inputu
                equalKey: false
            })
        // osetreni delky policka kalkulacky
        } else if(!isNaN(value) && ((input && input.length < 29) || input === '')) {
            this.setState({
                input: !isNaN(input)
                    ? `${input && !equalKey ? input : ''}${value}`
                    : input === '.'
                        ? `${input}${value}`
                        : value,
                equalKey: false
            })

        } else if(value === '.') {

            this.setState({
                input: input && !input.includes('.')
                    ? `${input && !equalKey ? input : ''}${value}` : '.',
                equalKey: false
            })
        }
    };

    result = () => {

        const {input, equalKey, prevInput, operator} = this.state;

        if(!input || input === operator || equalKey) return;

        try {
            const result = math.eval(`${prevInput ? prevInput : ''}${operator ? operator : ''}${input}`).toString();

            this.setState({
                input: result === 'Infinity'  ? 'Math error' : result,
                equalKey: true,
                prevInput: null,
                operator: null
            })
        } catch {
            this.setState({
                input: input === '.' ? null : 'Math error',
                equalKey: true,
                prevInput: null,
                operator: null
            })
        }
    };

    clear = () => {
        this.setState({
            input: '',
            prevInput: '',
            equalKey: false,
            operator: ''
        })
    };

    backspace = () => {

        const {input, equalKey} = this.state;

        if(equalKey || !input) return;

        //osetreni backspace aby nedelal nic pokud je smazano posledni cislo
        const newInput = input.slice(0, input.length - 1).length > 0
            ? input.slice(0, input.length - 1) : '';

        this.setState({input: newInput})
    };
    render () {

        const {input} = this.state;

        const buttonValues = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '.', '0', '=', '+'
        ];
        //namapovani buttonu - lze i staticky,
        // ale tady je to zbytecne kdyz predhazuju pokazde ten stejny button
        // - upraveno css aby se kalkulacka po operatoru zalamovala
        const body = buttonValues.map((value, id) => {
            return value !== '='
                ? <Button key={id} handleClick={this.addValue}>{value}</Button>
                : <Button key={id} handleClick={this.result}>{value}</Button>
        });

    return (
        <div className='app' tabIndex={1} onKeyDown={(e) => this.pressKey(e)} ref={(input) => {this.App = input}}>
            {/*bez tabIndexu nebude fungovat zadavani hodnot z klavesnice, ref vola listener na keypress
            coz resi nasledne onKeyDow s funkci a ref */}
            <div className='calc-wrapper'>
                <Input input={input}/>
                <div className='rows'>
                    {body}
                </div>
                <div className='clear'>
                    <ClearButton clear={() => this.clear()}>C</ClearButton>
                    <ClearButton clear={() => this.backspace()}>←</ClearButton>
                </div>
            </div>
        </div>
        );
    }
}

export default App;
