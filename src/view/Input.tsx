import React from "react"

export const Input: React.VFC<{ label: string; name: string} > = ({ label, name }) => {
  return <div className="inputWithLabel">
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} />
  </div>
}
