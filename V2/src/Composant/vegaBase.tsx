import { useRef, useEffect, useState } from "react";
import embed from "vega-embed";
import type { View } from "vega";

type VegaChartProps = {
  spec: any; // spécification Vega ou Vega-Lite
  signals?: Record<string, any>; // signals à mettre à jour dynamiquement
};

export default function VegaChart({ spec, signals = {} }: VegaChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Création initiale du graphique
  useEffect(() => {
    if (chartRef.current && spec) {
      embed(chartRef.current, spec, { actions: false })
        .then((result) => {
          viewRef.current = result.view;
          setIsReady(true);
        })
        .catch(console.error);
    }
  }, [spec]);

  // Mise à jour dynamique des signaux
  useEffect(() => {
    if (viewRef.current) {
      Object.keys(signals).forEach((signalName) => {
        viewRef.current!.signal(signalName, signals[signalName]);
      });
      viewRef.current.run(); // applique les changements
    }
  }, [signals, isReady]);

  return <div ref={chartRef}></div>;
}
