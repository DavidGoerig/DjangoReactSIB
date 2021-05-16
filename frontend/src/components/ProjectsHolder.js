/**
 * Class (Component) aiming to handle projects interaction with user and display of the toasts (form, request)
 * @author David Goerig <davidgoerig68@gmail.com>
 */
import React, {Component} from "react";
import {render} from "react-dom";
import ProjectCreationHolder from "./ProjectCreationHolder";
import { Accordion, Card, Button, Toast, Container, Col, Row} from 'react-bootstrap';
import Cookies from 'universal-cookie';

/**
 * This object need (in the end) be splitted in 2 more component: one for holding the users_to_add component
 * and one for the users in the project.
 */

const cookies = new Cookies();

class ProjectsHolder extends Component {
    /**
     * constructor create state to keep track on data
     * @param {list}props  - properties of react component
     */
    constructor(props) {
        super(props);
        this.string_to_dict = this.string_to_dict.bind(this);
        this.fetchDataProjects = this.fetchDataProjects.bind(this);
        this.delete_project = this.delete_project.bind(this);
        this.delete_user_from_project = this.delete_user_from_project.bind(this);
        this.add_user_to_project = this.add_user_to_project.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.add_or_delete_user_from_project = this.add_or_delete_user_from_project.bind(this);

        this.state = {
            users: [],
            data: [],
            loaded: false,
            placeholder: "",
            dict_user_proj: {}
        };
    }

    /**
     * fetch project data at api/project (Get request) and feed data, loaded and placeholder
     * @return: {void}
     */
    fetchDataProjects() {
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
    /**
     * fetch user data at api/user/ (Get request) and feed users
     * @return: {void}
     */
    fetchUsers() {
        fetch("api/user/")
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return {placeholder: "Something went wrong!"};
                    });
                }
                return response.json();
            })
            .then(users => {
                this.setState(() => {
                    return {
                        users: users
                    };
                });
            });
    }

    /**
     * called after the component is rendered, we are getting the user, call fetch functions
     */
    componentDidMount() {
        this.fetchDataProjects()
        this.fetchUsers()
    }

    /**
     * transform a string like "<id>:<username>;..." to dictionary
     * @param: {string} string - string containing users
     * @return: {dict} user_dict - containing users
     */
    string_to_dict(string) {
        let user_dict = [] // TODO not a dictionary but an array in the end, need to refactor
        if (string === "") return user_dict;
        let splitted = string.split(";")
        for (let i = 0; i < splitted.length; i++) {
            const [id, username] = splitted[i].split(':')
            user_dict.push({
                id:   id,
                username: username
            });
        }
        return user_dict
    }

    /**
     * POST request to delete project
     * @param {string} project_name - project name
     */
    delete_project(project_name) {
        var csrftoken = cookies.get('csrftoken');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFTOKEN': csrftoken,
            },
            body: JSON.stringify({ "name": project_name})
        };
        fetch('api/project/delproj', requestOptions)
            .then(res => {
                if(!res.ok) {
                    this.fetchDataProjects();
                    res.text().then(text => throw Error(text))
                }
                else {
                    this.fetchDataProjects();
                    return res.json();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     *  request to delete or add user to project. handle post and put request, on different routes
     * @param {string} username - username
     * @param {string} project_name - project name
     * @param {string} route - route of the request
     * @param {string} method - method of the request
     */
    add_or_delete_user_from_project(username, project_name, route, method) {
        var csrftoken = cookies.get('csrftoken');
        const requestOptions = {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;',
                'X-CSRFTOKEN': csrftoken,
            },
            body: JSON.stringify({ "username":username , "project_name": project_name})
        };
        fetch(route, requestOptions)
            .then(res => {
                if(!res.ok) {
                    this.fetchDataProjects();
                    res.text().then(text => throw Error(text))
                }
                else {
                    this.fetchDataProjects();
                    return res.json();
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     *  handler for buttons
     * @param username
     * @param project_name
     */
    add_user_to_project(username, project_name) {
        this.add_or_delete_user_from_project(username, project_name, 'api/project/adduser', 'PUT')
    }

    /**
     * handler for button
     * @param username
     * @param project_name
     */
    delete_user_from_project(username, project_name) {
        this.add_or_delete_user_from_project(username, project_name, 'api/project/deluser', 'POST')
    }

    /**
     * render function
     * NB: really too long, need to split it in 2 more components (AddUser, UserAssigned)
     * @returns {*[]} multiple container
     */
    render() {
        return [
            <ProjectCreationHolder fetchDataApp={this.fetchDataProjects}/>,
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
                                    <h5>Users associated to the project:</h5>
                                    <Container fluid="md">
                                        <Row>
                                            {

                                                this.dict_user_proj.map(user => {
                                                    return [
                                                        <Col>
                                                            <Toast>
                                                                <Toast.Header>
                                                                    <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                                                                        <strong className="mr-auto">{user.username}</strong>
                                                                        <small>id: {user.id}</small>
                                                                </Toast.Header>,
                                                                <Toast.Body>
                                                                    <Button variant="primary" size="sm" onClick={this.delete_user_from_project.bind(this, user.username, project.name)}>Delete {user.username} from project</Button>

                                                                </Toast.Body>
                                                            </Toast>
                                                        </Col>
                                                    ];
                                                })

                                            }
                                        </Row>
                                    </Container>

                                    <h5>Users to add to the project:</h5>
                                    <Container fluid="md">
                                        <Row>
                                        {

                                            this.state.users.map(usr => {
                                                return [
                                                    <Col>
                                                        <Toast>
                                                            <Toast.Header>
                                                                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                                                                    <strong className="mr-auto">{usr.username}</strong>
                                                                    <small>id: {usr.id}</small>
                                                            </Toast.Header>
                                                            <Toast.Body>
                                                                <p>First name: <span>{usr.first_name}</span></p>
                                                                <p>Last name: <span>{usr.last_name}</span></p>
                                                                <p>Email: <span>{usr.email}</span></p>
                                                                <Button variant="primary" size="sm" onClick={this.add_user_to_project.bind(this, usr.username, project.name)}>Add {usr.username} to project</Button>
                                                            </Toast.Body>
                                                        </Toast>
                                                    </Col>
                                                ];
                                            })

                                        }
                                        </Row>
                                    </Container>

                                    <Button variant="primary" size="lg" onClick={this.delete_project.bind(this, project.name)}>Delete project</Button>

                                </Card.Body>
                            </Accordion.Collapse>
                         </Card>
                    );
                })}
            </Accordion>
        ];
    }
}


export default ProjectsHolder;

const container = document.getElementById("app");
render(<ProjectsHolder/>, container);