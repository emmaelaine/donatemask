import React, {useState, useEffect} from "react";
import { Redirect } from "react-router-dom";

import classnames from "classnames";
import axios from 'axios';

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import Hero from 'components/Hero.js'
import DemoNavbar from "components/Navbars/DemoNavbar.js";

const Message = (props) => {
  /*
  props:
    body: str
      Body of the message.
    timestamp: Date Object
  */
  const timestamp = new Date(props.timestamp)
  const now = new Date();
  const elapsedTimeSeconds = Math.abs(timestamp- now)/1000 // In seconds.

  var elapsedTimeConverted;
  const secondConversion = {
    0: {
      suffix: "Second(s) ago",
      divideBy: 1
    },
    60: {
      suffix: "Minute(s) ago",
      divideBy: 60
    },
    3600: {
      suffix: "Hour(s) ago",
      divideBy: 3600
    },
    86400: {
      suffix: "Day(s) ago",
      divideBy: 86400,
    },
    2592000: {
      suffix: "Month(s) ago",
      divideBy: 2592000,
    }

  }

  // Converting the time from seconds to its respective unit, and suffixing.
  for(const key in secondConversion) {
    if (elapsedTimeSeconds > key) {
      let divisor = secondConversion[key].divideBy
      let suffix = secondConversion[key].suffix
      var elapsedTimeConverted = `${Math.round(elapsedTimeSeconds/divisor)} ${suffix}`
    }
  }
  return(
    <div className="message mt-2 d-flex justify-content-center">
      <p id="message"> <span id="time">{elapsedTimeConverted}</span> {props.body}</p>
    </div>
  );
}

const MessageRoll = () => {
  const [donationMsgs, setDonationMsgs] = useState('')
  const [requestMsgs, setRequestMsgs] = useState('')

  useEffect(() => {
    // Fetching donation and request data from the MongoDB (using the API).
    axios
      .get("http://localhost:5000/api/get_donations")
      .then(res => {
        getMessages(res.data, "donations")
      })

    axios
      .get("http://localhost:5000/api/get_mask_requests")
      .then(res => {
        getMessages(res.data, "requests")
      })

  }, [])

  const getMessages = (data, type) => {
    // Compiling all donation messages to a single list.
    var messages = []
    for (let i = 0; i < data.length; i++) {
      const curr_msg = {
        body: data[i].msg,
        timestamp: data[i].timestamp
      }
      messages.push(curr_msg)
    }

    // Pushing list to state.
    if (type == "donations") {
      setDonationMsgs(messages.reverse())
    }
    else if(type=="requests") {
      setRequestMsgs(messages.reverse())
    }
  }

  return (
      <Row className="message-roll justify-content-center">
        <Col xs={3}>
          <div className="messages" id="inspirational">
            <h3 className="display-4 d-flex justify-content-center mb-3"> Inspirational Messages</h3>
              {donationMsgs && donationMsgs.map((msg, idx) => (
                <Message body={msg.body} timestamp={msg.timestamp} key={idx}/>
              ))}
          </div>
        </Col>
        <Col xs={3}>
          <div className='messages' id="thankyou">
            <h3 className="display-4 d-flex justify-content-center"> Thank You Messages</h3>
              {requestMsgs && requestMsgs.map((msg, idx) => (
                <Message body={msg.body} timestamp={msg.timestamp} key={idx}/>
              ))}
          </div>
        </Col>
      </Row>
  );
}

const Stats = () => {
  const [donations, setDonations] = useState('')
  const [requests, setRequests] = useState('')
  const [totalMasksDonated, setTotalMasksDonated] = useState(0)
  const [totalMasksRequested, setTotalMasksRequested] = useState(0)

  useEffect(() => {
    // Fetching donation and request data from the database.
    axios
      .get("http://localhost:5000/api/get_donations")
      .then(res => {
        getTotalMasks(res.data, "donations")

      })
    axios
      .get("http://localhost:5000/api/get_mask_requests")
      .then(res => {
        getTotalMasks(res.data, "requests")
      })
  }, [])

  const getTotalMasks= (data, type) => {
    // Iterating through donations, determining total number of masks donated.
    var count = 0;
    for (let i = 0; i < data.length; i++) {
      count +=data[i].maskAmnt
    }

    // Pushing count to state.
    if (type == "donations") {
      setTotalMasksDonated(count)
    }
    else if(type=="requests") {
      setTotalMasksRequested(count)
    }
  }

  // Calculating unfulfilled mask requests.
  var unfulfilledMasks = 0;
  if (totalMasksRequested > totalMasksDonated) {
      var unfulfilledMasks = totalMasksRequested - totalMasksDonated
  }

  return (
    <>
      <DemoNavbar/>
      <Hero
        heading="Stats"
        body="View stats."/>
      <section className="section section-lg pt-lg-0 mt--100">
          <Container>
            <Row className="justify-content-center">
              <Col lg="12">
                <Row className="row-grid">
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                          <i className="ni ni-trophy" />
                        </div>
                        <h6 className="text-primary text-uppercase">
                          No. of Masks Donated
                        </h6>
                        <p className="display-3 text-center mt-3">
                          {totalMasksDonated}
                        </p>
                        <Button
                          className="mt-4"
                          color="primary"
                          href="/donate"
                        >
                          Donate
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                          <i className="ni ni-satisfied" />
                        </div>
                        <h6 className="text-success text-uppercase">
                          Total Masks Requests
                        </h6>
                        <p className="display-3 text-center mt-3">
                          {totalMasksRequested}
                        </p>
                        <Button
                          className="mt-4"
                          color="success"
                          href="/request"
                          onClick={e => e.preventDefault()}
                        >
                          Request
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg="4">
                    <Card className="card-lift--hover shadow border-0">
                      <CardBody className="py-5">
                        <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                          <i className="ni ni-sound-wave" />
                        </div>
                        <h6 className="text-warning text-uppercase">
                          Unfulfilled Mask Requsts
                        </h6>
                        <p className="display-3 text-center mt-3">
                          {unfulfilledMasks}
                        </p>
                        <Button
                          className="mt-4"
                          color="warning"
                          href="/donate"
                          onClick={e => e.preventDefault()}
                        >
                          Donate
                        </Button>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
        <MessageRoll/>
    </>
  );
}

export default Stats;
