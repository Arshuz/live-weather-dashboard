import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherCardProps {
  time: string;
  temp: number;
  condition: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
  visibility: number;
  unit: "C" | "F" | "K";
}

export function WeatherCard({
  time,
  temp,
  condition,
  precipitation,
  humidity,
  windSpeed,
  uvIndex,
  pressure,
  visibility,
  unit,
}: WeatherCardProps) {
  const getWeatherIcon = () => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return <Cloud className="w-12 h-12 text-gray-400" />;
    } else {
      return <Sun className="w-12 h-12 text-yellow-500" />;
    }
  };

  const convertTemp = (celsius: number) => {
    if (unit === "F") return (celsius * 9/5 + 32).toFixed(1);
    if (unit === "K") return (celsius + 273.15).toFixed(1);
    return celsius.toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-4 bg-[#e0e5ec] border-none shadow-neumorphism hover:shadow-neumorphism-hover transition-all duration-300">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-600">{time}</p>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {getWeatherIcon()}
          </motion.div>
          <p className="text-2xl font-bold text-gray-800">
            {convertTemp(temp)}°{unit}
          </p>
          <p className="text-xs text-gray-500 text-center">{condition}</p>
          
          <div className="w-full mt-2 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Droplets className="w-3 h-3" /> Precip
              </span>
              <span className="font-medium text-gray-800">{precipitation}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Droplets className="w-3 h-3" /> Humidity
              </span>
              <span className="font-medium text-gray-800">{humidity}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Wind className="w-3 h-3" /> Wind
              </span>
              <span className="font-medium text-gray-800">{windSpeed} km/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Sun className="w-3 h-3" /> UV
              </span>
              <span className="font-medium text-gray-800">{uvIndex}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Gauge className="w-3 h-3" /> Pressure
              </span>
              <span className="font-medium text-gray-800">{pressure} mb</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600">
                <Eye className="w-3 h-3" /> Visibility
              </span>
              <span className="font-medium text-gray-800">{visibility} km</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
