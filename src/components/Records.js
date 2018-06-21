import React, { Component } from 'react';
import Record from './Record';
// import {getJSON} from 'jquery'
// import axios from 'axios';
import * as RecordsAPI from '../utils/RecordsAPI'
import RecordForm from './RecordForm';
import AmountBox from './AmountBox.js';

class Records extends Component {
  constructor(){
    super();
    this.state = {
      error: null,
      isLoaded: false,
      records: [
        // {"id":1,"date":"2018-02-09","title":"收入","amount":20},
        // {"id":2,"date":"2018-03-01","title":"收入","amount":199},
        // {"id":3,"date":"2018-03-01","title":"收入","amount":30},

      ]
    };
  }

componentDidMount(){
  // getJSON("https://5b287b1362e42b0014915850.mockapi.io/api/v1/records").then(
  //   response => this.setState({
  //     records: response,
  //     isLoaded: true
  //   }),
  //   error =>this.setState({
  //     isLoaded: true,
  //     error
  //   })
  // )
RecordsAPI.getAll().then(
  response => this.setState({
    records:response.data,
    isLoaded: true
  })
).catch(
  error =>this.setState({
  isLoaded: true,
  error
  })
)
}  

addRecord(record) {
this.setState({
  error:null,
  isLoaded: true,
records: [
  ...this.state.records,
  record
]
})
}
updateRecord(record,data){
const recordIndex = this.state.records.indexOf(record);
const newRecords = this.state.records.map((item,index) => {
  
  if(index !==recordIndex){
    return item;
  }
  return {
    ...item,
    ...data
  };
});
this.setState({
  records: newRecords
});
}

deleteRecord(record){
  const recordIndex = this.state.records.indexOf(record);
  const newRecords = this.state.records.filter((item,index) =>index !==recordIndex);
  this.setState({
    records:newRecords
  });
}

credits() {
  let credits = this.state.records.filter((record) =>{
    return record.amount >=0;
  })

  return credits.reduce((prev,curr) =>{
    return prev+ Number.parseInt(curr.amount,0)
  },0)
}

debits() {
  let credits = this.state.records.filter((record) => {
    return record.amount<0;
  })

  return credits.reduce((prev,curr) =>{
    return prev + Number.parseInt(curr.amount,0)
  },0)
}

balance(){
  return this.credits() + this.debits();
}
  render() {
    let recordsComponent;
    const {error, isLoaded, records} = this.state;
    if (error){
      recordsComponent = <div>Error:{error.message}</div>
    }else if (!isLoaded) {
      recordsComponent = <div>Loading...</div>;
    }else {
        recordsComponent = <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) =>
              (<Record 
                 key={record.id} 
                 record={record} 
                 handleEditRecord ={this.updateRecord.bind(this)}
                 handleDeleteRecord = {this.deleteRecord.bind(this)}
              /> )
            )}
            </tbody>
          </table>
  
    }
    return (
    <div>
    <h2>Records</h2>
    <div className="row mb-3">
      <AmountBox text="Credits" type="success" amount={this.credits()}/>
      <AmountBox text="Debits" type="danger" amount={this.debits()}/>
      <AmountBox text="Balance" type="info" amount={this.balance()}/>
    </div>
      <RecordForm handleNewRecord = {this.addRecord.bind(this)}/>
      {recordsComponent}
    </div>
    )
  }
}

export default Records;
