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
        this.App.focus() // focus calcualtor in window
    }

    pressKey = (e) => { // function for give inputs from keyboard

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
        // security for set only allowed numbers and operators
        // and not set operator before first number
        if (!allowedOperators.includes(value) && isNaN(parseInt(value))) return;
        const {input, equalKey, prevInput} = this.state;

        if(isNaN(value) && value !== '.') {
            this.setState({
                operator: value,
                input: value,
                prevInput: !isNaN(input) ? input : prevInput, // secure of first input value
                equalKey: false
            })
        // limited number of values in input
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

        //secure backspace - do nothing when all values are deleted
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
        //buttons in map function - can be static components
        // but it is not necessary when all components are same
        const body = buttonValues.map((value, id) => {
            return value !== '='
                ? <Button key={id} handleClick={this.addValue}>{value}</Button>
                : <Button key={id} handleClick={this.result}>{value}</Button>
        });

    return (
        <div className='app' tabIndex={1} onKeyDown={(e) => this.pressKey(e)} ref={(input) => {this.App = input}}>
            {/*tabIndex - necessary for keypressing from keyboard, onKeyDown - call function which recognize allowed keys, ref - calls listener with focus*/}
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
