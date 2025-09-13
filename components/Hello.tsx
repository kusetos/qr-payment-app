import React from "react";

type HelloProps = {
  name: string;
};

export default function Hello({ name }: HelloProps) {
  return <h2 className="text-blue-600">Hello, {name}! 👋</h2>;
}
