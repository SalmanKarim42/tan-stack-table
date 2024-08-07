import { useMemo, useState } from 'react';
import './App.css';
import movies from './MOVIE_DATA.json';
import BasicTable from './components/BasicTable/BasicTable';

function App() {
  const data = useMemo(() => movies, []);
  const [tableData, setTableData] = useState(data);

  const movieColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'name',
      filterFn: 'filterColumnByCheckbox',
    },
    {
      header: 'Genre',
      accessorKey: 'genre',
      filterFn: 'filterColumnByCheckbox',
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      filterFn: 'filterColumnByCheckbox',
    },
  ];


  return (
    <>
      <h1>Site List</h1>
      <div style={{maxHeight:"100%"}}>
        <BasicTable data={tableData} columns={movieColumns} />
      </div>
    </>
    // <Table />
  );
}

export default App;
