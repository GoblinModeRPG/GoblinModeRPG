import { useState, useEffect, Component  } from "react";
import { deleteSpellDB, addToSpells, getSpells, getSpellInfo, updatePrep} from "../firebaseDnDFlavor";
import '../css/style.css';
import 'boxicons'

export default function SpellBook(){
    // castTime, range, components, duration, description
    const [newItem, setNewItem] = useState({
        title : "",
        castTime : "",
        range: "",
        components: "",
        duration: "",
        description: "",
        prepared: true,

    });
    const [spells, setSpells] = useState([])
    //const [isChecked, setIsChecked] = useState(true)

    const checkHandler = (e) => {
        //(spellID)
        console.log("is checked is " + !(e.target.checked));
        //setIsChecked(!(e.target.checked));
        updateDatabase(e.target.value, e.target.checked);
        
        //console.log("spell id is " + e.target.value);
        
    };
    
    
    const onChange = (e) => {
        setNewItem((prev) => {
            let helper = {...prev};
            helper[`${e.target.id}`] = e.target.value;
            console.log("set new item is happening");
            return helper;
        });
    };

    //need to update to handle other inputs
    useEffect(() => {
        const getSpellData = async () =>{
            //get all spellIDs in database
            const spellIDs = await getSpells(localStorage.getItem('currentUid'), localStorage.getItem('curID'))
            //console.log("l5 + " + spellIDs[0])

            //trim array of spell ids to only include ones that are not zero
            const newData = spellIDs.filter((data) => data != 0)

            //make empty array of same length to store all the spells
            const spellCollections = [newData.length];
            //console.log("l22 spells total" + newData.length)

            //loop through spell ids and get all particular spell info, store in spell collections
            for(let i = 0; i < newData.length; i++){
                spellCollections[i] = await getSpellInfo(localStorage.getItem('currentUid'), localStorage.getItem('curID'), newData[i])
                //console.log("l27 spell " + i + " has id of " + spellCollections[i].id)
            }

            //map database spells into current spells so they will be displayed to user
            if(newData.length != 0){
                setSpells(spellCollections.map((currentSpells) => ({...currentSpells})))
            }
        }
        getSpellData()

        
    }, [])

    //need to update to handle other inputs-> Done!
    useEffect(() =>{
        
        spells.map(async spell =>{ 
                console.log("l61: spell.prepared is " + spell.prepared);
                console.log("163: title is " + spell.title);
                //console.log("is checked " + isChecked);
                await addToSpells(localStorage.getItem('currentUid'), localStorage.getItem('curID'), spell.id, spell.title, spell.castTime, spell.range,spell.components, spell.duration, spell.description, spell.prepared)
                console.log("new item, id is " + spell.id)
            })
    }, [spells])
    
     //need to add handling for the other components-> Done!
    function handleSubmit(e){
        e.preventDefault()
        
        const createSpell = async () => {
            await setSpells(currentSpells => {
                console.log("set spells function ln 19")
                return [
                    ...currentSpells,
                    {   id: crypto.randomUUID(), 
                        title: newItem.title, 
                        castTime : newItem.castTime,
                        range: newItem.range,
                        components: newItem.components,
                        duration: newItem.duration,
                        description: newItem.description,
                        prepared: true},
                ]
            })
            
        }
        createSpell()
        setNewItem("") 
        
    }
        
    // }
    async function deleteSpell(id){
        await deleteSpellDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), "spell")
        await deleteSpellDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), id)

        setSpells(currentSpells => {
            return currentSpells.filter(spell => spell.id !== id)
        })
        
    }
    function resetInput(){
        const inputs = document.querySelectorAll("input");
        inputs.forEach(element => {
            element.value = "";
            element.placeholder = "";
        });
    }
    async function collapseform(){
        var spellForm = document.getElementById("spellForm");
        spellForm.classList.toggle('expand');
    }
    
    async function updateDatabase(id, prepped){
        var  curSpell = await getSpellInfo(localStorage.getItem('currentUid'), localStorage.getItem('curID'), id);
        //console.log("cur spell prep " + curSpell.prepared)
        await addToSpells(localStorage.getItem('currentUid'), localStorage.getItem('curID'), id, curSpell.title, curSpell.castTime, curSpell.range, curSpell.components, curSpell.duration, curSpell.description, !(curSpell.prepared));
    }
    
    return <>
    
    <form onSubmit={handleSubmit} className="new-spell-form" id="spellForm">
        <div className="form-row">
            <label htmlFor="title"> Spell Name</label>
            <input 
            value={newItem.title} 
            onChange={onChange} 
            type="text" 
            id="title"
            placeholder= "Summon Goblin Horde...">
            </input>
            <label htmlFor="castTime"> Cast Time</label>
            <input 
            value={newItem.castTime} 
            onChange={onChange}
            type="text" 
            id="castTime"
            placeholder="50 hours...">
            </input>
            <label htmlFor="range"> Range</label>
            <input 
            value={newItem.range} 
            onChange={onChange}
            type="text" 
            id="range"
            placeholder="100 miles...">
            </input>
            <label htmlFor="components"> Components</label>
            <input 
            value={newItem.components} 
            onChange={onChange}
            type="text" 
            id="components"
            placeholder="Blood of your enemies...">
            </input>
            <label htmlFor="duration"> Duration</label>
            <input 
            value={newItem.duration} 
            onChange={onChange}
            type="text" 
            id="duration"
            placeholder="forever...">
            </input>
            <label htmlFor="description"> Description</label>
            <input 
            value={newItem.description} 
            onChange={onChange}
            type="text" 
            id="description"
            placeholder="summon your friendly horde of Goblins to eat your enemies...">
            </input>
            

        </div>
        <button id = "addspell-btn" onClick = {() => resetInput()} className="btn"><img src="../images/addSpell.png"></img></button>
    </form>
    <button onClick = {() => collapseform()} id="collapsebtn" className="btn"><box-icon name='collapse-vertical' type = 'regular' color = '#fbf2e3'></box-icon></button>
    <div id="spell-wrap"> 
        <h1 id ="sl-header" className="header">Spell List</h1>

        <ul id="spelllist">
            {spells.length === 0 && "No Spells"}
            {spells.map(spell =>{
                return <li key = {spell.id}>
                <ul className = "sl-inner">
                    <li> Title: {spell.title}</li>
                    <li> Cast Time: {spell.castTime} </li>
                    <li> Range: {spell.range} </li>
                    <li> Components: {spell.components} </li>
                    <li> Duration: {spell.duration} </li>
                    <li> Description: {spell.description}</li>
                    <li id = "checkbox-slli">
                        <label htmlFor="prepared"> Prepared </label>
                        <input
                            id = "prepared"
                            type = "checkbox"
                            checked = {spell.prepared}
                            onChange = {checkHandler}
                            value={spell.id}
                           >
                        </input>                    
                    </li>
                </ul>
                
                <button onClick = {() => deleteSpell(spell.id)} id = "sl-delete" className="btn">Delete</button>
                
            </li>
            })}
            
        </ul>
    </div>
    
  </>

}