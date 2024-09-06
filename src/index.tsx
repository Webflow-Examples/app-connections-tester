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

interface EmptyState {
  title: string;
  body: string;
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

const EmptyState: React.FC<EmptyState> = ({ title, body}) => {
  return <div className="emptyState">
    <h2 className="subheading">{title}</h2>
    <p>{body}</p>
  </div>
}

const EditTab: React.FC<EditTab> = ({ appConnection }) => {
  const [resource, setResource] = useState({});

  useEffect(() => {
    async function fetchAppResource() {
      if (appConnection === '') {
        return;
      }

      const res = await webflow.getCurrentAppConnectionResource();
      if (res && res.type === 'Element') {
        setResource(res.value.id);
      }
    }

    void fetchAppResource();
  }, [appConnection])

  if (appConnection === '') {
    return <EmptyState title="Missing Appp Connection" body="Try launching app from Element Panel."/>
  }

  return <>
    <h2 className="subheading">{appConnection}</h2>
    <p>Component ID</p>
    <p>{resource?.component}</p>
    <p>Element ID</p>
    <p>{resource?.element}</p>
  </>
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(Tab.HOME);
  const [currentAppConnection, setCurrentAppConnection] = useState('');

  useEffect(() => {
    async function retrieveAppConnections() {
      const appConnections = await webflow.getCurrentAppConnection();
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
        await webflow.notify({ type: "Error", message: "App Connections not supported" });
        return;
      }
      await el.setAppConnection(type == webflow.elementPresets.Image ? 'manageImageElement' : 'manageFormElement');
    } else {
      await webflow.notify({ type: 'Success', message: "Expected an element"})
    }
  }

  return (
    <div>
      <h1 className="heading">App Connections Tester</h1>
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
