import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css' // core css file needed for ag-grid
import 'ag-grid-community/styles/ag-theme-alpine.css'


function App() {
  // row data
  const [rows, setRows] = useState([]);
  const [nextUrl, setNextUrl] = useState('https://swapi.dev/api/people/');
  const [urlsUsed, setUrlsUsed] = useState([]); // stores urls fetched

  // column definitions
  const [colDefs, setColDefs] = useState([
    {field: 'name', sortable: true, filter: true},
    {field: 'birth_year', sortable: true},
    {field: 'eye_color'},
    {field: 'gender', filter: true},
    {field: 'hair_color'}
  ]);

  useEffect(() => {
    fetchData(nextUrl)
  },[])

  const fetchData = (url) => {
    // prevents re-rendering and repeat fetch calls
    if(urlsUsed.includes(url)){
      return;
    }
    urlsUsed.push(url)

    // fetch api data
    fetch(url)
    .then(results => results.json())
    .then(data => {
        // add character info to rows as an object
        data.results.map(person => {
          setRows(rows => [...rows, {
            name: person.name,
            birth_year: person.birth_year,
            eye_color: person.eye_color,
            gender: person.gender,
            hair_color: person.hair_color,
          }])
        })

        // recursively call this function and continue fetching if there's a next page of results
        if(data.next){
          fetchData(data.next)
        }
        else{
          return;
        }
    })
  }

  return (
    <div className='ag-theme-alpine' style={{height: 800}}>
      <AgGridReact
        rowData={rows}
        columnDefs={colDefs}
      />
    </div>
  );
}

export default App;
