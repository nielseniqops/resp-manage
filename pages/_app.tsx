import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import Script from "next/script";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig 
      value={{
        // refreshInterval: 2000,
        fetcher: (url:string) => fetch(url).then((response) => response.json())
        }}
    >
      <div className="w-full max-w-xl mx-auto">
        <div className="fixed w-40 h-40 bg-green-400 left-[-5rem] top-[-5rem] rotate-45 hidden md:block transition-all"></div> 
        <div className="fixed w-40 h-40 bg-green-400 right-[-5rem] bottom-[-5rem] rotate-45 hidden md:block transition-all"></div> 
        <Component {...pageProps} />
      </div>
      <Script 
        src="https://connect.facebook.net/en_US/sdk.js" 
        strategy="lazyOnload" 
      />
      {/*
      beforeInteractive: 페이지가 interactive 되기 전에 로드
      afterInteractive: (기본값) 페이지가 interactive 된 후에 로드
      lazyOnload: 다른 모든 데이터나 소스를 불러온 후에 로드
      worker: (실험적인) web worker에 로드
      */}
    </SWRConfig>
  );
}

export default MyApp;
