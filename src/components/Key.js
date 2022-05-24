import { useState } from "react";
import "../styles/Calculator.css";

const Key = ({ label, value, onClick }) => {
  return value === null ? (
    <div />
  ) : (
    <div
      className="key-container"
      onClick={(e) => {
        onClick(label, value);
      }}
    >
      <p className="">{label}</p>
    </div>
  );
};
export default Key;
