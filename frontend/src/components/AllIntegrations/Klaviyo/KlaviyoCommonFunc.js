/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
import toast from "react-hot-toast";
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";
import {
  saveActionConf,
  saveIntegConfig,
} from "../IntegrationHelpers/IntegrationHelpers";

export const editHandleInput = (e, conf, setConf) => {
  const newConf = { ...conf };
  const { name } = e.target;
  if (e.target.value !== "") {
    newConf[name] = e.target.value;
  } else {
    delete newConf[name];
  }
  setConf({ ...newConf });
};

export const handleAuthorize = (
  conf,
  setConf,
  setError,
  setisAuthorized,
  loading,
  setLoading
) => {
  if (!conf.authKey) {
    setError({
      authKey: !conf.authKey
        ? __("API Key can't be empty", "elementor-klaviyo")
        : "",
    });
    return;
  }
  setError({});
  setLoading({ ...loading, auth: true });

  const requestParams = { authKey: conf.authKey };

  bitsFetch(requestParams, "klaviyo_handle_authorize").then((result) => {
    if (result && result.success) {
      const newConf = { ...conf };
      if (result.data) {
        if (!newConf.default) {
          newConf.default = {};
        }
        newConf.default.lists = result.data;
      }
      setConf(newConf);
      setisAuthorized(true);
      setLoading({ ...loading, auth: false });
      toast.success(__("Authorized Successfully", "elementor-klaviyo"));
      return;
    }
    setLoading({ ...loading, auth: false });
    toast.error(__("Authorized failed", "elementor-klaviyo"));
  });
};

export const getAllLists = (conf, setConf, loading, setLoading) => {
  setLoading({ ...loading, list: true });

  const requestParams = { authKey: conf.authKey };

  bitsFetch(requestParams, "klaviyo_handle_authorize").then((result) => {
    if (result && result.success) {
      const newConf = { ...conf };
      if (result.data) {
        if (!newConf.default) {
          newConf.default = {};
        }
        newConf.default.lists = result.data;
      }
      setConf(newConf);
      setLoading({ ...loading, list: false });

      toast.success(__("List refresh successfully", "elementor-klaviyo"));
      return;
    }
    setLoading({ ...loading, list: false });
    toast.error(__("List refresh failed", "elementor-klaviyo"));
  });
};

export const generateMappedField = (klaviyoConf) => {
  const requiredFlds = klaviyoConf?.klaviyoFields.filter(
    (fld) => fld.required === true
  );
  return requiredFlds.length > 0
    ? requiredFlds.map((field) => ({
        formField: "",
        klaviyoFormField: field.key,
      }))
    : [{ formField: "", klaviyoFormField: "" }];
};

export const checkMappedFields = (klaviyoConf) => {
  const mappedFields = klaviyoConf?.field_map
    ? klaviyoConf.field_map.filter(
        (mappedField) =>
          !mappedField.formField ||
          !mappedField.klaviyoFormField ||
          (!mappedField.formField === "custom" && !mappedField.customValue)
      )
    : [];
  if (mappedFields.length > 0) {
    return false;
  }
  return true;
};

export const nextPage = (conf, setStep, pageNo) => {
  setTimeout(() => {
    document.getElementById("btcd-settings-wrp").scrollTop = 0;
  }, 300);

  if (!checkMappedFields(conf)) {
    toast.error(__("Please map mandatory fields", "elementor-klaviyo"));
    return;
  }
  conf.field_map.length > 0 && setStep(pageNo);
};

export const saveConfig = (
  flow,
  setFlow,
  allIntegURL,
  conf,
  navigate,
  setIsLoading
) => {
  setIsLoading(true);
  const resp = saveIntegConfig(
    flow,
    setFlow,
    allIntegURL,
    conf,
    navigate,
    "",
    "",
    setIsLoading
  );
  resp.then((res) => {
    if (res.success) {
      toast.success(res.data?.msg);
      navigate(allIntegURL);
    } else {
      toast.error(res.data || res);
    }
  });
};

export const saveUpdateConfig = (
  flow,
  allIntegURL,
  conf,
  navigate,
  edit,
  setIsLoading
) => {
  if (!checkMappedFields(conf)) {
    toast.error(__("Please map mandatory fields", "elementor-klaviyo"));
    return;
  }
  if (checkMappedFields(conf) === "required") {
    toast.error(
      __(
        "You must select email or phone in klaviyo fields",
        "elementor-klaviyo"
      )
    );
    return;
  }
  saveActionConf({ flow, allIntegURL, conf, navigate, edit, setIsLoading });
};

export const addFieldMap = (i, confTmp, setConf, type) => {
  const newConf = { ...confTmp };
  if (!newConf[type]) {
    newConf[type] = [];
  }

  newConf[type].splice(i, 0, {});
  setConf({ ...newConf });
};

export const delFieldMap = (i, confTmp, setConf, type) => {
  const newConf = { ...confTmp };
  if (newConf[type].length > 1) {
    newConf[type].splice(i, 1);
  }

  setConf({ ...newConf });
};
