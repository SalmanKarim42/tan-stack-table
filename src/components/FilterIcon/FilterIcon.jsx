import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function FilterIcon({ table }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const filterRef = useRef(null);

  const uniqueColumnValues = useMemo(() => {
    const uniqueColumnValuesObj = {};
    table.getAllColumns().forEach((column) => {
      const uniqueRowValues = column.getFacetedUniqueValues().keys();
      uniqueColumnValuesObj[column.id] = Array.from(uniqueRowValues);
    });
    return uniqueColumnValuesObj;
  }, [table]);

  const handleHeaderClick = (columnName) => {
    setSelectedColumnId(columnName);
  };

  // close when click outside
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setSelectedColumnId(null);
        setDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const handleFilterChange = useCallback(
    (e, columnId, selectAll) => {
      const column = table.getColumn(columnId);
      const value = e.target.value;
      const filterValue = column.getFilterValue();
      let columnsFilterValues = new Set(filterValue || []);
      if (selectAll) {
        if (columnsFilterValues.size === uniqueColumnValues[columnId]?.length) {
          columnsFilterValues.clear();
        } else {
          columnsFilterValues = new Set(uniqueColumnValues[columnId] || []);
        }
      } else {
        if (e.target.checked) {
          columnsFilterValues.add(value);
        } else {
          columnsFilterValues.delete(value);
        }
      }
      column.setFilterValue(Array.from(columnsFilterValues));
    },
    [table, uniqueColumnValues]
  );

  const closeDropdowns = () => {
    table.resetColumnFilters();
    setSelectedColumnId(null);
    setDropdownOpen(false);
  };

  const columnFilters = table.getState().columnFilters;

  const columnFiltersObject = useMemo(
    () =>
      columnFilters.reduce((acc, column) => {
        acc[column.id] = column.value;
        return acc;
      }, {}),
    [columnFilters]
  );
  const isFilterApply = useMemo(() => {
    return Object.values(columnFiltersObject).some((filters) => filters.length);
  }, [columnFiltersObject]);

  const uniqueSelectedColumnRows = uniqueColumnValues?.[selectedColumnId] || [];

  return (
    <div ref={filterRef}>
      <button
        className="filterIcon"
        onClick={() =>
          setDropdownOpen((prev) => {
            if (prev) {
              setSelectedColumnId(null);
            }
            return !prev;
          })
        }
      >
        <FaFilter />
      </button>
      {dropdownOpen &&
        (!selectedColumnId ? (
          <div className="dropdown-menu">
            <ul>
              {Object.keys(uniqueColumnValues).map((columnName) => (
                <li key={columnName}>
                  <div onClick={() => handleHeaderClick(columnName)}>
                    {columnName}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="dropdown-menu">
            <ul>
              <li>
                <input
                  type="checkbox"
                  value={selectedColumnId}
                  onChange={(e) =>
                    handleFilterChange(e, selectedColumnId, true)
                  }

                  // checked={null}
                />
                Select all
              </li>
              {uniqueSelectedColumnRows?.map((rowValue, index) => {
                const columnFiltersSet = new Set(
                  columnFiltersObject[selectedColumnId] || []
                );
                return (
                  <li key={index}>
                    <input
                      type="checkbox"
                      value={rowValue}
                      onChange={(e) => handleFilterChange(e, selectedColumnId)}
                      checked={columnFiltersSet.has(rowValue)}
                    />
                    {rowValue}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      {isFilterApply && (
        <button className="closeIcon" onClick={closeDropdowns}>
          <IoClose />
        </button>
      )}
    </div>
  );
}

export default FilterIcon;
