import React, { Component } from "react"
import ReactDOM from "react-dom"
import { DatasetSelect, GeneEnter } from "./components.jsx"
import * as DDplot from "./d33d.js"

if (window.location.hostname == "karlssonlab.github.io") {
    const SERVER =  "https://sci-net.org/nabovis";
}
else {
    const SERVER = "http://127.0.0.1:10752/nabovis";    
}


class App extends React.Component {
    constructor () {
        super()
        this.state = {
            'datasets': [], 'selectedDataset': '', 'xumap': [],
            'clusters' :[], 'clustcolors': [],
            'imagecomp': 'ImageComp', 'figwidth': 600,
        }
        this.fetchDatasets()
        var imagecomp = document.getElementById(this.state.imagecomp)
        imagecomp.style.width = '100%'
        imagecomp.style.height = window.innerHeight*0.7 + 'px'
        this.state.figwidth = Math.min(imagecomp.offsetHeight, imagecomp.offsetWidth)
        console.log('width',this.state.figwidth)
    }

    fetchDatasets () {
        console.log('Fetching Datasets')
        fetch(SERVER + '/getdatasets')
            .then(response => response.json())
            .then(r => {
                console.log('Obtained Datasets')  
                this.state.datasets = r.datasets
                this.renderDatasetSelect()
            })
    }

    renderDatasetSelect () {
        ReactDOM.render(
            <DatasetSelect datasets={this.state.datasets}
                fontsize={'16px'}
                callBackFunc={v => this.handleDatasetSelect(v)} />,
            document.getElementById("DatasetSelectComp"))
        ReactDOM.render(
            <GeneEnter
                callBackFunc={v => this.fetchExpValues(v)} />,
            document.getElementById("GeneEnterComp"))
    }

    handleDatasetSelect (v) {
        this.state.selectedDataset = v
        this.fetchXumap()
    }

    fetchXumap () {
        console.log('Fetching Xumap')
        const req_data = {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify({
                'dataset': this.state.selectedDataset,
            })
        }
        fetch(SERVER + '/getxumap', req_data)
            .then(response => response.json())
            .then(r => {
                if (r['msg'] == 'OK') {
                    console.log('Obtained xumap', r.xumap.length)
                    this.state.xumap = r.xumap
                    this.state.clusters = r.clusters
                    this.state.clustcolors = r.clustcolors
                    this.renderPlot(this.state.clustcolors)
                }
            })
    }

    fetchExpValues (gene) {
        console.log('Fetching Exp values')
        const req_data = {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify({
                'dataset': this.state.selectedDataset,
                'gene': gene,
            })
        }
        fetch(SERVER + '/getgeneexp', req_data)
            .then(response => response.json())
            .then(r => {
                if (r['msg'] == 'OK') {
                    console.log('Obtained gene exp')
                    DDplot.update_color(r.vc)
                }
                else {
                    alert(r['msg'])
                }
            })
    }

    renderPlot(color_values) {
        DDplot.makePlot(this.state.xumap, this.state.imagecomp,
                        this.state.figwidth, color_values)
    }

    render () {
        return null
    }
}

export default App
