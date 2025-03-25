import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from './App';


// Find the element where the UI should be placed.
const main: HTMLElement | null = document.getElementById('main');
if (main === null)
  throw new Error("HTML missing 'main' element")

// Display the UI in that element
const root: Root = createRoot(main);
root.render(<App/>);
