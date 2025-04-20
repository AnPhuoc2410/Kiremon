// Define the Forecast interface
export interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

// Service function to fetch weather data
export const fetchWeatherData = async (): Promise<Forecast[]> => {
    const response = await fetch('weatherforecast');
    if (!response.ok) {
        // Handle error appropriately in a real app
        console.error("Failed to fetch weather data:", response.statusText);
        throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data as Forecast[];
};