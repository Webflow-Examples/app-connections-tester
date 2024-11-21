import React from "react";

interface EmptyState {
  title: string;
  body: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyState> = ({ title, body, children }) => {
  return (
    <div className="emptyState">
      <h2 className="subheading">{title}</h2>
      <p>{body}</p>
      {children}
    </div>
  );
};

export default EmptyState;
