import { hydrateRoot } from "react-dom/client";
import Widget from "./widget/components/Widget";

function initializeWidget() {
  if (document.readyState !== "loading") {
    mountWidget();
  } else {
    document.addEventListener("DOMContentLoaded", mountWidget);
  }
}

function mountWidget() {
  try {
    const userMount = document.getElementById("widget-root");
    const container = userMount || document.body;

    if (!userMount) {
      console.warn(
        "No #widget-root found. Widget will be attached to document.body by default."
      );
    }

    const oldShadowHost = container.querySelector(
      "div[data-widget-shadow-host]"
    );
    if (oldShadowHost) {
      oldShadowHost.remove();
    }

    const element = document.createElement("div");
    element.setAttribute("data-widget-shadow-host", "true");
    const shadow = element.attachShadow({ mode: "open" });

    const shadowRoot = document.createElement("div");
    shadowRoot.id = "widget-shadow-root";

    const [walletID, DonationType, color, AssetName, textColor, fontType, textInfo, selectedCampaigns] = getWidgetAttributes();
    const Fontype =  fontType === 'Georgia'? 'noto-sans-georgian' : fontType
    const component = (
      <Widget
        walletID={walletID}
        DonationType={DonationType}
        color={color}
        AssetName={AssetName}
        textColor = {textColor}
        fontType = {Fontype}
        textInfo = {textInfo}
        selectedCampaigns= {selectedCampaigns}
      />
    );

    shadow.appendChild(shadowRoot);
    injectStyle(shadowRoot);
    hydrateRoot(shadowRoot, component);

    container.appendChild(element);
  } catch (error) {
    console.warn("Widget initialization failed:", error);
  }
}

function injectStyle(shadowRoot: HTMLElement) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/gh/hilary3211/cjnjs/widget.css";
  shadowRoot.appendChild(link);
}

function getWidgetAttributes(): [string, string, string, string, string, string, string, Array<number>] {
  const script = Array.from(document.scripts).find((s) =>
    s.src.includes("/widget.js")
  ) as HTMLScriptElement;

  if (script) {
    const data = script.getAttribute("data-config");
    if (data) {
      try {
        const obj = JSON.parse(atob(data));
        return [
          obj.Address || "",
          obj.donationTarget || "",
          obj.buttonColor || "",
          obj.Asset || "",
          obj.textColor || "",
          obj.fontType || "",
          obj.textInfo || "",
          obj.selectedCampaigns || [],
        ];
      } catch (e) {
        console.warn("Config parse error", e);
      }
    }
  }

  return ["", "", "", "", "", "", "",[]];
}

initializeWidget();

window.initDonationWidget = mountWidget;
