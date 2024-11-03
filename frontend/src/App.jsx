import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./resource/sass/app.scss";
import { Toaster } from "react-hot-toast";
import { __ } from "./Utils/i18nwrap";
import "./resource/icons/style.css";
import Loader from "./components/Loaders/Loader";
import logo from "./resource/img/logo.svg";
import Integrations from "./components/Integrations";
import TableLoader from "./components/Loaders/TableLoader";
import Settings from "./pages/Settings";
import FlowBuilder from "./pages/FlowBuilder";

const AllIntegrations = lazy(() => import("./pages/AllIntegrations"));
const Error404 = lazy(() => import("./pages/Error404"));

function App() {
  const loaderStyle = { height: "82vh" };

  useEffect(() => {
    removeUnwantedCSS();
  }, []);

  return (
    <Suspense fallback={<Loader className="g-c" style={loaderStyle} />}>
      <Toaster
        position="bottom-right"
        containerStyle={{ inset: "-25px 30px 20px -10px" }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#000000",
            color: "#fff",
            bottom: 40,
            padding: "15px 18px",
            boxShadow:
              "0 0px 7px rgb(0 0 0 / 30%), 0 3px 30px rgb(0 0 0 / 20%)",
          },
        }}
      />

      <div className="Btcd-App">
        <div className="nav-wrp">
          <div className="flx">
            <div className="logo flx" title={__("Integrations for Forms")}>
              <Link to="/" className="flx">
                <img src={logo} alt="logo" className="ml-2" />
                <span className="ml-2">Elementor Klaviyo</span>
              </Link>
            </div>
            <nav className="top-nav ml-2">
              <Link exact to="/" activeClassName="app-link-active">
                {__("Integrations")}
              </Link>
              <Link exact to="/app-settings" activeClassName="app-link-active">
                {__("Settings")}
              </Link>
            </nav>

            <div className="pro-link">
              <a
                href="hhttps://formsintegrations.com/elementor-forms-integration-with-klaviyo/"
                target="_blank"
              >
                Get Pro
              </a>
            </div>
          </div>
        </div>

        <div className="route-wrp">
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Suspense fallback={<TableLoader />}>
                  <AllIntegrations />
                </Suspense>
              }
            />
            <Route
              path="/app-settings"
              element={
                <Suspense
                  fallback={<Loader className="g-c" style={loaderStyle} />}
                >
                  <Settings />
                </Suspense>
              }
            />

            <Route
              path="/flow/new"
              element={
                <Suspense
                  fallback={<Loader className="g-c" style={loaderStyle} />}
                >
                  <FlowBuilder />
                </Suspense>
              }
            />
            <Route
              path="/flow/action/*"
              element={
                <Suspense
                  fallback={<Loader className="g-c" style={loaderStyle} />}
                >
                  <Integrations />
                </Suspense>
              }
            />

            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </div>
    </Suspense>
  );
}

function removeUnwantedCSS() {
  const conflictStyles = ["bootstrap"];
  const styles = document.styleSheets;

  for (let i = 0; i < styles.length; i += 1) {
    if (styles[i].href !== null) {
      const regex = new RegExp(conflictStyles.join(".*css|"), "gi");
      if (styles[i]?.href.match(regex)) {
        styles[i].disabled = true;
      }
    }
  }
}

export default App;
