/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { __ } from "../../Utils/i18nwrap";
import SnackMsg from "../Utilities/SnackMsg";

const Loader = lazy(() => import("../Loaders/Loader"));
const ZohoCRMAuthorization = lazy(() =>
  import("./ZohoCRM/ZohoCRMAuthorization")
);

export default function IntegInfo() {
  const { id, type } = useParams();
  const [snack, setSnackbar] = useState({ show: false });
  const [integrationConf, setIntegrationConf] = useState({});
  const { data, isLoading, isError } = useFetch({
    payload: { id },
    action: "flow/get",
    method: "post",
  });

  useEffect(() => {
    if (!isError && !isLoading) {
      if (data?.success) {
        setIntegrationConf(data?.data?.integration.flow_details);
      } else {
        setSnackbar({
          ...{ show: true, msg: __("Failed to integration info") },
        });
      }
    }
  }, [data]);

  // route is info/:id but for redirect uri need to make new/:type
  let location = window.location.toString();
  const toReplaceInd = location.indexOf("/info");
  // location = window.encodeURI(`${location.slice(0, toReplaceInd)}/new/${type}`)
  location = `${iklaviyoef?.api?.base}/redirect`;

  const IntegrationInfo = () => {
    switch (integrationConf.type) {
      case "Zoho CRM":
        return (
          <ZohoCRMAuthorization
            crmConf={integrationConf}
            step={1}
            redirectLocation={location}
            isInfo
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx">
        <Link to="/" className="btn btcd-btn-o-gray">
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </Link>
        <div className="w-10 txt-center" style={{ marginRight: "73px" }}>
          <b className="f-lg">{type}</b>
          <div>{__("Integration Info")}</div>
        </div>
      </div>

      <Suspense
        fallback={<Loader className="g-c" style={{ height: "82vh" }} />}
      >
        <IntegrationInfo />
      </Suspense>
    </>
  );
}
