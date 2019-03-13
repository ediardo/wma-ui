import React, { Component } from "react";
import {
  Container,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  Button
} from "reactstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Title = styled.h2`
  font-family: "Roboto Condensed", sans-serif;
`;

const API_HOSTNAME = "http://localhost:8080";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flight: ""
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onClickFetch = this.onClickFetch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData() {
    const { flight } = this.state;

    if (flight.trim() !== "") {
      axios
        .get(`${API_HOSTNAME}/api`, {
          headers: {
            "allow-control-allow-origin": "http://localhost:3000"
          },
          params: {
            flight
          }
        })
        .then(res => {
          console.log(res.data);
        });
    }
  }

  onClickFetch() {
    this.fetchData();
  }
  onChangeInput(evt) {
    const { value } = evt.target;
    this.setState({ flight: value });
  }

  onKeyDown(evt) {
    const { keyCode } = evt;
    if (keyCode === 13) {
      this.fetchData();
      evt.preventDefault();
    }
  }

  render() {
    const { flight } = this.state;
    return (
      <Container>
        <Row>
          <Title>What airplane am i flying on?</Title>
        </Row>
        <Row>
          <InputGroup>
            <Input
              onChange={this.onChangeInput}
              onKeyDown={this.onKeyDown}
              value={flight}
              placeholder="Flight #"
            />
            <InputGroupAddon addonType="append">
              <Button color="primary" onClick={this.onClickFetch}>
                <FontAwesomeIcon icon={faPlane} />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Row>
        <Row />
      </Container>
    );
  }
}

export default App;
