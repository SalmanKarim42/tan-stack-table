import { flexRender } from "@tanstack/react-table";
import { FaBackward } from "react-icons/fa";
import { IoIosFastforward } from "react-icons/io";
import { IoCaretBackOutline, IoCaretForward } from "react-icons/io5";
import FilterIcon from "../FilterIcon/FilterIcon";
import { useTable } from "../useTable";
import "./BasicTable.css";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useMemo, useRef } from "react";

export default function BasicTable({
  columns,
  stickyHeader,
  data,
  showPagination,
  ...rest
}) {
  const table = useTable({
    data,
    columns,
    ...rest,
    showPagination,
  });
  const { rows, ...restt } = table.getRowModel();
  const parentRef = useRef(null);

  const virtualizer = !showPagination
    ? useVirtualizer({
        count: rows?.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 34,
        overscan: 20,
      })
    : null;
  console.log("rest", restt);

  const renderRowCell = useMemo(
    () => (row) => {
      return row
        .getVisibleCells()
        .map((cell) => (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ));
    },
    []
  );

  console.log("rows", rows.length);
  const items = virtualizer?.getVirtualItems();
  const firstRowStart = items?.[0]?.start ?? 0;
  return (
    <div className="table-container">
      <h1>Site List</h1>

      <div className="table-controls">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={table.getState().globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
        <FilterIcon table={table} />
      </div>
      <div
        ref={parentRef}
        style={{
          flex: 1,
          overflow: "auto",
          // height: "100%",
          height: showPagination ? "100%" : virtualizer?.getTotalSize(),
          width: "100%",
          // backgroundColor: "red",
          position: "relative",
        }}
      >
        <table
          className="custom-table"
          style={
            !showPagination
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${firstRowStart}px)`,
                }
              : {}
          }
        >
          <thead
            style={
              stickyHeader
                ? {
                    position: "sticky",
                    top: -firstRowStart,
                  }
                : {}
            }
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      minWidth: 150,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {
                          { asc: "🔼", desc: "🔽", false: " null" }[
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
            {/* {table.getRowModel().rows.map((row) => { return ( */}
            {showPagination
              ? rows.map((row) => <tr key={row.id}>{renderRowCell(row)}</tr>)
              : items.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={virtualizer.measureElement}
                    >
                      {renderRowCell(row)}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <div className="table_footer">
          <div style={{ display: "flex" }}>
            <p>Row per page</p>
            <select
              className="Rows"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <span style={{ display: "flex" }}>
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <div className="btn-grp">
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
              <IoCaretForward />
            </button>
            <button
              className="btn"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IoIosFastforward />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
