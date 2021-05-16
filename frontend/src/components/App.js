import React, {Component} from "react";
import {render} from "react-dom";
import ProjectCreate from "./ProjectCreate";
import { Accordion, Card, Button} from 'react-bootstrap';

class App extends Component {
    constructor(props) {
        super(props);
        this.string_to_dict = this.string_to_dict.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "",
            dict_user_proj: {}
        };
    }

    fetchData() {
        fetch("api/project")
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return {placeholder: "Something went wrong!"};
                    });
                }
                return response.json();
            })
            .then(data => {
                this.setState(() => {
                    return {
                        data: data,
                        loaded: true
                    };
                });
            });
    }
    componentDidMount() {
        this.fetchData()
    }

    string_to_dict(string) {
        let user_dict = []
        if (string === "") return user_dict;
        let splitted = string.split(";")
        for (var i = 0; i < splitted.length; i++) {
            const [id, username] = splitted[i].split(':')
            user_dict.push({
                id:   id,
                username: username
            });
        }
        return user_dict
    }


    render() {
        return [
            <ProjectCreate fetchDataApp={this.fetchData}/>,
            <h4><small>{this.state.placeholder}</small></h4>,
            <Accordion>
                {this.state.data.map(project => {
                    this.dict_user_proj = this.string_to_dict(project.associated_users)
                    return (
                         <Card>
                            <Card.Header>
                              <Accordion.Toggle as={Button} variant="link" eventKey={project.key}>
                                    <p>{project.name}</p>
                                    <p><small>{project.key}</small></p>
                              </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={project.key}>
                                <Card.Body>
                                    {project.associated_users}
                                    <div>
                                    {

                                        this.dict_user_proj.map(user => {
                                            return (
                                                <li>
                                                    User in the proj: {user.username}
                                                </li>
                                            );
                                        })

                                    }
                                    </div>
    {/*
                                    <Button variant="primary" size="lg" onClick={this.deleteRow.bind(this, id)}>Delete project</Button>{' '}
Faire un object User qui prend en param le project, qui va juste lister les users et faire un boutton par user pour la requête :)  */}

                                </Card.Body>
                            </Accordion.Collapse>
                         </Card>
                    );
                })}
            </Accordion>
        ];
    }
}

export default App;

const container = document.getElementById("app");
render(<App/>, container);