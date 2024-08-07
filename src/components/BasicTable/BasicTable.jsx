import {
  flexRender
} from '@tanstack/react-table';
import { FaBackward } from 'react-icons/fa';
import { IoIosFastforward } from 'react-icons/io';
import { IoCaretBackOutline, IoCaretForward } from 'react-icons/io5';
import FilterIcon from '../FilterIcon/FilterIcon';
import { useTable } from '../useTable';
import './BasicTable.css';


export default function BasicTable({ columns, data ,...rest}) {

  const table = useTable({
    data, columns,
    ...rest
  })


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
        <FilterIcon table={table} />
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
                        { asc: '🔼', desc: '🔽' , false: " null"}[
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
