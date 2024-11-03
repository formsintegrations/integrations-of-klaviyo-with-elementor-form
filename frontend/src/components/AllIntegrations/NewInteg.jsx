/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
import { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { $newFlow } from "../../GlobalStates";
import { __ } from "../../Utils/i18nwrap";
import Loader from "../Loaders/Loader";

const Klaviyo = lazy(() => import("./Klaviyo/Klaviyo"));

export default function NewInteg({ allIntegURL }) {
  const { integUrlName } = useParams();
  const [flow, setFlow] = useRecoilState($newFlow);
  const navigate = useNavigate();
  if (!window.opener && !Object.keys(flow).length) {
    navigate("/flow/new");
  }
  const NewIntegs = () => {
    switch (integUrlName) {
      case "Klaviyo":
        return (
          <Klaviyo
            allIntegURL={allIntegURL}
            formFields={flow?.triggerData?.fields}
            flow={flow}
            setFlow={setFlow}
          />
        );
      default:
        return <></>;
    }
  };

  const goBack = () => {
    const tmpFlow = { ...flow };
    delete tmpFlow.action;
    setFlow(tmpFlow);
    navigate.goBack();
  };
  return (
    <div>
      <div className="flx">
        <button
          type="button"
          className="f-left btn btcd-btn-o-gray"
          onClick={goBack}
        >
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </button>
        <div className="w-10 txt-center" style={{ marginRight: "73px" }}>
          <div className="mb-1">
            <b className="f-lg">{integUrlName}</b>
          </div>
          <div>{__("Integration Settings")}</div>
        </div>
      </div>

      <Suspense
        fallback={<Loader className="g-c" style={{ height: "82vh" }} />}
      >
        <NewIntegs />
      </Suspense>
    </div>
  );
}
