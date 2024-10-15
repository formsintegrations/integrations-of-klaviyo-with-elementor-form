import { useState } from "react";
import { useRecoilValue } from "recoil";
import { __ } from "../../../Utils/i18nwrap";
import CopyText from "../../Utilities/CopyText";
import LoaderSm from "../../Loaders/LoaderSm";
import { refreshModules } from "./ZohoCRMCommonFunc";
import { handleAuthorize } from "../IntegrationHelpers/IntegrationHelpers";
import { $iklaviyoef } from "../../../GlobalStates";

export default function ZohoCRMAuthorization({
  formID,
  crmConf,
  setCrmConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isInfo,
}) {
  const [isAuthorized, setisAuthorized] = useState(false);
  const [error, setError] = useState({
    dataCenter: "",
    clientId: "",
    clientSecret: "",
  });
  const iklaviyoef = useRecoilValue($iklaviyoef);
  const scopes =
    "ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.Read,zohocrm.files.CREATE";
  const nextPage = () => {
    setstep(2);
    !crmConf.module &&
      refreshModules(formID, crmConf, setCrmConf, setIsLoading, setSnackbar);
    document.querySelector(".btcd-s-wrp").scrollTop = 0;
  };
  const handleInput = (e) => {
    const newConf = { ...crmConf };
    const rmError = { ...error };
    rmError[e.target.name] = "";
    newConf[e.target.name] = e.target.value;
    setError(rmError);
    setCrmConf(newConf);
  };

  return (
    <div
      className="btcd-stp-page"
      style={{
        ...{ width: step === 1 && 900 },
        ...{ height: step === 1 && "auto" },
      }}
    >
      <div className="mt-3">
        <b>{__("Integration Name:", "bit-integrations")}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={crmConf.name}
        type="text"
        placeholder={__("Integration Name...", "bit-integrations")}
        disabled={isInfo}
      />

      <div className="mt-3">
        <b>{__("Data Center:", "bit-integrations")}</b>
      </div>
      <select
        onChange={handleInput}
        name="dataCenter"
        value={crmConf.dataCenter}
        className="btcd-paper-inp w-6 mt-1"
        disabled={isInfo}
      >
        <option value="">
          {__("--Select a data center--", "bit-integrations")}
        </option>
        <option value="com">zoho.com</option>
        <option value="eu">zoho.eu</option>
        <option value="com.cn">zoho.com.cn</option>
        <option value="in">zoho.in</option>
        <option value="com.au">zoho.com.au</option>
      </select>
      <div style={{ color: "red" }}>{error.dataCenter}</div>

      <div className="mt-3">
        <b>{__("Homepage URL:", "bit-integrations")}</b>
      </div>
      <CopyText
        value={`${window.location.origin}`}
        setSnackbar={setSnackbar}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
      />

      <div className="mt-3">
        <b>{__("Authorized Redirect URIs:", "bit-integrations")}</b>
      </div>
      <CopyText
        value={redirectLocation || `${iklaviyoef.api.base}/redirect`}
        setSnackbar={setSnackbar}
        className="field-key-cpy w-6 ml-0"
        readOnly={isInfo}
      />

      <small className="d-blk mt-5">
        {__("To get Client ID and SECRET , Please Visit", "bit-integrations")}{" "}
        <a
          className="btcd-link"
          href={`https://api-console.zoho.${crmConf?.dataCenter || "com"}/`}
          target="_blank"
          rel="noreferrer"
        >
          {__("Zoho API Console", "bit-integrations")}
        </a>
      </small>

      <div className="mt-3">
        <b>{__("Client id:", "bit-integrations")}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientId"
        value={crmConf.clientId}
        type="text"
        placeholder={__("Client id...", "bit-integrations")}
        disabled={isInfo}
      />
      <div style={{ color: "red" }}>{error.clientId}</div>

      <div className="mt-3">
        <b>{__("Client secret:", "bit-integrations")}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="clientSecret"
        value={crmConf.clientSecret}
        type="text"
        placeholder={__("Client secret...", "bit-integrations")}
        disabled={isInfo}
      />
      <div style={{ color: "red" }}>{error.clientSecret}</div>

      {!isInfo && (
        <>
          <button
            onClick={() =>
              handleAuthorize(
                "zohoCRM",
                "zcrm",
                scopes,
                crmConf,
                setCrmConf,
                setError,
                setisAuthorized,
                setIsLoading,
                setSnackbar,
                iklaviyoef
              )
            }
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}
          >
            {isAuthorized
              ? __("Authorized ✔", "bit-integrations")
              : __("Authorize", "bit-integrations")}
            {isLoading && <LoaderSm size="20" clr="#022217" className="ml-2" />}
          </button>
          <br />
          <button
            onClick={nextPage}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={!isAuthorized}
          >
            {__("Next", "bit-integrations")}
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        </>
      )}
    </div>
  );
}
