import React from 'react'
import {createRoot} from 'react-dom/client'
import SpellBook from './groupHomeDisplays/spellbook.jsx'

const spellDomNode = document.getElementById('spellbook');
const spellRoot = createRoot(spellDomNode); 
spellRoot.render(<SpellBook />);