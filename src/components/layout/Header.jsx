import React from 'react';

export default function Header({ title }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </header>
  );
}
