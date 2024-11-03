/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { $iklaviyoef, $flowStep, $newFlow } from "../../../GlobalStates";
import useFetch from "../../../hooks/useFetch";
import CloseIcn from "../../../Icons/CloseIcn";
import { __ } from "../../../Utils/i18nwrap";
import Loader from "../../Loaders/Loader";
import FormPlugin from "../../Triggers/FormPlugin";

export default function SelectTrigger() {
  const { isPro } = useRecoilValue($iklaviyoef);
  const loaderStyle = {
    display: "flex",
    height: "82vh",
    justifyContent: "center",
    alignItems: "center",
  };
  const { data, isLoading } = useFetch({ payload: {}, action: "trigger/list" });
  const [allTriggers, setAllTriggers] = useState(data || {});
  const flowStep = useRecoilValue($flowStep);
  const [newFlow, setNewFlow] = useRecoilState($newFlow);
  const navigate = useNavigate();

  useEffect(() => {
    setAllTriggers(data);
  }, [data]);

  const searchInteg = (e) => {
    const { value } = e.target;

    const filtered = Object.entries(data.data)
      .filter((integ) =>
        integ[1].name.toLowerCase().includes(value.toLowerCase())
      )
      .reduce((prev, [key, values]) => ({ ...prev, [key]: values }), {});
    setAllTriggers({ success: true, data: filtered });
  };

  const setTrigger = (trigger) => {
    const tempConf = { ...newFlow };
    tempConf.triggered_entity = trigger;
    tempConf.triggerDetail = allTriggers.data[trigger];
    setNewFlow(tempConf);
  };

  const removeTrigger = () => {
    navigate("/");
    // const tempConf = { ...newFlow }
    // delete tempConf.triggered_entity
    // setNewFlow(tempConf)
  };
  if (isLoading) {
    return <Loader style={loaderStyle} />;
  }

  return (
    <>
      {newFlow.triggered_entity ? (
        <>
          <div
            role="button"
            className="btcd-inte-card flx flx-center flx-wrp mr-4 mt-3"
            tabIndex="0"
          >
            <img loading="lazy" src={newFlow.triggerDetail?.icon_url} alt="" />
            <div className="txt-center">Elementor</div>
            <button
              onClick={removeTrigger}
              className="icn-btn btcd-mdl-close"
              aria-label="modal-close"
              type="button"
            >
              <CloseIcn size={16} stroke={3} />
            </button>
          </div>
          <div className="flx">
            {newFlow.triggerDetail?.type === "form" && flowStep === 1 && (
              <FormPlugin />
            )}
          </div>
        </>
      ) : (
        <>
          <div className=" btcd-inte-wrp txt-center">
            <h2 className="mt-0">Please select a Trigger</h2>
            <input
              type="search"
              className="btcd-paper-inp w-5 mb-2"
              onChange={searchInteg}
              placeholder="Search Trigger..."
              style={{ height: "50%" }}
            />
            <div className="flx flx-center flx-wrp pb-3">
              {allTriggers?.data &&
                Object.keys(allTriggers?.data)
                  .sort()
                  .map((inte, i) => (
                    <div
                      key={`inte-sm-${i + 2}`}
                      onClick={() =>
                        !inte.disable &&
                        (isPro || !allTriggers?.data[inte]?.isPro) &&
                        setTrigger(inte)
                      }
                      onKeyPress={() =>
                        !inte.disable &&
                        (isPro || !allTriggers?.data[inte]?.isPro) &&
                        setNewInteg(inte.type)
                      }
                      role="button"
                      tabIndex="0"
                      className={`btcd-inte-card inte-sm mr-4 mt-3 ${
                        inte.disable &&
                        (isPro || !allTriggers?.data[inte]?.isPro) &&
                        "btcd-inte-dis"
                      } ${
                        allTriggers?.data[inte]?.isPro &&
                        !isPro &&
                        "btcd-inte-pro"
                      }`}
                    >
                      {allTriggers?.data[inte]?.isPro && !isPro && (
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
                      <img
                        loading="lazy"
                        src={allTriggers?.data[inte].icon_url}
                        alt=""
                      />
                      <div className="txt-center">
                        {allTriggers?.data[inte].name}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
