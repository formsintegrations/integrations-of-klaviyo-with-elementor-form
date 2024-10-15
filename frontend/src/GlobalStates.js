import { atom } from "recoil";

// atoms
// eslint-disable-next-line no-undef
export const $iklaviyoef = atom({
  key: "$iklaviyoef",
  default: typeof iklaviyoef !== "undefined" ? iklaviyoef : {},
});
export const $newFlow = atom({
  key: "$newFlow",
  default: {
    triggered_entity: "Elementor",
    triggerDetail: {
      name: "Elementor",
      title:
        "Elementor is the platform web creators choose to build professional WordPress websites, grow their skills, and build their business. Start for free today!",
      icon_url: "https://ps.w.org/elementor/assets/icon.svg?rev=2597493",
      slug: "elementor-pro/elementor-pro.php",
      pro: "elementor-pro/elementor-pro.php",
      type: "form",
      is_active: true,
      activation_url:
        "http://bit-integrations.test/wp-admin/plugins.php?action=activate&amp;plugin=elementor-pro%2Felementor-pro.php&amp;plugin_status=all&amp;paged=1&amp;s&amp;_wpnonce=8516dbffbf",
      install_url:
        "http://bit-integrations.test/wp-admin/update.php?action=install-plugin&amp;plugin=elementor-pro%2Felementor-pro.php&amp;_wpnonce=7df8d9fbe5",
      list: {
        action: "elementor/get",
        method: "get",
      },
      fields: {
        action: "elementor/get/form",
        method: "post",
        data: ["id"],
      },
    },
  },
  dangerouslyAllowMutability: true,
});
export const $actionConf = atom({
  key: "$actionConf",
  default: {},
  dangerouslyAllowMutability: true,
});
export const $formFields = atom({
  key: "$formFields",
  default: {},
  dangerouslyAllowMutability: true,
});
export const $flowStep = atom({
  key: "$flowStep",
  default: 1,
  dangerouslyAllowMutability: true,
});
