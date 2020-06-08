function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]");

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( (res) => { return res.json() })
    .then( states => {
        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs();

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;

    fetch(url)
    .then( (res) => { return res.json() })
    .then( cities => {
        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false;
    })
}

document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

//Tratamento dos itens de coleta    
const itemsToCollect = document.querySelectorAll(".items-grid li");

for(const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");
let selectedItems = [];

function handleSelectedItem(event){
    const itemLi = event.target;

    //Add or remove a class using javascript
    itemLi.classList.toggle("selected");

    const itemId = itemLi.dataset.id;

    //Verificar se existem itens selecionados.
    //Em caso positivo, obtê-los
    const alreadySelected = selectedItems.findIndex( (item) => {
        const itemFound = item == itemId;
        return itemFound;
    })

    //Caso o item já esteja selecionado, remover a seleção
    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter( item => {
            const itemDifferent = item != itemId;
            return itemDifferent;
        });

        selectedItems = filteredItems;
    } else {
        //Caso não o item não esteja selecionado, atualizar a seleção
        selectedItems.push(itemId);
    }

    //Atualizar o campo oculto com os itens selecionados
    collectedItems.value = selectedItems;    
}