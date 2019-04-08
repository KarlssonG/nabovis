import React, { Component } from "react"
import ReactDOM from "react-dom"

class DatasetSelect extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.datasets.length == nextProps.datasets.length) {
            return false
        }
        return true
    }
    render () {
        console.log('Rendering DatasetSelect')
        return (
            <select style={{"fontSize": this.props.fontsize}}
                onChange={e => this.props.callBackFunc(e.target.value)}>
                {this.props.datasets.map(item => (
                    <option key={item.id}>{item.value}</option>
                ))}
            </select>
        )
    }
}

class GeneEnter extends React.Component {
    constructor () {
        super()
        this.state = {'text': ''}
    }
    textUpdate (e) {
        this.state.text = e
    }
    render() {
        console.log('Rendering GeneEnter')
        return (
            <div style={{display: 'inline-block'}}>
                <p style={{display: 'inline-block'}}><b>Enter gene symbol: </b></p>
                <input type="text" id='GeneEnter'size="10"
                       onChange={e => this.textUpdate(e.target.value)}/>
                <button className="btn btn-info"
                        onClick={e => this.props.callBackFunc(this.state.text)}>
                        Submit
                </button>
            </div>
        )
    }
}


export {
    DatasetSelect,
    GeneEnter,    
}
