import React,{ Component } from 'react';
import './App.css';
import Covid from "./components/Covid"
import axios from "axios"

class App extends Component{
  constructor(props){
    super(props);
    this.state = { covids : [] }
  
  }
  
  componentDidMount() {//countries historical
    axios.get('https://disease.sh/v3/covid-19/historical').then(res => {   
    this.setState({ covids :  res.data });
    })
  }

  render(){
    return (
      <div>
        <Covid covids={this.state.covids}/>
      </div>
    )
  }
}

export default App;
