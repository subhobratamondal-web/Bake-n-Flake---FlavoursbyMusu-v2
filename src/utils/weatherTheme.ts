import { WeatherCondition, WeatherData } from '../types';

export interface WeatherThemeConfig {
  condition: WeatherCondition;
  accent: string;
  themeNameEn: string;
  themeNameBn: string;
  orb1: string;
  orb2: string;
  textAccent: string;
  borderAccent: string;
  bgGradient: string;
  particleColors: string[];
  icon: string;
}

export const WEATHER_THEMES: Record<WeatherCondition, WeatherThemeConfig> = {
  sunny: {
    condition: 'sunny',
    accent: '#f59e0b',
    themeNameEn: 'Warmer Golden Tones',
    themeNameBn: 'উষ্ণ সোনালী টোন',
    orb1: 'bg-amber-400/20 dark:bg-amber-500/15',
    orb2: 'bg-rose-400/20 dark:bg-rose-500/15',
    textAccent: 'text-amber-500 dark:text-amber-400',
    borderAccent: 'border-amber-300/60 dark:border-amber-500/30',
    bgGradient: 'from-amber-100/30 via-pink-50/20 to-slate-50 dark:from-[#0c0803] dark:via-[#050505] dark:to-[#050505]',
    particleColors: ['text-amber-400', 'text-orange-400', 'text-rose-400', 'text-yellow-300'],
    icon: '☀️',
  },
  rainy: {
    condition: 'rainy',
    accent: '#06b6d4',
    themeNameEn: 'Cooler Oceanic Tones',
    themeNameBn: 'শীতল সামুদ্রিক নীল টোন',
    orb1: 'bg-cyan-400/20 dark:bg-cyan-500/15',
    orb2: 'bg-teal-400/20 dark:bg-teal-500/15',
    textAccent: 'text-cyan-500 dark:text-cyan-400',
    borderAccent: 'border-cyan-300/60 dark:border-cyan-500/30',
    bgGradient: 'from-cyan-100/30 via-slate-50/20 to-slate-50 dark:from-[#03090a] dark:via-[#050505] dark:to-[#050505]',
    particleColors: ['text-cyan-400', 'text-teal-300', 'text-blue-300', 'text-sky-300'],
    icon: '🌧️',
  },
  cloudy: {
    condition: 'cloudy',
    accent: '#a855f7',
    themeNameEn: 'Soft Lavender Tones',
    themeNameBn: 'ল্যাভেন্ডার ক্লাউড টোন',
    orb1: 'bg-purple-400/20 dark:bg-purple-500/15',
    orb2: 'bg-indigo-400/20 dark:bg-indigo-500/15',
    textAccent: 'text-purple-500 dark:text-purple-400',
    borderAccent: 'border-purple-300/60 dark:border-purple-500/30',
    bgGradient: 'from-purple-100/30 via-pink-50/20 to-slate-50 dark:from-[#08040a] dark:via-[#050505] dark:to-[#050505]',
    particleColors: ['text-purple-400', 'text-fuchsia-400', 'text-indigo-300', 'text-pink-300'],
    icon: '⛅',
  },
  cool: {
    condition: 'cool',
    accent: '#10b981',
    themeNameEn: 'Crisp Mint Tones',
    themeNameBn: 'তাজা পুদিনা ফ্রেশ টোন',
    orb1: 'bg-emerald-400/20 dark:bg-emerald-500/15',
    orb2: 'bg-sky-400/20 dark:bg-sky-500/15',
    textAccent: 'text-emerald-500 dark:text-emerald-400',
    borderAccent: 'border-emerald-300/60 dark:border-emerald-500/30',
    bgGradient: 'from-emerald-100/30 via-slate-50/20 to-slate-50 dark:from-[#020806] dark:via-[#050505] dark:to-[#050505]',
    particleColors: ['text-emerald-400', 'text-sky-300', 'text-teal-300', 'text-cyan-300'],
    icon: '❄️',
  },
};

export const DEFAULT_LOCATION = {
  name: 'Sonarpur, Rajpur',
  latitude: 22.44,
  longitude: 88.39,
};

export async function fetchCurrentWeather(isAuto = true, manualCondition?: WeatherCondition): Promise<WeatherData> {
  if (!isAuto && manualCondition) {
    const theme = WEATHER_THEMES[manualCondition];
    return {
      condition: manualCondition,
      temp: manualCondition === 'sunny' ? 32 : manualCondition === 'rainy' ? 24 : manualCondition === 'cloudy' ? 27 : 18,
      locationName: 'Custom Weather',
      isAuto: false,
      labelEn: theme.themeNameEn,
      labelBn: theme.themeNameBn,
      icon: theme.icon,
    };
  }

  let lat = DEFAULT_LOCATION.latitude;
  let lon = DEFAULT_LOCATION.longitude;
  let locName = DEFAULT_LOCATION.name;

  if (isAuto && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
      });
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      locName = 'Local Weather';
    } catch {
      // Fallback to Sonarpur, Rajpur
      locName = DEFAULT_LOCATION.name;
    }
  }

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await res.json();
    if (data && data.current_weather) {
      const code = data.current_weather.weathercode;
      const temp = Math.round(data.current_weather.temperature);

      let condition: WeatherCondition = 'sunny';
      if (code === 0 || code === 1) {
        condition = 'sunny';
      } else if (code === 2 || code === 3 || code === 45 || code === 48) {
        condition = 'cloudy';
      } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) {
        condition = 'rainy';
      } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86) || temp < 20) {
        condition = 'cool';
      } else {
        condition = temp > 28 ? 'sunny' : 'cloudy';
      }

      const theme = WEATHER_THEMES[condition];
      return {
        condition,
        temp,
        locationName: locName,
        isAuto: true,
        labelEn: theme.themeNameEn,
        labelBn: theme.themeNameBn,
        icon: theme.icon,
      };
    }
  } catch (err) {
    console.warn('Weather fetch fallback:', err);
  }

  // Fallback if API fails
  const theme = WEATHER_THEMES.sunny;
  return {
    condition: 'sunny',
    temp: 29,
    locationName: DEFAULT_LOCATION.name,
    isAuto: true,
    labelEn: theme.themeNameEn,
    labelBn: theme.themeNameBn,
    icon: theme.icon,
  };
}
