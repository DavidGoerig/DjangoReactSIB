import React, { Component } from 'react';
import {render} from "react-dom";


import Cookies from 'universal-cookie';

const cookies = new Cookies();

class ProjectCreate extends Component {
  constructor(props) {
    super(props);
    this.fetchDataApp = props.fetchDataApp.bind(this);

    this.state = {
            data: [],
            loaded: false,
            name: "",
            tag: "",
            placeholder: "",
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
        fetch("api/user/current")
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
                        data,
                        loaded: true
                    };
                });
            });
    }

  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangeTag(event) {
    this.setState({tag: event.target.value});
  }


  handleSubmit(event) {
      var csrftoken = cookies.get('csrftoken');
    const requestOptions = {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CSRFTOKEN': csrftoken,
        },
        body: JSON.stringify({ "name": this.state.name , "key": this.state.tag})
    };

    fetch('api/project/', requestOptions)
        .then(res => {
            this.fetchDataApp();
            if (res.status >= 400) {
                this.state.placeholder = "Something went wrong! (project already created)"
            }
              if(!res.ok) {
                res.text().then(text => throw Error(text))
               }
              else {
               return res.json();
             }
        })
        .catch(err => {
            this.state.placeholder = "Something went wrong! "+ err;
        })
    event.preventDefault();
  }

  render() {
    return [
            <h4><small>{this.state.placeholder}</small></h4>,
        <h3>Create new project</h3>,
        <form onSubmit={this.handleSubmit}>
            <label>
                Name:
          <input type="text" value={this.state.name} onChange={this.handleChangeName} />
        </label>
          <label>
          Tag:
          <input type="text" value={this.state.tag} onChange={this.handleChangeTag} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    ];
  }
}


export default ProjectCreate;