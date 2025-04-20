import './App.css';
import { useWeatherData } from './components/hooks/useWeatherData';


function App() {
    const { forecasts, loading, error } = useWeatherData();

    const contents = loading
        ? <p><em>Loading...</em></p>
        : error
            ? <p><em>Error loading data: {error}. Please try refreshing.</em></p>
            : forecasts === undefined
                ? <p><em>No data available. Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
                : <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp. (C)</th>
                            <th>Temp. (F)</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forecasts.map(forecast =>
                            <tr key={forecast.date}>
                                <td>{forecast.date}</td>
                                <td>{forecast.temperatureC}</td>
                                <td>{forecast.temperatureF}</td>
                                <td>{forecast.summary}</td>
                            </tr>
                        )}
                    </tbody>
                </table>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server using a custom hook and service.</p>
            {contents}
        </div>
    );
}

export default App;