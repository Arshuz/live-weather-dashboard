import { motion } from "framer-motion";
import { X, Sun, Moon, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  temperatureUnit: "C" | "F" | "K";
  onTemperatureUnitChange: (unit: "C" | "F" | "K") => void;
}

export function Sidebar({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  temperatureUnit,
  onTemperatureUnitChange,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-80 bg-[#e0e5ec] shadow-neumorphism-inset z-50 p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shadow-neumorphism hover:shadow-neumorphism-hover"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="p-4 rounded-lg shadow-neumorphism-inset">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-500" />
                )}
                <span className="font-medium text-gray-800">Theme</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => onThemeChange(checked ? "dark" : "light")}
              />
            </div>
            <p className="text-xs text-gray-600">
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </p>
          </div>

          {/* Temperature Unit */}
          <div className="p-4 rounded-lg shadow-neumorphism-inset">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="w-5 h-5 text-red-500" />
              <span className="font-medium text-gray-800">Temperature Unit</span>
            </div>
            <Select value={temperatureUnit} onValueChange={(value) => onTemperatureUnitChange(value as "C" | "F" | "K")}>
              <SelectTrigger className="w-full shadow-neumorphism">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">Celsius (°C)</SelectItem>
                <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                <SelectItem value="K">Kelvin (K)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* About Section */}
          <div className="p-4 rounded-lg shadow-neumorphism-inset">
            <h3 className="font-medium text-gray-800 mb-2">About</h3>
            <p className="text-xs text-gray-600 mb-2">
              Live Weather Dashboard
            </p>
            <p className="text-xs text-gray-500">
              Developed by: A. MOHAMED ARSHAD
            </p>
            <p className="text-xs text-gray-500">
              Team: MOHAMMED AZARUDHIN A, MUZZAMMIL HUSIAN P S, SANTHANA PRAKASH R
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Date: 01-10-2025
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
