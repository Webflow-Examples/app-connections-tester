import React from "react";

interface TabItem {
  id: string;
  displayName: string;
  onClick: () => void;
  isActive: boolean;
}

interface Tabs {
  tabItems: Array<TabItem>;
}

const Tabs: React.FC<Tabs> = ({ tabItems }) => {
  return (
    <div className="tabContainer">
      {tabItems.map((tabItem) => (
        <button
          key={tabItem.id}
          onClick={tabItem.onClick}
          className={`tab${tabItem.isActive ? " tab--active" : ""}`}
        >
          {tabItem.displayName}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
