import { useState, useEffect, Component  } from "react"
import { deleteInvDB, addToInventory, getInventory, getInvInfo} from "../firebaseDnDFlavor"
import '../css/style.css';


export default function Inventory(){
    // castTime, range, components, duration, description
    const [newItem, setNewItem] = useState({
        name : "",
        quantity : "",
    });
    const [invs, setInvs] = useState([])
    
    const onChange = (e) => {
        setNewItem((prev) => {
            let helper = {...prev};
            helper[`${e.target.id}`] = e.target.value;
            return helper;
        });
    };

    //need to update to handle other inputs
    useEffect(() => {
        
        const getInvData = async () =>{
            //get all InvIDs in database
            const invIDs = await getInventory(localStorage.getItem('currentUid'), localStorage.getItem('curID'))
            console.log("l5 + " + invIDs[0])

            //trim array of inv ids to only include ones that are not zero
            const newData = invIDs.filter((data) => data != 0)

            //make empty array of same length to store all the Invs
            const invCollections = [newData.length];
            console.log("l22 Invs total" + newData.length)

            //loop through inv ids and get all particular inv info, store in inv collections
            for(let i = 0; i < newData.length; i++){
                invCollections[i] = await getInvInfo(localStorage.getItem('currentUid'), localStorage.getItem('curID'), newData[i])
                console.log("l27 Inv " + i + " has id of " + invCollections[i].id)
            }

            //map database Invs into current Invs so they will be displayed to user
            if(newData.length != 0){
                setInvs(invCollections.map((currentInvs) => ({...currentInvs})))
            }
        }
        getInvData()

        
    }, [])

    //need to update to handle other inputs-> Done!
    useEffect(() =>{
        invs.map(async inv =>{ 
                await addToInventory(localStorage.getItem('currentUid'), localStorage.getItem('curID'), inv.id, inv.name, inv.quantity)
                console.log("new item, id is " + inv.id)
            })
    }, [invs])
    
     //need to add handling for the other components-> Done!
    function handleSubmit(e){
        e.preventDefault()
        
        const createInv = async () => {
            await setInvs(currentInvs => {
                console.log("set Invs function ln 19")
                return [
                    ...currentInvs,
                    {   id: crypto.randomUUID(), 
                        name: newItem.name, 
                        quantity : newItem.quantity,},
                ]
            })
            
        }
        createInv()
        setNewItem("") 
        
    }
        
    // }
    async function deleteInv(id){
        await deleteInvDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), "inv")
        await deleteInvDB(localStorage.getItem('currentUid'), localStorage.getItem('curID'), id)

        setInvs(currentInvs => {
            return currentInvs.filter(inv => inv.id !== id)
        })
        
    }
    function resetInput(){
        const inputs = document.querySelectorAll("input");
        inputs.forEach(element => {
            element.value = "";
            element.placeholder = "";
        });
    }
    
    return <>
    
    <form onSubmit={handleSubmit} className="new-inv-form">
        <div className="form-row">
            <label htmlFor="name"> <img src="../images/itemName.png"></img></label>
            <input 
            value={newItem.name} 
            onChange={onChange} 
            type="text" 
            id="name"
            placeholder= "Rope...">
            </input>
            <label htmlFor="quantity"> <img src="../images/quantity.png"></img></label>
            <input 
            value={newItem.quantity} 
            onChange={onChange}
            type="text" 
            id="quantity"
            placeholder="5000...">
            </input>
        </div>
        <button onClick = {() => resetInput()} className="btn"><img src="../images/addItem.png"></img></button>

    </form>
    <div id="inventory-wrap">
    <h1 className="header" id="inventory-title">Inventory</h1>

    <ul id = "inventory-itemlist">
        {invs.length === 0 && "Click 'Add Item' to start your inventory!"}
        {invs.map(inv =>{
            return <li key = {inv.id}>
            <ul className = "sl-inner">
                <li> Item: {inv.name}</li>
                <li> Quantity: {inv.quantity} </li>
            </ul>
            <button onClick = {() => deleteInv(inv.id)} className="btn" id="il-delete">Delete</button>
            
        </li>
        })}
        
    </ul>
    </div>
  </>

}