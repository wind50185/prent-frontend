import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const SearchBar = ({ value, onChange }) => {
  return (
    <Form className="mx-2 d-inline">
      <InputGroup>
        <Form.Control
          className="searchbar"
          value={value}
          onChange={onChange}
          placeholder="搜尋專家名稱"
        />
        <InputGroup.Text id="search-icon">
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
