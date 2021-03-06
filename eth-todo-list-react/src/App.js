import './App.css';
import Web3 from 'web3'
import React, { Component } from 'react'
import {TODO_LIST_ABI, TODO_LIST_ADDRESS} from './config'
import TodoList from './TodoList';
export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      taskCount: 0,
      tasks: [],
      loading: true,
    }
    
  }


  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    const todoList = new web3.eth.Contract(TODO_LIST_ABI,TODO_LIST_ADDRESS)
    this.setState({todoList: todoList})

    const taskCount = await todoList.methods.taskCount().call()
    this.setState({taskCount: taskCount})

    console.log("network:", network)
    console.log("account:", accounts[0])
    console.log("todoList", todoList)
    
    for (let i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
    console.log("task:" ,this.state.tasks)
    this.setState({ loading: false })

  }

  render() {
    return (
      <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <TodoList
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted} />
              }
            </main>
          </div>
        </div>
      </div>
    )
  }
}


