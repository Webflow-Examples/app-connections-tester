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
  EDIT: 'EDIT',
  MANAGE: 'MANAGE'
}

const EmptyState: React.FC<EmptyState> = ({ title, body}) => {
  return <div className="emptyState">
    <h2 className="subheading">{title}</h2>
    <p>{body}</p>
  </div>
}

const ManageTab: React.FC = () => {
  const [appConnection, setAppConnection] = useState('');
  const [element, setElement] = useState<AnyElement | null>(null);

  useEffect(() => {
    webflow.subscribe('selectedelement', async (element) => {
      setElement(element);

      if (element && element.appConnections) {
        const appConnections = await element.getAppConnections();
        setAppConnection(appConnections ? appConnections[0] : '');
      } else {
        setAppConnection('');
      }
    });
  }, []);

  const removeAppConnection = async () => {
    if (appConnection && element && element.appConnections) {
      await element.removeAppConnection(appConnection);
      setAppConnection('');
    }
  };

  if (!appConnection) {
    return <EmptyState title="No App Connection found" body="Select an element that has an App connection set."/>
  }

  return <>
    <h2 className="subheading">App Connection value: {appConnection ? `"${appConnection}"` : '🚫'}</h2>
    <p>Component ID</p>
    <p>{element?.id.component}</p>
    <p>Element ID</p>
    <p>{element?.id.element}</p>
    <button type="button" onClick={removeAppConnection}>Remove App Connection</button>
  </>
}

const EditTab: React.FC<EditTab> = ({ appConnection }) => {
  const [resource, setResource] = useState<FullElementId | null>(null);

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
    return <EmptyState title="Missing Current App Connection" body="Try launching the App from the element settings panel in the Designer."/>
  }

  return <>
    <h2 className="subheading">Current App Connection: "{appConnection}"</h2>
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
      await webflow.setSelectedElement(el);

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
        {id: Tab.EDIT, displayName: 'Current App Connection', onClick: () => goToTab(Tab.EDIT), isActive: currentTab === Tab.EDIT},
        {id: Tab.MANAGE, displayName: 'View App Connection', onClick: () => goToTab(Tab.MANAGE), isActive: currentTab === Tab.MANAGE}
      ]}/>
      <div className="pageContainer">
        {currentTab === Tab.HOME && (
          <>
          <p>Click button to create element of specified type and apply an App Connection</p>
          <div className="flex flex-row gap-1">
            <button onClick={() => addAppConnection(webflow.elementPresets.FormForm)}>Form</button>
            <button onClick={() => addAppConnection(webflow.elementPresets.Image)}>Image</button>
          </div>
          </>
        )}
        {currentTab === Tab.EDIT && (
          <EditTab appConnection={currentAppConnection}/>
        )}
        {currentTab === Tab.MANAGE && (
          <ManageTab />
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
