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
            input: ''
        }
    }

    addValue = value => {
        this.setState({ input: this.state.input + value })
    };
    addOperator = value => {
        if (this.state.input !== '') this.setState({ input: this.state.input + value })
    };

    handleEqual = () => {
        if (this.state.input === '') return;
        this.setState({input: math.eval(this.state.input)})
    };

    render() {
        console.log(this.state);
    return (
      <div className='app'>
          <div className='calc-wrapper'>
              <Input input={this.state.input}> </Input>
              <div className='row'>
                  <Button handleClick={this.addValue}>7</Button>
                  <Button handleClick={this.addValue}>8</Button>
                  <Button handleClick={this.addValue}>9</Button>
                  <Button handleClick={this.addOperator}>/</Button>
              </div>
              <div className='row'>
                  <Button handleClick={this.addValue}>4</Button>
                  <Button handleClick={this.addValue}>5</Button>
                  <Button handleClick={this.addValue}>6</Button>
                  <Button handleClick={this.addOperator}>*</Button>
              </div>
              <div className='row'>
                  <Button handleClick={this.addValue}>1</Button>
                  <Button handleClick={this.addValue}>2</Button>
                  <Button handleClick={this.addValue}>3</Button>
                  <Button handleClick={this.addOperator}>+</Button>
              </div>
              <div className='row'>
                  <Button handleClick={this.addOperator}>.</Button>
                  <Button handleClick={this.addValue}>0</Button>
                  <Button handleClick={this.handleEqual}>=</Button>
                  <Button handleClick={this.addOperator}>-</Button>
              </div>
              <div className='row'>
                  <ClearButton handleClear={() => this.setState({input: ''})}>
                    Clear
                  </ClearButton>
              </div>
          </div>
      </div>
        );
    }
}

export default App;
