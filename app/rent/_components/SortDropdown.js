import Dropdown from "react-bootstrap/Dropdown";

const SortDropdown = ({ title, options }) => (
  <Dropdown className="d-flex flex-column" autoClose="outside">
    <Dropdown.Toggle className="sort-box">{title}</Dropdown.Toggle>
    <Dropdown.Menu>
      {options.map((option, index) => (
        <Dropdown.Item key={index} href={option.href} className="sort-drop">
          {option.label}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default SortDropdown;
