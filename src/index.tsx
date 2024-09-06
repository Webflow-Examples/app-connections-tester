import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

interface TabItem {
  id: string;
  displayName: string;
  onClick: () => void;
  isActive: boolean;
}

interface Tabs {
  tabItems: Array<TabItem>;
}

interface EditTab {
  appConnection: string;
}

const Tabs: React.FC<Tabs> = ({ tabItems }) => {
  return <div className="tabContainer">
    {tabItems.map((tabItem) => <button key={tabItem.id} onClick={tabItem.onClick} className={`tab${tabItem.isActive ? ' tab--active' : ''}`}>{tabItem.displayName}</button>)}
  </div>
}

const Tab = {
  HOME: 'HOME',
  EDIT: 'EDIT'
}

const EditTab: React.FC<EditTab> = ({ appConnection }) => {
  const [resource, setResource] = useState('');

  useEffect(() => {
    async function fetchAppResource() {
      if (appConnection === '') {
        return;
      }

      const res = await webflow.getCurrentAppConnectionResource();
      if (res && res.type === 'Element') {
        console.log("res", res);
        setResource(JSON.stringify(res.value.id));
      }
    }

    void fetchAppResource();
  }, [appConnection])

  if (appConnection === '') {
    return <p>Missing app connection, try launching app from Element Panel</p>
  }

  return <>
    <p>App Connection: {appConnection}</p>
    <p>Id: {resource}</p>
  </>
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(Tab.HOME);
  const [currentAppConnection, setCurrentAppConnection] = useState('');

  useEffect(() => {
    async function retrieveAppConnections() {
      const appConnections = await webflow.getCurrentAppConnection();
      console.log('app connections', appConnections);
      if (['manageImageElement', 'manageFormElement'].includes(appConnections)) {
        setCurrentTab(Tab.EDIT);
        setCurrentAppConnection(appConnections);
      }
    }

    void retrieveAppConnections();
  }, [])

  const goToTab = (tab) => {
    setCurrentTab(tab);
  }

  const addAppConnection = async (type: ElementPreset<AnyElement>) => {
    const root = await webflow.getRootElement();
    if (root && root.children) {
      const el = await root.append(type);
      if (!el || !el.appConnections) {
        throw new Error("App Connections not supported");
      }
      await el.setAppConnection(type == webflow.elementPresets.Image ? 'manageImageElement' : 'manageFormElement');
    } else {
      throw new Error("Expected an element.")
    }
  }

  return (
    <div>
      <h1>App Connections Tester</h1>
      <Tabs tabItems={[
        {id: Tab.HOME, displayName: 'Create Elements', onClick: () => goToTab(Tab.HOME), isActive: currentTab === Tab.HOME},
        {id: Tab.EDIT, displayName: 'Edit Elements', onClick: () => goToTab(Tab.EDIT), isActive: currentTab === Tab.EDIT}
      ]}/>
      <div className="pageContainer">
        {currentTab === Tab.HOME && (
          <>
          <p>Click button to create element of specified type and apply an app connection</p>
          <div className="flex flex-row gap-1">
            <button onClick={() => addAppConnection(webflow.elementPresets.FormForm)}>Form</button>
            <button onClick={() => addAppConnection(webflow.elementPresets.Image)}>Image</button>
          </div>
          </>
        )}
        {currentTab === Tab.EDIT && (
          <EditTab appConnection={currentAppConnection}/>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
