import React, {Component} from "react";
import {render} from "react-dom";
import { Navbar} from 'react-bootstrap';

class TitleAndNavBarHolder extends Component {
    /**
     * constructor, bind fetch data method with prop
     * @param {list}props  - properties of react component
     */
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading"
        };
    }

    /**
     * called after the component is rendered, we are getting the current user to fill title
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
     * render
     * @return {html}
     */
    render() {
        return (
             <>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">
                      <img
                        alt=""
                        src="/static/img/mars.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                      />{' '} Django ReactJS - David GOERIG - SIB
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                          Signed in as: <span style={{ color: 'red' }}>{this.state.data.username}</span>
                          <p><a href="/disconnect">Disconnect</a></p>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>;
            </>

    )}
}


export default TitleAndNavBarHolder;

const container = document.getElementById("welcome_title");
render(<TitleAndNavBarHolder/>, container);