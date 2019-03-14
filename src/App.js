import React, { Component } from "react";
import {
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  Button
} from "reactstrap";
import styled from "styled-components";
import Select from "react-select";
import { aircrafts } from "./aircrafts";
import { airlines } from "./airlines";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import validator from "validator";

const selectableStructure = data =>
  Object.keys(data).map(key => {
    return { value: key, label: data[key] };
  });

const Title = styled.h1`
  font-family: "Roboto Condensed", sans-serif;
  text-align: center;
`;

const EmojiContainer = styled.div`
  font-size: 3.5rem;
  text-align: center;
`;
const AirlineContainer = styled.div`
  display: inline-block;
  width: 50%;
`;
const InputContainer = styled.div`
  display: inline-block;
  width: 50%;
`;
const AircraftContainer = styled.div`
  background-color: #fafafa;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;
const API_HOSTNAME = "http://localhost:8080";

const Emoji = props => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
);

const isEmptyObj = obj => Object.keys(obj).length === 0;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airline: "",
      flight: "",
      aircraftInfo: {}
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onClickFetch = this.onClickFetch.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onChangeAirline = this.onChangeAirline.bind(this);
    this.resetAircraftInfo = this.resetAircraftInfo.bind(this);
  }

  fetchData() {
    const { airline, flight } = this.state;
    if (!(validator.isEmpty(flight) && validator.isEmpty(airline))) {
      console.log(`${airline}${flight}`);
      axios
        .get(`${API_HOSTNAME}/api`, {
          headers: {
            "allow-control-allow-origin": "http://localhost:3000"
          },
          params: {
            airline,
            flight
          }
        })
        .then(res => {
          console.log(res.data);
          this.setState({ aircraftInfo: res.data });
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

  onChangeAirline(selected) {
    this.setState({ airline: selected.value });
  }

  onKeyDown(evt) {
    const { keyCode } = evt;
    if (keyCode === 13) {
      this.fetchData();
      evt.preventDefault();
    }
  }

  resetAircraftInfo() {
    this.setState({ aircraftInfo: {} });
  }

  render() {
    const { flight, aircraftInfo } = this.state;
    return (
      <Container>
        <div>
          <Title>What's my aircraft?</Title>
        </div>
        <EmojiContainer>
          <Emoji symbol="🤔" />
          <Emoji symbol="✈️" />
        </EmojiContainer>
        <div>
          <AirlineContainer>
            <Select
              isClearable={true}
              isSearchable={true}
              options={selectableStructure(airlines)}
              placeholder="Airline"
              onChange={this.onChangeAirline}
            />
          </AirlineContainer>
          <InputContainer>
            <Input
              onChange={this.onChangeInput}
              onKeyDown={this.onKeyDown}
              value={flight}
              placeholder="Flight #"
            />
          </InputContainer>

          <StyledButton size="lg" color="light" onClick={this.onClickFetch}>
            <Emoji symbol="Search 🔍" />
          </StyledButton>
        </div>
        <AircraftContainer>
          {!isEmptyObj(aircraftInfo) && <h1>Somethng</h1>}
        </AircraftContainer>
      </Container>
    );
  }
}

export default App;
