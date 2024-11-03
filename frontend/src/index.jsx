/* eslint-disable no-undef */
import { lazy, Suspense } from "react";
import { HashRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { AllFormContextProvider } from "./Utils/AllFormContext";
import Loader from "./components/Loaders/Loader";
import { RecoilRoot } from "recoil";

const App = lazy(() => import("./App"));

ReactDOM.render(
  <AllFormContextProvider>
    <RecoilRoot>
      <HashRouter>
        <Suspense
          fallback={
            <Loader
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "82vh",
              }}
            />
          }
        >
          <App />
        </Suspense>
      </HashRouter>
    </RecoilRoot>
  </AllFormContextProvider>,
  document.getElementById("btcd-app")
);

// serviceWorker.register();
