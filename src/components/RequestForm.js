import React, { useState } from "react";
import axios from "axios";
import { MASK_SIZE, MASK_PRICE } from "../const";
import { Redirect } from "react-router-dom";
// reactstrap components
import {
    UncontrolledAlert,
    Button,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    DropdownMenu,
    Row,
    Col,
    DropdownItem,
} from "reactstrap";

const RequestForm = () => {
    const maskSizes = Object.values(MASK_SIZE);
    const [requestorType, setRequestorType] = useState("individual");
    const [organizationName, setOrganizationName] = useState(null);
    const [organizationType, setOrganizationType] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [postalCode, setPostal] = useState("");
    const [maskAmntRegular, setMaskAmntRegular] = useState(0);
    const [maskAmntSmall, setMaskAmntSmall] = useState(0);
	const [testAmnt, setTestAmnt] = useState(0);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const totalDonation = MASK_PRICE * (maskAmntRegular + maskAmntSmall);

    const onMaskAmntChange = (event, maskSize) => {
        switch(maskSize) {
			case "Regular-size Masks":
				setMaskAmntRegular(parseInt(event.target.value));
			break;
			case "Small-size Masks":
				setMaskAmntSmall(parseInt(event.target.value));
			break;
			case "Boxes of COVID Tests":
				setTestAmnt(parseInt(event.target.value));
			break;
			default:
				setMaskAmntRegular(parseInt(event.target.value));
		}	
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!maskAmntRegular && !maskAmntSmall && !testAmnt) {
            setError("Please request at least one mask or box of COVID tests.");
            return false;
        }
        
        const newMaskRequest = {
            requestorType: requestorType,
            organizationName,
            organizationType,
            name: name,
            email: email,
            maskAmntRegular: maskAmntRegular,
            maskAmntSmall: maskAmntSmall,
			testAmnt: testAmnt,
            address: address,
            postal: postalCode,
		province:province,
            msg: msg,
            timestamp: new Date(),
        };
        if (apartment === "") {
            newMaskRequest.address = address + ', ' + city + ', ' + province + ', ' + postalCode;
        }
        else {
            newMaskRequest.address = address + ', ' + apartment + ', ' + city + ', ' + province + ', ' + postalCode;
        }
    // Adding Mask Request to DB
    axios
      .post("https://donatemask.ca/api/mask_request_add", newMaskRequest)
      .then(() => {
        setSubmitStatus(true);
      })
      .catch(error => {
        setSubmitFailed(true);
      });
  };

    return (
        <>
            <Form onSubmit={handleSubmit} id="request-form">
                <h3 className="display-3"> Request masks and boxes of COVID tests form</h3>
                <p>
                    {" "}
                    Masks requests are funded by charitable donations.  Feel free to leave a
                    thank you message to donors.
                </p>
                <div>
                    <p> Choose Requestor Type </p>
                    <select
                        value={requestorType}
                        onChange={(e) => setRequestorType(e.target.value)}
                    >
                        <option value="individual">Individual</option>
                        <option value="organization">Organization</option>
                    </select>

                    <br />
                    <br />
                </div>

        {/* Requestor Type - Organization Fields */}
        {requestorType == "organization" && (
          <Row>
            <Col md="6">
              <FormGroup>
                <Input
                  placeholder="Organization Name"
                  type="text"
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Input
                  placeholder="Organization Type"
                  onChange={(e) => setOrganizationType(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
        )}
        <Row>
          <Col md="6">
            <FormGroup>
              <Input
                placeholder="Name"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
               <Input
               placeholder="name@example.com"
               type="email"
               onChange={(e) => setEmail(e.target.value)}
               />
               </FormGroup>
                  </Col>
                  </Row>
              <Row>
                  <Col md="6">
                      <FormGroup>
                          <Input
                              id="exampleFormControlInput1"
                              placeholder="#, Street Name"
                              onChange={(e) => setAddress(e.target.value)}
                          />
                      </FormGroup>
                  </Col>
                  <Col md="6">
                      <FormGroup>
                          <Input
                              id="exampleFormControlInput1"
                              placeholder="Apartment #"
                              onChange={(e) => setApartment(e.target.value)}
                          />
                      </FormGroup>
                  </Col>
                  <Col md="6">
                      <FormGroup>
                          <Input
                              id="exampleFormControlInput1"
                              placeholder="City"
                              onChange={(e) => setCity(e.target.value)}
                          />
                      </FormGroup>
                  </Col>
                  <Col md="6">
                      <FormGroup>
                          <Input
                              id="exampleFormControlInput1"
                              placeholder="Province"
                              onChange={(e) => setProvince(e.target.value)}
                          />
                      </FormGroup>
                  </Col>
              </Row>
              <Row>
                  <Col md="6">
                      <FormGroup>
                          <Input
                              id="exampleFormControlInput1"
                              placeholder="Postal Code"
                              onChange={(e) => setPostal(e.target.value)}
                          />
                      </FormGroup>
                  </Col>
              </Row>
        <h3>Masks Types and Quantities and COVID Test Boxes (5-count) Quantities</h3>
        <Row>
          {maskSizes.map((maskSize) => {
            return (
              <Col md="6">
                <FormGroup>
                  <p>{maskSize}</p>
                  <Input
        			placeholder={`Please enter # requested`}
                    type="number"
                    min="0"
                    onChange={(e) => onMaskAmntChange(e, maskSize)}
                  />
                </FormGroup>
              </Col>
            );
          })}
        </Row>

        <Row>
          <Col md="12">
            <FormGroup>
              <Input
                placeholder="Thank You Message (Optional)"
                type="text"
                onChange={(e) => setMsg(e.target.value)}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <FormGroup>
              <Button color="success" outline type="submit" id="full-width">
                Request
              </Button>
            </FormGroup>
          </Col>
        </Row>
        {error && (
          <UncontrolledAlert color="danger" fade={false}>
            <span className="alert-inner--icon">
              <i className="ni ni-like-2" />
            </span>{" "}
            <span className="alert-inner--text">{error}</span>
          </UncontrolledAlert>
        )}
        {submitStatus &&(
                    <Redirect to='/confirmrequest' />
        )}
        {submitFailed && (
          <UncontrolledAlert color="danger" fade={false}>
            <span className="alert-inner--icon">
              <i className="ni ni-fat-remove" />
            </span>{" "}
            <span className="alert-inner--text">{"Sorry, Something Went Wrong!"}</span>
          </UncontrolledAlert>
        )}
      </Form>
    </>
  );
};

export default RequestForm;
