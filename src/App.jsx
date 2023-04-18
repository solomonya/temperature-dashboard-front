import './App.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { settings } from './constants';
import { useEffect, useReducer } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const initialState = {
  labels: [],
  datasets: [
    {
      label: 'Temperature data',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const ActionsType = {
  DATA_FETCHED: 'DATA_FETCHED'
};

function reducer(state, action) {
  switch(action.type) {
    case ActionsType.DATA_FETCHED:
      return {
        labels: action.payload.map(temperatureData => new Date(temperatureData.created_at).toLocaleTimeString()),
        datasets: [
          {
            label: 'Temperature data',
            data: action.payload.map(temperatureData => temperatureData.temperature_value),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
      };
    default: 
      throw new Error();
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  const fetchTemperatureData = async () => {
    const response = await fetch(`${settings.API_URL}/temperature/`);
    const temperatureData = await response.json();
    dispatch({ type: ActionsType.DATA_FETCHED, payload: temperatureData });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTemperatureData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [])

  return (
    <div className="App">
      <h1>Temperature graphic</h1>
      <Line options={options} data={state} />
   </div>
  )
}


function randomFromInterval(min, max) { 
  const randomValue = Math.random() * (max - min + 1) + min; 
  return randomValue.toFixed(2);
}

export default App
