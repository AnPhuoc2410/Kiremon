import { useState, useEffect } from 'react';
import { fetchWeatherData, Forecast } from '../../services/weatherService';

export const useWeatherData = () => {
    const [forecasts, setForecasts] = useState<Forecast[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchWeatherData();
                setForecasts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []); // Empty dependency array means this effect runs once on mount

    return { forecasts, loading, error };
};