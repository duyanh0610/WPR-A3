import React from "react";

import "../../pages/Page.css"


export default class AddPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            answers: [""],
            text: '',
            correctAnswer: -1,

            answer: ''
        };
    }
 


    handleText = (e) => {
        this.setState({ text: e.currentTarget.value });
    }
    
    handleAnswers  =  (e) => { 

        let {answers} = this.state;
        this.setState ({answer: e.currentTarget.value });

        answers[e.currentTarget.id]= e.currentTarget.value   ;
    }


    // add new input field
    handleAddAnswer = (e) => {
       this.setState ({  answers : [...this.state.answers, '']})   ;
    }

    //delete input field
    handleRemoveAnswer= (e) => { 
        const id = e.currentTarget.id;
        this.state.answers.splice(id , 1) ;
        this.setState({});
        const  {correctAnswer} =this.state;

        if (parseInt(e.currentTarget.id) === correctAnswer ){
            this.setState ({ correctAnswer: -1});
        }
        if (parseInt(e.currentTarget.id) < correctAnswer) { 
            this.setState ({correctAnswer: correctAnswer-1 });
        }
    }


    handleSelect = (e) => { 
        if (e.currentTarget.checked) { 
            this.setState ({ correctAnswer: parseInt(e.currentTarget.value) }) ;
        }   
    }
    
  

    // save 
    handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(this.state.answers);
        let {text,answers,correctAnswer} = this.state;


        // if ( text != ""  || answers != null || correctAnswer != undefined || answers.length !== 0 ) { 
           
            // call api 
        const response=  await fetch ("http://localhost:3001/questions", { 
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify ({ 
                answers : answers,
                text  : text,
                correctAnswer: correctAnswer
            })
        });
        if ( response.status === 201) { 
            alert("Added successfully");
            this.props.history.push("/")
        } else if(response.status === 400)  { 
            alert ("Required data must not be blank") ;
        }
    }
       
      
    


    render() {
      
        return <>
            <main>
                <div className="container">
                    <h1>New question</h1>

                    <form id="frm-create" onSubmit={this.handleSubmit}>


                        <div id ="answer-form" className="form-group">
                      

                        
                            {/* question's text */}
                            <label htmlFor="text">Text</label>
                            <input
                            
                                id="text"
                                type="text"
                                name="text"
                                value={this.state.text}
                                onChange={this.handleText} />
                        </div>
                        


                        <div className="form-group">
                            <label>Answers: </label>


                   
                            {this.state.answers.map((ans,index)=> {
                                let item = "answer" +index
                                
                                return <div key = {item}>
                                        <div className="answer">
                                            <input
                                                type="text"
                                                name="answers"
                                                id = {index}
                                                value= {this.state.answers.at(index)}
                                                onChange={this.handleAnswers} />
                                        
                                            <div>
                                                <input
                                                    name="correctAnswer"
                                                    type="radio"
                                                    value={index}
                                                    id={item}
                                                    onChange={this.handleSelect}
                                                    checked= {this.state.correctAnswer === index}
                                                    />
                                                <label htmlFor={item}>correct</label>
                                            </div>
                                    
                                            <button
                                                type="button"
                                                id = {index}
                                                className="btn btn-orange"
                                                onClick={this.handleRemoveAnswer}>
                                                <i className="fas fa-times"></i> Remove
                                            </button>
                                        </div>
                                    </div>;
                                    
                            })}
                            <div
                                className="text-right">

                                <button
                                    type="button"
                                    className="btn btn-blue"
                                    onClick= {this.handleAddAnswer}>
                                    <i className="fas fa-plus"></i> Add
                                </button>

                            </div>
                        </div>

                        <div
                            className="actions">
                            <button
                                className="btn btn-blue btn-large"
                              >
                                <i className="fas fa-save"></i> Save
                            </button>


                        </div>
                    </form>
                </div>
            </main>
        </>
    }
}





       