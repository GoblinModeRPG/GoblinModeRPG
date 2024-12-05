import React from 'react'
import {createRoot} from 'react-dom/client'
import Inventory from './groupHomeDisplays/inventory.jsx'

const inventoryDomNode = document.getElementById('inventory');
const inventoryRoot = createRoot(inventoryDomNode); 
inventoryRoot.render(<Inventory />);

