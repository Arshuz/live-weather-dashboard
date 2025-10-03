import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Menu, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeatherCard } from "@/components/WeatherCard";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface HourlyWeather {
  time: string;
  temp_c: number;
  condition: { text: string };
  precip_mm: number;
  humidity: number;
  wind_kph: number;
  uv: number;
  pressure_mb: number;
  vis_km: number;
}

export default function Dashboard() {
  const [location, setLocation] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [temperatureUnit, setTemperatureUnit] = useState<"C" | "F" | "K">("C");
  const [selectedDay, setSelectedDay] = useState<"yesterday" | "today" | "tomorrow">("today");
  const [userId] = useState(() => localStorage.getItem("weatherUserId") || `user_${Date.now()}`);

  const savePreferences = useMutation(api.weather.saveUserPreferences);
  const userPreferences = useQuery(api.weather.getUserPreferences, { userId });

  useEffect(() => {
    localStorage.setItem("weatherUserId", userId);
  }, [userId]);

  useEffect(() => {
    if (userPreferences) {
      setTheme(userPreferences.theme);
      setTemperatureUnit(userPreferences.temperatureUnit);
      if (userPreferences.location) {
        setLocation(userPreferences.location);
        fetchWeatherData(userPreferences.location);
      }
    }
  }, [userPreferences]);

  useEffect(() => {
    const savedLocation = localStorage.getItem("weatherLocation");
    if (savedLocation && !location) {
      setLocation(savedLocation);
      fetchWeatherData(savedLocation);
    } else if (!savedLocation) {
      requestLocation();
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = `${latitude},${longitude}`;
          setLocation(coords);
          localStorage.setItem("weatherLocation", coords);
          fetchWeatherData(coords);
          savePreferences({
            userId,
            temperatureUnit,
            theme,
            latitude,
            longitude,
            location: coords,
          });
        },
        (error) => {
          toast.error("Unable to get location. Please search manually.");
          console.error(error);
        }
      );
    }
  };

  const fetchWeatherData = async (loc: string) => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY || "YOUR_API_KEY_HERE";
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      const [todayData, yesterdayData, tomorrowData] = await Promise.all([
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=1&aqi=yes`).then(r => r.json()),
        fetch(`https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${loc}&dt=${formatDate(yesterday)}`).then(r => r.json()),
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=2&aqi=yes`).then(r => r.json()),
      ]);

      setWeatherData({
        location: todayData.location,
        today: todayData.forecast.forecastday[0],
        yesterday: yesterdayData.forecast.forecastday[0],
        tomorrow: tomorrowData.forecast.forecastday[1],
      });

      toast.success("Weather data updated!");
    } catch (error) {
      toast.error("Failed to fetch weather data. Please check your API key.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput);
      localStorage.setItem("weatherLocation", searchInput);
      fetchWeatherData(searchInput);
      savePreferences({
        userId,
        temperatureUnit,
        theme,
        location: searchInput,
      });
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    savePreferences({
      userId,
      temperatureUnit,
      theme: newTheme,
      location,
    });
  };

  const handleTemperatureUnitChange = (unit: "C" | "F" | "K") => {
    setTemperatureUnit(unit);
    savePreferences({
      userId,
      temperatureUnit: unit,
      theme,
      location,
    });
  };

  const getCurrentDayData = () => {
    if (!weatherData) return null;
    return weatherData[selectedDay];
  };

  const dayData = getCurrentDayData();

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-[#2c3e50]" : "bg-[#e0e5ec]"} transition-colors duration-300`}>
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#e0e5ec] shadow-neumorphism p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-800">
              {weatherData?.location?.name || "Loading..."}
            </span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 shadow-neumorphism-inset border-none"
              />
            </div>
          </form>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="shadow-neumorphism hover:shadow-neumorphism-hover"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : weatherData ? (
          <>
            {/* Day Selector */}
            <div className="flex gap-4 mb-6 justify-center">
              {["yesterday", "today", "tomorrow"].map((day) => (
                <Button
                  key={day}
                  onClick={() => setSelectedDay(day as any)}
                  variant={selectedDay === day ? "default" : "outline"}
                  className={`shadow-neumorphism capitalize ${
                    selectedDay === day ? "shadow-neumorphism-inset" : ""
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>

            {/* Hourly Forecast */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Hourly Forecast
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {dayData?.hour?.map((hour: HourlyWeather, index: number) => (
                  <WeatherCard
                    key={index}
                    time={new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    temp={hour.temp_c}
                    condition={hour.condition.text}
                    precipitation={hour.precip_mm}
                    humidity={hour.humidity}
                    windSpeed={hour.wind_kph}
                    uvIndex={hour.uv}
                    pressure={hour.pressure_mb}
                    visibility={hour.vis_km}
                    unit={temperatureUnit}
                  />
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-center text-gray-600">
            <p>Search for a location to see weather data</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        temperatureUnit={temperatureUnit}
        onTemperatureUnitChange={handleTemperatureUnitChange}
      />
    </div>
  );
}
