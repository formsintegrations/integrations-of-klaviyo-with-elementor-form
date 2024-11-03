import { useState } from "react";
import { __ } from "../../../Utils/i18nwrap";
import LoaderSm from "../../Loaders/LoaderSm";
import Note from "../../Utilities/Note";
import { handleAuthorize } from "./KlaviyoCommonFunc";

function KlaviyoAuthorization({
  klaviyoConf,
  setKlaviyoConf,
  step,
  setStep,
  isInfo,
  loading,
  setLoading,
}) {
  const [isAuthorized, setisAuthorized] = useState(false);
  const [error, setError] = useState({ name: "", authKey: "" });

  const handleInput = (e) => {
    const newConf = { ...klaviyoConf };
    const koError = { ...error };
    koError[e.target.name] = "";
    newConf[e.target.name] = e.target.value;
    setError(koError);
    setKlaviyoConf(newConf);
  };

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById("btcd-settings-wrp").scrollTop = 0;
    }, 300);

    setStep(2);
  };

  const note = `
  <h4>${__("Step of get API Key:", "elementor-klaviyo")}</h4>
  <ul>
    <li>${__(
      "Goto Settings and click on",
      "elementor-klaviyo"
    )} <a href="https://www.klaviyo.com/account#api-keys-tab" target='_blank'>${__(
    "API Keys.",
    "elementor-klaviyo"
  )}</a></li>
    <li>${__("Click on Create Private API key.", "elementor-klaviyo")}</li>
    <li>${__(
      "Copy the <b>Private API Key</b> and paste into <b>API Key</b> field of your authorization form.",
      "elementor-klaviyo"
    )}</li>
    <li>${__(
      "Finally, click <b>Authorize</b> button.",
      "elementor-klaviyo"
    )}</li>
</ul>
`;

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && "auto" },
      }}
    >
      <div className="mt-2">
        <div className="my-1">
          <b>{__("Integration Name:", "elementor-klaviyo")}</b>
        </div>

        <input
          className="btcd-paper-inp w-6 mt-1 mx-0"
          onChange={handleInput}
          name="name"
          value={klaviyoConf?.name}
          type="text"
          placeholder={__("Integration Name...", "elementor-klaviyo")}
          disabled={isInfo}
        />

        <div className="mt-3">
          <b>{__("API Key:", "elementor-klaviyo")}</b>
        </div>
        <input
          className="btcd-paper-inp w-6 mt-1 mx-0"
          onChange={handleInput}
          name="authKey"
          value={klaviyoConf?.authKey}
          type="text"
          placeholder={__("API Key...", "elementor-klaviyo")}
          disabled={isInfo}
        />

        {error.authKey && (
          <div className="mt-1 mb-2 error-msg">{error.authKey}</div>
        )}

        <small className="d-blk mt-5">
          {__("To get API key, please visit ", "elementor-klaviyo")}
          <a
            className="btcd-link"
            href="https://www.klaviyo.com/account#api-keys-tab"
            target="_blank"
            rel="noreferrer"
          >
            {__("here.", "elementor-klaviyo")}
          </a>
        </small>
        {!isInfo && (
          <div className="w-6 d-flx flx-between ">
            <button
              onClick={() =>
                handleAuthorize(
                  klaviyoConf,
                  setKlaviyoConf,
                  setError,
                  setisAuthorized,
                  loading,
                  setLoading
                )
              }
              className="btn btcd-btn-lg green sh-sm"
              type="button"
              disabled={isAuthorized || loading.auth}
            >
              {isAuthorized
                ? __("Authorized ✔", "elementor-klaviyo")
                : __("Authorize", "elementor-klaviyo")}
              {loading.auth && (
                <LoaderSm size="20" clr="#022217" className="ml-2" />
              )}
            </button>
            <br />
            <button
              onClick={nextPage}
              className="btn btcd-btn-lg green sh-sm"
              type="button"
              disabled={!isAuthorized}
            >
              {__("Next", "elementor-klaviyo")}
              <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
            </button>
          </div>
        )}
        <Note note={note} className="mt-5" />
      </div>
    </div>
  );
}

export default KlaviyoAuthorization;
