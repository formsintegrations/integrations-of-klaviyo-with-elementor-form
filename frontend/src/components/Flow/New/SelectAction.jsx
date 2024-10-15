import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { $iklaviyoef, $flowStep, $newFlow } from "../../../GlobalStates";
import zohoCRM from "../../../resource/img/integ/crm.svg";
import { __ } from "../../../Utils/i18nwrap";
import { sortByField } from "../../../Utils/Helpers";

export default function SelectAction() {
  const { isPro } = useRecoilValue($iklaviyoef);
  const [newFlow, setNewFlow] = useRecoilState($newFlow);
  const setFlowStep = useSetRecoilState($flowStep);
  const history = useHistory();

  const integs = [{ type: "Zoho CRM", logo: zohoCRM, pro: isPro }];

  const updatedStep = () => {
    setFlowStep(1);
  };

  const setAction = (action) => {
    const tempConf = { ...newFlow };
    tempConf.action = action;
    setNewFlow(tempConf);
    history.push(`action/new/${action}`);
  };

  return (
    <>
      <div className="txt-center" style={{ width: "100%" }}>
        <button
          type="button"
          className="f-left btn btcd-btn-o-gray mt-1"
          onClick={updatedStep}
        >
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </button>
        <h2 className="mt-0">Please select a Action</h2>
      </div>
      <div className="btcd-inte-wrp txt-center">
        <div className="flx flx-center flx-wrp pb-3">
          {integs.map((inte, i) => (
            <div
              key={`inte-sm-${i + 2}`}
              onClick={() => !inte.disable && !inte.pro && setAction(inte.type)}
              onKeyPress={() =>
                !inte.disable && !inte.pro && setAction(inte.type)
              }
              role="button"
              tabIndex="0"
              className={`btcd-inte-card inte-sm mr-4 mt-3 ${
                inte.disable && !inte.pro && "btcd-inte-dis"
              } ${inte.pro && "btcd-inte-pro"}`}
            >
              {inte.pro && (
                <div className="pro-filter">
                  <span className="txt-pro">
                    <a
                      href="https://www.bitapps.pro"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {__("Premium")}
                    </a>
                  </span>
                </div>
              )}
              <img loading="lazy" src={inte.logo} alt="" />
              <div className="txt-center">{inte.type}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
