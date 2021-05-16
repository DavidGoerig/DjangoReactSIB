/**
 * Class (Component) aiming to handle projects interaction (form, request)
 * @author David Goerig <davidgoerig68@gmail.com>
 */

import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class ProjectCreationHolder extends Component {
    /**
     * constructor, bind fetch data method with prop
     * @param {list}props  - properties of react component
     */
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
      this.handleChangeKey = this.handleChangeKey.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

    /**
     * called after the component is rendered, we are getting the user
     */
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

    /**
     * handle name changing in the form and set the state to keep track
     * @param {event}  event - form event
     * @return {void}
     */
  handleChangeName(event) {
      this.setState({name: event.target.value});
  }

    /**
     * handle key changing in the form and set the state to keep track
     * @param {event}  event - form event
     * @return {void}
     */
  handleChangeKey(event) {
      this.setState({tag: event.target.value});
  }

    /**
     * handle form submit and request the api to create project at api/project/
     * we get CSRF token for secure request and authenticate
     * @param{event}  event - form event
     * @return {void}
     */
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
              }})
          .catch(err => {
            this.state.placeholder = "Something went wrong! "+ err;
          })
      event.preventDefault();
  }

    /**
     * render
     * @return {html}
     */
  render() {
      return [
          <h4><small>{this.state.placeholder}</small></h4>,
          <h3>Create new project</h3>,
          <form onSubmit={this.handleSubmit}>
              <label>Name:<input type="text" value={this.state.name} onChange={this.handleChangeName} /></label>
              <label>Tag:<input type="text" value={this.state.tag} onChange={this.handleChangeKey} /></label>
              <input type="submit" value="Submit" />
          </form>
      ];
  }
}


export default ProjectCreationHolder;