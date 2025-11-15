import Card from "./Card";
import { useEffect, useState } from "react";

type WeatherResponse = {
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
};

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function WeatherCard() {
  const [data, setData] = useState<WeatherResponse | null>(null); // 天気データ
  const [loading, setLoading] = useState(true); // ローディング中かどうか
  const [error, setError] = useState(""); // エラー

  useEffect(() => {
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=Tokyo&lang=ja&units=metric&appid=${WEATHER_API_KEY}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("天気データの取得に失敗しました。");
        setLoading(false);
      });
  }, []); // マウント時に1回だけ実行

  if (loading) {
    return (
      <Card title="天気">
        <p className="text-gray-300">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="天気">
        <p className="text-red-400">{error}</p>
      </Card>
    );
  }

  const temp = data?.main?.temp;
  const desc = data?.weather?.[0]?.description;
  const icon = data?.weather?.[0]?.icon;

  return (
    <Card title="天気">
      <div className="flex items-center gap-4">
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
            className="w-16 h-16"
          />
        )}

        <div>
          <p className="text-3xl font-bold">{temp}°C</p>
          <p className="text-gray-300">{desc}</p>
        </div>
      </div>
    </Card>
  );
}
