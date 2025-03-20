import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import RangeDropdown from "./RangeDropdown";
import SortDropdown from "./SortDropdown";
import SearchBar from "./SearchBar";

const FilterBar = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="d-flex align-items-center flex-wrap gap-2">
      <FilterDropdown
        title="地區"
        name="location"
        options={[{ label: "1" }, { label: "2" }]}
      />
      <RangeDropdown title="租金" min={1000} max={50000} unit="元" step={500} />
      <RangeDropdown title="坪數" min={10} max={100} unit="坪" />
      <FilterDropdown
        title="寵物"
        name="pet"
        options={[{ label: "是" }, { label: "否" }]}
        type="radio"
      />
      <SearchBar
        placeholder="輸入關鍵字..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <SortDropdown
        title="排序方式"
        options={[
          { label: "租金由低到高", href: "#/action-1" },
          { label: "坪數由高到低", href: "#/action-2" },
          { label: "樓層由低到高", href: "#/action-3" },
        ]}
      />
    </div>
  );
};

export default FilterBar;
