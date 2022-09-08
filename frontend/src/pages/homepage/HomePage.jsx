import React from "react";
import {Link} from "react-router-dom";
import SearchBar from "../../components/search/SearchBar";
import "../../pages/Page.css"


export default class HomePage extends React.Component  { 
    constructor(props) { 
        super(props);
        this.state= {
          data : [],

          keyword: ""

        };
    }

    
    async componentDidMount() { 
        const res = await fetch("http://localhost:3001/questions");
    
        const data =await res.json();
  
        this.setState({data : data});

    }

    handleSearch = (e) => { 
        this.setState ({ keyword: e.currentTarget.value});
    }

    handleDelete= async (e) =>{ 
        const id = e.currentTarget.id;
        let choice = window.confirm (" Do you want to delete?");
       
        
        
        if (choice) { 
            const response = await fetch ("http://localhost:3001/questions/" + id, { 
                method: "DELETE"
            });
               
            if (response.status === 200) {
                // window.location.reload()
                this.props.history.push('/');
                alert (" Delete Succesfully");
            }else if (response.status === 404){ 
                alert("Error");
                this.props.history.push('/');
            }
                   
        } 

        // update table 
        const res = await fetch("http://localhost:3001/questions");
        const data =await res.json();
        this.setState({
            data:data
        });
    }


    render() { 
   
    let { data,keyword} = this.state;
    let num = 0;
    

    const result = data.filter(item => item.text.toLowerCase().includes(keyword.toLowerCase()));
    
    
        return <>
        <main>
        <div className="container">
            <h1>All questions</h1>
          
           <SearchBar
                value = {this.state.keyword}
                //handleChange = {(event)=> this.setState({keyword:event.currentTarget.value})}
                 onChange = {this.handleSearch}
                 />

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th width="210">Actions</th>
                </tr>
                </thead>



                <tbody>
                    {result.map(question => { 
                        num =num+1;

                        return  <tr key ={question._id}>
                            
                            <td> {num} </td>

                            <td > {question.text}</td>
                            
                            <td> {question.answers[question.correctAnswer]}</td>

                            <td>
                                <Link 
                                    id = {question._id}
                                    to={`/${question._id}/edit`} 
                                    className="btn btn-blue" >
                                    <i className="far fa-edit"></i> 
                                        Edit
                                </Link>
                                
                                <Link 
                                    id = {question._id}
                                    to ="/"
                                    className="btn btn-orange"
                                    onClick={this.handleDelete}>
                                    <i className="far fa-trash-alt"></i> 
                                        Delete
                                </Link>
                            </td>
                           
                </tr>
                    })}    
                 
             
                </tbody>     
            </table>
        </div>
    </main>
        </>
    }
}






