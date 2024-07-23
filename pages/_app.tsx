import { ColyseusProvider } from "../context/colyseusContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ColyseusProvider>
      <Component {...pageProps} />
    </ColyseusProvider>
  );
}
