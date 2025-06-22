import { hydrateRoot } from 'react-dom/client';
import  Widget  from './widget/components/Widget';
// import './widget/components/style.css';

function initializeWidget() {
  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady);
  }
}

function onReady() {
  try {
    const element = document.createElement('div');
    const shadow = element.attachShadow({ mode: 'open' });
    const shadowRoot = document.createElement('div');
    const referralID = getreferralID();

    shadowRoot.id = 'widget-root';

    const component = (
      <Widget referralID={referralID} />
    );

    shadow.appendChild(shadowRoot);
    injectStyle(shadowRoot);
    hydrateRoot(shadowRoot, component);

    document.body.appendChild(element);
  } catch (error) {
    console.warn('Widget initialization failed:', error);
  }
}

function injectStyle(shadowRoot: HTMLElement) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/gh/hilary3211/cjnjs/widget.css';
  shadowRoot.appendChild(link);
}


function getreferralID() {
  const script = document.currentScript as HTMLScriptElement;
  const referralID = script?.getAttribute('referralID');
  
  if (!referralID) {
    throw new Error('Missing referralID attribute');
  }
  
  return referralID;
}

initializeWidget();
