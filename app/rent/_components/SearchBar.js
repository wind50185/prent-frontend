import React from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";

const SearchBar = ({ value, onChange }) => {
  return (
    <Form>
      <InputGroup>
        <Form.Control
          aria-describedby="search-icon"
          className="mr-sm-2 searchbar"
          value={value}
          onChange={onChange}
        />
        <InputGroup.Text id="search-icon">
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
