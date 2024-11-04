import { useRecoilValue } from "recoil";
import { $iklaviyoef } from "../../../GlobalStates";
import { __ } from "../../../Utils/i18nwrap";
import { SmartTagField } from "../../../Utils/StaticData/SmartTagField";
import TagifyInput from "../../Utilities/TagifyInput";
import { handleCustomValue } from "../IntegrationHelpers/IntegrationHelpers";
import {
  generateMappedField,
  addFieldMap,
  delFieldMap,
} from "./KlaviyoCommonFunc";

function KlaviyoFieldMap({
  i,
  field,
  formFields,
  klaviyoConf,
  setKlaviyoConf,
  type,
}) {
  const iklaviyoef = useRecoilValue($iklaviyoef);
  const { isPro } = iklaviyoef;

  const requiredFields =
    klaviyoConf?.klaviyoFields.filter((fld) => fld.required === true) || [];

  const nonrequiredFields =
    klaviyoConf?.klaviyoFields.filter((fld) => fld.required === false) || [];

  const handleFieldMapping = (event, index) => {
    const newConf = { ...klaviyoConf };

    newConf[type][index][event.target.name] = event.target.value;
    setKlaviyoConf(newConf);
  };

  console.log(klaviyoConf);

  return (
    <div className="flx mt-2 mb-2 iklaviyoef-field-map">
      <div className="pos-rel flx">
        <div className="flx integ-fld-wrp">
          <select
            className="btcd-paper-inp mr-2"
            name="formField"
            onChange={(event) => {
              handleFieldMapping(event, i);
            }}
            value={field.formField || ""}
          >
            <option value="">{__("Select Field", "elementor-klaviyo")}</option>
            <optgroup label={__("Form Fields", "elementor-klaviyo")}>
              {formFields?.map((f) => (
                <option key={`ff-rm-${f.name}`} value={f.name}>
                  {f.label}
                </option>
              ))}
            </optgroup>
            <option value="custom">
              {__("Custom...", "elementor-klaviyo")}
            </option>
            <optgroup
              label={sprintf(
                __("General Smart Codes %s", "elementor-klaviyo"),
                isPro ? "" : `(${__("Pro", "elementor-klaviyo")})`
              )}
            >
              {isPro &&
                SmartTagField?.map((f) => (
                  <option key={`ff-rm-${f.name}`} value={f.name}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
          </select>

          {/* When user select custom field */}

          {field.formField === "custom" && (
            <TagifyInput
              onChange={(e) =>
                handleCustomValue(e, i, klaviyoConf, setKlaviyoConf)
              }
              label={__("Custom Value", "elementor-klaviyo")}
              className="mr-2"
              type="text"
              value={field?.customValue || ""}
              placeholder={__("Custom Value", "elementor-klaviyo")}
              formFields={formFields}
            />
          )}

          {type === "field_map" ? (
            <select
              className="btcd-paper-inp"
              disabled={i < requiredFields.length}
              name="klaviyoFormField"
              onChange={(event) => {
                handleFieldMapping(event, i);
              }}
              value={
                i < requiredFields.length
                  ? requiredFields[i].key || ""
                  : field.klaviyoFormField || ""
              }
            >
              <option value="">
                {__("Select Field", "elementor-klaviyo")}
              </option>
              {i < requiredFields.length ? (
                <option
                  key={requiredFields[i].key}
                  value={requiredFields[i].key}
                >
                  {requiredFields[i].label}
                </option>
              ) : (
                nonrequiredFields.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))
              )}
            </select>
          ) : (
            <input
              className="btcd-paper-inp"
              name="klaviyoFormField"
              value={field["klaviyoFormField"] || ""}
              onChange={(event) => {
                handleFieldMapping(event, i);
              }}
              type="text"
            />
          )}
        </div>
        {klaviyoConf.field_map.length < 2 && (
          <button
            onClick={() => addFieldMap(i, klaviyoConf, setKlaviyoConf, type)}
            className="icn-btn sh-sm ml-2 mr-1"
            type="button"
          >
            +
          </button>
        )}

        <button
          onClick={() => delFieldMap(i, klaviyoConf, setKlaviyoConf, type)}
          className="icn-btn sh-sm ml-1"
          type="button"
          aria-label="btn"
        >
          <span className="btcd-icn icn-trash-2" />
        </button>
      </div>
    </div>
  );
}

export default KlaviyoFieldMap;
