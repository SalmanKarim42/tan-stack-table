// import {Tab} from  "@tanstack/react-table"

import { getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getGroupedRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"


export const useTable = ({ data, columns, filterFns = {}, showPagination, ...rest }) => {

  const table = useReactTable({
    data: data,
    columns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination && getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getColumnCanGlobalFilter: column => column.id !== 'actions',

    filterFns: { // add a custom global filter function
      filterColumnByCheckbox: (row, columnId, filterValue) => { // defined inline here
        const rowValue = row.getValue(columnId)
        const filterValueSet = new Set(filterValue || [])
        return filterValueSet.size === 0 ? true : filterValueSet.has(rowValue)  // true or false based on your custom logic
      },
      ...filterFns
    },
    ...rest
  })


  return table
}