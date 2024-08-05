import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { FaBackward, FaFilter } from 'react-icons/fa';
import { IoIosFastforward } from 'react-icons/io';
import { IoCaretBackOutline, IoCaretForward, IoClose } from 'react-icons/io5';
import './BasicTable.css';


export default function BasicTable({ columns, data }) {

  const [columnFilters, setColumnFilters] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false); 
  const [selectedHeader, setSelectedHeader] = useState(null); 

  // const filteredData = useMemo(() => {
  //   return data.filter(row => {
      
  //     if (Object.keys(columnFilters).length > 0) {
  //       return Object.entries(columnFilters).every(([columnId, selectedValues]) => {
  //         return selectedValues.length === 0 || selectedValues.includes(row[columnId]);
  //       });
  //     }

  //     return true;
  //   });
  // }, [data, columnFilters]);

  const table = useReactTable({
    data: data,
    columns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getColumnCanGlobalFilter: column => column.id !== 'actions',
    state: {
      // sorting,
      // globalFilter,
    },
    // onSortingChange: setSorting,
    // onGlobalFilterChange: setGlobalFilter,
  });

  const handleHeaderClick = (header) => {
    setSelectedHeader(header);
    setDropdownOpen(false); 
    setFilterDropdownOpen(true);
  };

  const handleFilterChange = (e, columnId) => {
    const value = e.target.value;
    setColumnFilters(prev => {
      const currentValues = prev[columnId] || [];
      if (e.target.checked) {
        return {
          ...prev,
          [columnId]: [...currentValues, value],
        };
      } else {
        return {
          ...prev,
          [columnId]: currentValues.filter(v => v !== value),
        };
      }
    });
  };

  const closeDropdowns = () => {
    setDropdownOpen(false);
    setFilterDropdownOpen(false);
  };

  return (
    <div className='table-container'>
      <div className='table-controls'>
        
        <input
          type='text'
          placeholder='Search...'
          className='search-bar'
          value={table.getState().globalFilter}
          onChange={e => table.setGlobalFilter(e.target.value)}
        />
        <div>
          <button className='filterIcon' onClick={() => setDropdownOpen(prev => !prev)}>
            <FaFilter />
          </button>
          {dropdownOpen && (
            <div className='dropdown-menu'>
              <ul>
                {table.getHeaderGroups().map(headerGroup => (
                  headerGroup.headers.map(header => (
                    <li key={header.id}>
                      <div
                        onClick={() => handleHeaderClick(header)}
                      >
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </li>
                  ))
                ))}
              </ul>
            </div>
          )}
          {dropdownOpen && (
            <button className='closeIcon' onClick={closeDropdowns}>
              <IoClose />
            </button>
          )}
          {filterDropdownOpen && selectedHeader && (
            <div className='dropdown-menu'>
              <ul>
                {data.map((row, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      value={row[selectedHeader.column.id]}
                      onChange={e => handleFilterChange(e, selectedHeader.column.id)}
                      checked={(columnFilters[selectedHeader.column.id] || []).includes(row[selectedHeader.column.id])}
                    />
                    {row[selectedHeader.column.id]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <table className='custom-table'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {
                        { asc: '🔼', desc: '🔽' }[
                        header.column.getIsSorted() ?? null
                        ]
                      }
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='table_footer'>
       
      <div style={{display:"flex"}}>
         <p>Row per page</p>
        <select
        className='Rows'
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        </div>
        <span style={{display:"flex"}}>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <div className='btn-grp'>
          <button
            className="btn"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FaBackward />
          </button>
          <button
            className="btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IoCaretBackOutline />
          </button>
          <button
            className="btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
           <IoCaretForward/>
          </button>
          <button
            className="btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IoIosFastforward/>
          </button>
        </div>
      </div>
    </div>
  );
}
