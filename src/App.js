import React, { Component } from "react";
import { Container, Col, Input, Row, Button } from "reactstrap";
import styled from "styled-components";
import Select from "react-select";
import { airlines } from "./airlines";
import axios from "axios";
import "./App.css";
import validator from "validator";

const selectableStructure = data =>
  Object.keys(data).map(key => {
    return { value: key, label: data[key] };
  });

const Title = styled.h1`
  font-weight: bold;
  text-align: center;
`;

const EmojiContainer = styled.div`
  font-size: 3rem;
  text-align: center;
`;
const AirlineContainer = styled.div`
  display: inline-block;
  width: 100%;
`;
const InputContainer = styled.div`
  display: inline-block;
  width: 100%;
`;
const AircraftContainer = styled.div`
  background-color: #fafafa;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledSelect = styled(Select)`
  font-size: 1.45rem;
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
      apiResponse: "",
      validAirline: false,
      validFlight: false,
      loading: false,
      error: false
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
      this.setState(
        { loading: !this.state.loading, error: false, apiResponse: "" },
        () => {
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
              this.setState({
                loading: false,
                error: false,
                apiResponse: res.data
              });
            })
            .catch(err => {
              this.setState({ loading: false, error: true });
            });
        }
      );
    }
  }

  onClickFetch() {
    this.fetchData();
  }

  onChangeInput(evt) {
    const { value } = evt.target;
    const validFlight = value !== undefined && value.length > 2;
    this.setState({ flight: value, validFlight });
  }

  onChangeAirline(selected) {
    if (selected === null) {
      this.setState({
        airline: "",
        validAirline: false
      });
    } else {
      this.setState({
        airline: selected.value,
        validAirline: selected.value !== undefined && selected.value !== ""
      });
    }
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
    const {
      flight,
      apiResponse,
      validAirline,
      validFlight,
      loading,
      error
    } = this.state;
    return (
      <Container className="my-4">
        <div>
          <Title>What's my aircraft?</Title>
        </div>
        <EmojiContainer>
          <Emoji symbol="🤔" />
        </EmojiContainer>
        <Row>
          <Col xs="12" sm="6">
            <AirlineContainer>
              <StyledSelect
                isClearable={true}
                isSearchable={true}
                options={selectableStructure(airlines)}
                placeholder="Airline"
                onChange={this.onChangeAirline}
              />
            </AirlineContainer>
          </Col>
          <Col xs="12" sm="6">
            <InputContainer>
              <Input
                onChange={this.onChangeInput}
                onKeyDown={this.onKeyDown}
                value={flight}
                placeholder="Flight #"
                bsSize="lg"
              />
            </InputContainer>
          </Col>
        </Row>

        <StyledButton
          size="lg"
          color="primary"
          onClick={this.onClickFetch}
          disabled={!(validFlight && validAirline)}
          className="my-4"
        >
          <Emoji symbol="Search for aircraft 🔍" />
        </StyledButton>
        {loading && (
          <div className="loading text-center">
            <h4>
              Loading <Emoji symbol={"⏳"} />
            </h4>
          </div>
        )}
        {error && (
          <div className="error text-center">
            There was an error. Please try again later.
          </div>
        )}
        <div
          className="result"
          dangerouslySetInnerHTML={{ __html: apiResponse }}
        />
        <div>
          <p>
            Made by{" "}
            <a className="muted" href="https://twitter.com/ediardo">
              Eddie Ramirez
              <Emoji symbol="👨🏻‍💻" />
            </a>
          </p>
        </div>
      </Container>
    );
  }
}

export default App;
