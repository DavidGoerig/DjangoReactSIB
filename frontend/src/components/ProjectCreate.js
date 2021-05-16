import React, { Component } from 'react';
import {render} from "react-dom";

import { Form , Button} from 'react-bootstrap';

class ProjectCreate extends Component {

constructor(props) {
    super(props);

    this.state = {
      name: "",
      tag: ""
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeTag = this.handleChangeTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangeTag(event) {
    this.setState({tag: event.target.value});
  }

  handleSubmit(event) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "name": this.state.name , "tag": this.state.name})
    };
    fetch('api/project/', requestOptions)
        .then(response => response.json())
    event.preventDefault();
  }

  render() {
    return (
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
    );
  }
}

export default ProjectCreate;

const container = document.getElementById("project_create");
render(<ProjectCreate/>, container);