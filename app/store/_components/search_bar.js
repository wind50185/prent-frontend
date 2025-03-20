import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const SearchBar = ({ value, onChange, onSearch }) => {
  return (
    <Form className="mx-2 d-inline">
      <InputGroup>
        <Form.Control
          className="searchbar"
          value={value}
          onChange={onChange} // 每次輸入時更新狀態
          placeholder="搜尋商品"
        />
        <InputGroup.Text id="search-icon" onClick={onSearch}>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;
