import { useEffect } from "react";
import { __ } from "../../../Utils/i18nwrap";
import ConditionalLogic from "../../ConditionalLogic";
import LoaderSm from "../../Loaders/LoaderSm";
import Note from "../../Utilities/Note";
import TableCheckBox from "../../Utilities/TableCheckBox";

export default function IntegrationStepThree({
  step,
  saveConfig,
  edit,
  disabled,
  isLoading,
  dataConf = null,
  setDataConf = null,
  formFields = [],
}) {
  useEffect(() => {
    if (dataConf && !dataConf?.condition) {
      const tmpConf = { ...dataConf };
      tmpConf.condition = {
        action_behavior: "",
        actions: [{ field: "", action: "value" }],
        logics: [
          { field: "", logic: "", val: "" },
          "or",
          { field: "", logic: "", val: "" },
        ],
      };
      setDataConf(tmpConf);
    }
  }, []);

  const checkedCondition = (val, checked) => {
    const tmpConf = { ...dataConf };
    if (checked) {
      tmpConf.condition.action_behavior = val;
    } else {
      tmpConf.condition.action_behavior = "";
    }
    setDataConf(tmpConf);
  };

  const info = `
  <ul>
      <li>In this version, you can only map two fields of Klaviyo.If you want to map all of the fields of Zoho then the <a href="https://formsintegrations.com/elementor-forms-integration-with-klaviyo/">Pro version</a> is available for you.</li>
  </ul>`;
  return (
    <div>
      {dataConf?.condition && edit && (
        <>
          <div className="flx">
            <TableCheckBox
              onChange={(e) =>
                checkedCondition(e.target.value, e.target.checked)
              }
              checked={dataConf?.condition?.action_behavior === "cond"}
              className="wdt-200 mt-4 mr-2"
              value="cond"
              title={__("Conditional Logics", "bit_integration")}
            />
          </div>
          <br />
          {dataConf?.condition?.action_behavior === "cond" && (
            <ConditionalLogic
              formFields={formFields}
              dataConf={dataConf}
              setDataConf={setDataConf}
            />
          )}
        </>
      )}

      {dataConf?.condition && step === 2 && !edit && (
        <>
          <div className="flx pl-2">
            <TableCheckBox
              onChange={(e) =>
                checkedCondition(e.target.value, e.target.checked)
              }
              checked={dataConf?.condition?.action_behavior === "cond"}
              className="wdt-200 mt-4 mr-2"
              value="cond"
              title={__("Conditional Logics", "bit_integration")}
            />
          </div>
          <br />
          {dataConf?.condition?.action_behavior === "cond" && (
            <ConditionalLogic
              formFields={formFields}
              dataConf={dataConf}
              setDataConf={setDataConf}
            />
          )}
          <Note note={info} className={"fieldInfo"} />
        </>
      )}

      {edit ? (
        <div className="txt-center w-9 mt-3">
          <button
            onClick={saveConfig}
            className="btn btcd-btn-lg green sh-sm flx"
            type="button"
            disabled={isLoading || disabled}
          >
            {__("Update")}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
        </div>
      ) : (
        <div
          className="btcd-stp-page txt-center"
          style={{ width: step === 3 && "100%", height: step === 3 && "auto" }}
        >
          <h2 className="ml-3">{__("Successfully Integrated")}</h2>
          <button
            onClick={saveConfig}
            className="btn btcd-btn-lg green sh-sm"
            type="button"
            disabled={isLoading}
          >
            {__("Finish & Save ")}✔
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
        </div>
      )}
    </div>
  );
}
