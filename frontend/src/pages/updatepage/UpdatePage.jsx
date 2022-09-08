import React from "react";
import "../../pages/Page.css";


export default class UpdatePage extends React.Component {
    constructor() {
        super();
        this.state ={
            data: [],

            text:"",
            answers: [],
            correctAnswer:-1,

            answer:""
         };
    }
    handleText = (event) => {
        this.setState({ text: event.currentTarget.value });
    }
    
    handleAnswers  =  (e) => { 

        let {answers} = this.state;
        this.setState ({answer: e.currentTarget.value });

        answers[e.currentTarget.id]= e.currentTarget.value;
    }

    // add new input field
    handleAddAnswer = (ans) => {
        this.setState ({  answers : [...this.state.answers, '']})  ; 
     }
 
     //delete input field
     handleRemoveAnswer= (ans) => { 
         this.state.answers.splice(ans.currentTarget.id , 1) ;
         this.setState({});
         const {correctAnswer} = this.state;


        if (parseInt( ans.currentTarget.id) === correctAnswer  ) {
            this.setState ({ correctAnswer: -1});
         }
        if (parseInt(ans.currentTarget.id) < correctAnswer ) { 
            this.setState ({ correctAnswer: correctAnswer-1});
        }
       
     }
     handleSelect = (e) => { 
       
         
        let check  =e.currentTarget.checked;
        
        if (check) { 
            this.setState ({ correctAnswer: parseInt(e.currentTarget.value) }); 
        }     
    }
 
    async componentDidMount() { 
        
        let id =this.props.match.params.id;
        
        const response = await fetch ("http://localhost:3001/questions/" +id)
        if (response.status === 404) { 
            alert ("Not found");
        }
            
        
        const data = await response.json();

        this.setState({data: data});
        this.setState({text: data.text});
        this.setState({answers:data.answers});
        this.setState({correctAnswer: parseInt(data.correctAnswer)});
    }



    onUpdate =async (e)=> { 
        e.preventDefault();

        let id = this.props.match.params.id;
        let {text,answers,correctAnswer} = this.state;

        const response = await  fetch ("http://localhost:3001/questions/" +id,{ 
            method: "PUT",
            headers: { 
                'Content-type': 'application/json'
            }, 
            body: JSON.stringify({ 
                answers: answers,
                text:text, 
                correctAnswer: correctAnswer
            })
        })
        if ( response.status === 200) { 
            alert("Update successfully");
            this.props.history.push('/');
        } else if (response.status === 400) { 
            alert ("Required data must not be blank") ;
        } else if(response.status === 404) { 
            alert("Not found");
        }
    }

    
    render() {
        let {text,answers}= this.state;

        

        return <>
            <main>
                <div className="container">
                    <h1>Edit question</h1>

                    <form id="frm-create" onSubmit={this.onUpdate}>

                      
                        <div 
                            className="form-group">
                            
                            {/* question's text   */}
                            <label 
                                htmlFor="text">Text
                            </label>
                            <input 
                                type="text" 
                                name="text" 
                                value={text}
                                onChange={this.handleText} />
                        </div>



                        <div className="form-group">
                            <label>Answers: </label>

                            {/* answer */}
                            {answers.map((ans,index)=> { 
                                 
                                let item ="answer" +index
                               
                            

                                return <div key = {item}>  
                                <div className="answer">
                                    <input 
                                        type="text" 
                                        name="answers"
                                        id ={index} 
                                        value={this.state.answers.at(index)}
                                        onChange={this.handleAnswers} />
                                    <div>
                                        <input 
                                            name="correctAnswer" 
                                            type="radio" 
                                            value={index} 
                                            id={item} 
                                            onChange={this.handleSelect}
                                            checked  = {this.state.correctAnswer === index}
                                            /> 
                                        <label htmlFor={item}>correct</label>
                                    </div>

                                    <button 
                                        type="button"
                                        id = {index} 
                                        className="btn btn-orange"
                                        onClick={this.handleRemoveAnswer}>
                                        <i 
                                            className="fas fa-times"></i> Remove
                                    </button>   
                                </div>
                              </div>

                            })}



                            <div className="text-right">
                                <button 
                                    type="button" 
                                    className="btn btn-blue"
                                    onClick={this.handleAddAnswer}>
                                    <i className="fas fa-plus"></i> Add
                                </button>
                            </div>
                        </div>


                        <div className="actions">
                            <button 
                                className="btn btn-blue btn-large">
                                <i className="fas fa-save"></i> Save
                            </button>
                        </div>
                    </form>
                </div>
            </main></>
    }
}
