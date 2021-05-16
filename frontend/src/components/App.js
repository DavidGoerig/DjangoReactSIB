import React, {Component} from "react";
import {render} from "react-dom";
import ProjectCreate from "./ProjectCreate";

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
            <ul>
                {this.state.data.map(project => {
                    this.dict_user_proj = this.string_to_dict(project.associated_users)
                    return (

                        <li key={project.id}>
                            {project.key} --- {project.name} --- {project.associated_users}
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

                        </li>
                    );
                })}
            </ul>
        ];
    }
}

export default App;

const container = document.getElementById("app");
render(<App/>, container);