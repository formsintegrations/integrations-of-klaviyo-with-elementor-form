import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { __ } from "../../../Utils/i18nwrap";
import Steps from "../../Utilities/Steps";
import IntegrationStepThree from "../IntegrationHelpers/IntegrationStepThree";
import KlaviyoAuthorization from "./KlaviyoAuthorization";
import { nextPage, saveConfig } from "./KlaviyoCommonFunc";
import KlaviyoIntegLayout from "./KlaviyoIntegLayout";

function Klaviyo({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false,
  });
  const [step, setStep] = useState(1);
  const [klaviyoConf, setKlaviyoConf] = useState({
    name: "Klaviyo",
    type: "Klaviyo",
    authKey:
      process.env.NODE_ENV === "development"
        ? "pk_54ace6c2f909509fdb38ffeaa8e459aed3"
        : "",
    field_map: [{ formField: "", klaviyoFormField: "" }],
    custom_field_map: [{ formField: "", klaviyoFormField: "" }],
    klaviyoFields: [
      { key: "email", label: __("Email", "elementor-klaviyo"), required: true },
      {
        key: "first_name",
        label: __("First Name", "elementor-klaviyo"),
        required: false,
      },
      {
        key: "last_name",
        label: __("Last Name", "elementor-klaviyo"),
        required: false,
      },
      {
        key: "title",
        label: __("Title", "elementor-klaviyo"),
        required: false,
      },
      {
        key: "organization",
        label: __("Organization", "elementor-klaviyo"),
        required: false,
      },
      {
        key: "phone_number",
        label: __("Phone Number", "elementor-klaviyo"),
        required: false,
      },
    ],
    listId: "",
    actions: {},
  });
  return (
    <div>
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* --- STEP 1 --- */}

      <KlaviyoAuthorization
        klaviyoConf={klaviyoConf}
        setKlaviyoConf={setKlaviyoConf}
        loading={loading}
        setLoading={setLoading}
        step={step}
        setStep={setStep}
      />

      {/* --- STEP 2 --- */}

      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: "auto",
            overflow: "visible",
          }),
        }}
      >
        <KlaviyoIntegLayout
          formFields={formFields}
          klaviyoConf={klaviyoConf}
          setKlaviyoConf={setKlaviyoConf}
          loading={loading}
          setLoading={setLoading}
        />

        <button
          onClick={() => nextPage(klaviyoConf, setStep, 3)}
          disabled={!klaviyoConf.listId || klaviyoConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__("Next", "elementor-klaviyo")}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveConfig(
            flow,
            setFlow,
            allIntegURL,
            klaviyoConf,
            navigate,
            setIsLoading
          )
        }
        isLoading={isLoading}
        dataConf={klaviyoConf}
        setDataConf={setKlaviyoConf}
        formFields={formFields}
      />
    </div>
  );
}

export default Klaviyo;
