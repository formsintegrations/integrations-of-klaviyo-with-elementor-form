/* eslint-disable default-case */
import { useRecoilValue } from "recoil";
import { __, sprintf } from "../../../Utils/i18nwrap";
import Loader from "../../Loaders/Loader";
import {
  getAllLists,
  addFieldMap,
  generateMappedField,
} from "./KlaviyoCommonFunc";
import KlaviyoFieldMap from "./KlaviyoFieldMap";
import { $iklaviyoef } from "../../../GlobalStates";

function KlaviyoIntegLayout({
  klaviyoConf,
  setKlaviyoConf,
  formFields,
  loading,
  setLoading,
}) {
  const iklaviyoef = useRecoilValue($iklaviyoef);
  const { isPro } = iklaviyoef;

  const handleList = (e) => {
    const newConf = { ...klaviyoConf };
    const { name } = e.target;
    if (e.target.value !== "") {
      newConf[name] = e.target.value;
    } else {
      delete newConf[name];
    }
    newConf[e.target.name] = e.target.value;
    switch (e.target.name) {
      case "listId":
        newConf.field_map = generateMappedField(newConf);
        newConf.custom_field_map = [{ formField: "", klaviyoFormField: "" }];
        break;
    }

    setKlaviyoConf({ ...newConf });
  };

  return (
    <div>
      <b className="wdt-200 d-in-b mt-2">{__("List:", "elementor-klaviyo")}</b>
      <select
        name="listId"
        value={klaviyoConf.listId}
        onChange={handleList}
        className="btcd-paper-inp w-5"
      >
        <option value="">{__("Select List", "elementor-klaviyo")}</option>
        {klaviyoConf?.default?.lists &&
          klaviyoConf.default.lists.map((list, key) => (
            <option key={key} value={list?.id}>
              {list?.attributes?.name}
            </option>
          ))}
      </select>
      <button
        onClick={() =>
          getAllLists(klaviyoConf, setKlaviyoConf, loading, setLoading)
        }
        className="icn-btn sh-sm ml-2 mr-2 mt-2 tooltip"
        style={{ "--tooltip-txt": '"Refresh list"' }}
        type="button"
        disabled={loading.list}
      >
        &#x21BB;
      </button>

      {/* When user refresh the List then loader call */}

      {loading.list && (
        <Loader
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
            transform: "scale(0.7)",
          }}
        />
      )}

      {klaviyoConf?.listId && (
        <div className="mt-5">
          <b className="wdt-100">{__("Field Map", "elementor-klaviyo")}</b>

          <div className="btcd-hr mt-2 mb-4" />
          <div className="flx flx-around mt-2 mb-2 iklaviyoef-field-map-label">
            <div className="txt-dp">
              <b>{__("Form Fields", "elementor-klaviyo")}</b>
            </div>
            <div className="txt-dp">
              <b>{__("Klaviyo Fields", "elementor-klaviyo")}</b>
            </div>
          </div>
          {klaviyoConf?.field_map.map((itm, i) => (
            <KlaviyoFieldMap
              key={`ko-m-${i + 8}`}
              i={i}
              field={itm}
              formFields={formFields}
              klaviyoConf={klaviyoConf}
              setKlaviyoConf={setKlaviyoConf}
              type="field_map"
            />
          ))}

          {klaviyoConf.field_map.length < 2 && (
            <div className="txt-center iklaviyoef-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(
                    klaviyoConf.field_map.length,
                    klaviyoConf,
                    setKlaviyoConf,
                    "field_map"
                  )
                }
                className="icn-btn sh-sm"
                type="button"
              >
                +
              </button>
            </div>
          )}
        </div>
      )}
      {klaviyoConf?.listId && (
        <div className="mt-5">
          <b className="wdt-100">
            {__("Custom Properties", "elementor-klaviyo")}{" "}
            {isPro ? "" : `(${__("Pro", "elementor-klaviyo")})`}
          </b>
          <div className="btcd-hr mt-2 mb-4" />
          {isPro ? (
            <>
              <div className="flx flx-around mt-2 mb-2 iklaviyoef-field-map-label">
                <div className="txt-dp">
                  <b>{__("Form Fields", "elementor-klaviyo")}</b>
                </div>
                <div className="txt-dp">
                  <b>{__("Klaviyo Property name", "elementor-klaviyo")}</b>
                </div>
              </div>
              {klaviyoConf?.custom_field_map?.map((itm, i) => (
                <KlaviyoFieldMap
                  key={`ko-m-${i + 8}`}
                  i={i}
                  field={itm}
                  formFields={formFields}
                  klaviyoConf={klaviyoConf}
                  setKlaviyoConf={setKlaviyoConf}
                  type="custom_field_map"
                />
              ))}
              <div className="txt-center iklaviyoef-field-map-button mt-2">
                <button
                  onClick={() =>
                    addFieldMap(
                      klaviyoConf?.custom_field_map?.length,
                      klaviyoConf,
                      setKlaviyoConf,
                      "custom_field_map"
                    )
                  }
                  className="icn-btn sh-sm"
                  type="button"
                >
                  +
                </button>
              </div>
            </>
          ) : (
            <p>
              {sprintf(
                __(
                  "The Elementor Klaviyo Pro  plugin needs to be installed and activated to enable the  feature",
                  "elementor-klaviyo"
                ),
                "1.0.0",
                __("Custom Properties", "elementor-klaviyo")
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default KlaviyoIntegLayout;
