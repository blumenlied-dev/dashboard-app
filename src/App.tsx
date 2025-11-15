import './App.css'
import EarthquakeList from './components/EarthquakeList';
import TodoList from './components/TodoList';
import WeatherCard from './components/WeatherCard';

function App() {
  return (
    <>
      <div className='min-h-screen px-6 py-8'>
        <WeatherCard />
        <EarthquakeList />
        <TodoList />
      </div>
    </>
  );
}

export default App
