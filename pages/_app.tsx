import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import Footer from "../components/footer";
import Header from "../components/header";
import "../styles/index.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-bunker-800 min-h-screen dark:text-gray-200 transition-colors duration-200 ease-linear overflow-x-hidden">
      <Header />
      <main className="flex flex-col flex-1 mx-4">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
