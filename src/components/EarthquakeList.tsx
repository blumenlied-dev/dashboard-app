import { useState, useEffect } from "react";
import Card from "./Card";

type QuakeItem = {
  time: string; // 取得時刻
  code: number; // 551: 地震情報
  earthquake?: {
    time: string; // 発表時刻
    maxScale: number; // 震度 * 10 の値
    hypocenter: {
      name: string; // 震源地名称（例：宮崎県沖）
      depth: string; // 深さ
      magnitude: string; // マグニチュード
    };
  };
};

const title: string = "地震情報（直近5回）";

export default function EarthquakeList() {
  const [quakes, setQuakes] = useState<QuakeItem[] | null>(null);

  const [isLoading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const endpoint = "https://api.p2pquake.net/v2/history?codes=551&limit=5";

    const fetchQuakes = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error("HTTPエラー");
        }

        const json = (await res.json()) as QuakeItem[];

        // code = 551に絞る
        const filtered = json.filter((item) => item.code === 551);
        setQuakes(filtered);
      } catch (_error) {
        console.error(_error)
        setError("地震データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchQuakes();
  }, []);

  const formatShindo = (scale?: number): string => {
    if (scale == null) return "-";

    const table: Record<number, string> = {
      0: "0",
      10: "1",
      20: "2",
      30: "3",
      40: "4",
      50: "5弱",
      55: "5強",
      60: "6弱",
      65: "0強",
      70: "7",
    };

    return table[scale] ?? "?";
  };

  if (isLoading) {
    return (
      <Card title={title}>
        <p className="text-gray-300">Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title={title}>
        <p className="text-red-400">{error}</p>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <ul className="space-y-3">
        {quakes?.map((item, index) => {
          const eq = item.earthquake;
          if (!eq) return null;
          
          const shindo = formatShindo(eq.maxScale);

          return (
            <li
              key={index}
              className="flex flex-col gap-1 border-b border-slate-700 pb-2 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {item.time}
                </span>

                <span className="text-sm font-semibold">
                  最大震度 {shindo}
                </span>
              </div>
              <div className="text-gray-200">
                震源: {eq.hypocenter.name} &nbsp; 深さ: {eq.hypocenter.depth}km &nbsp;マグニチュード: {eq.hypocenter.magnitude}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
