async function fetchData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;// Return the data to be used outside the function
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error; // Rethrow the error to be handled outside the function
    }
}



function renderTable(data) {//data
    // const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];//getElementsByTagName => returns a htmlCollection, so have to use [0]th elem
    const tableBody = document.getElementById('t-body');
    tableBody.innerHTML = ''; // Clear any existing rows
    //Inserting Data in tables

    //Method - 1
    data.forEach(item => {//name,id,image,symbol, current_price,total_volume 
        const row = tableBody.insertRow();
        const imgCell = row.insertCell(0);
        const divElem = document.createElement('div');
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.className = "image"
        // imgCell.appendChild(img);
        const para = document.createElement('p');
        para.append(item.name);
        para.className = "imagePara";
        // imgCell.append(para);
        divElem.className = "divImgPara"
        divElem.append(img);
        divElem.append(para);
        imgCell.append(divElem);

        //row 2 to 5
        const col2 = row.insertCell(1);
        col2.textContent = item.symbol.toUpperCase();
        col2.className = "pl-6 pr-5 mediaQuery-2";
        const col3 = row.insertCell(2);
        col3.textContent = "$"+ item.current_price;
        col3.className = " text-right";//pl-5 pr-4
        // row.insertCell(2).textContent =  "$"+ item.current_price;//currentPrice
        const col4 = row.insertCell(3);
        col4.textContent = "$"+  item.total_volume.toLocaleString();
        col4.className = "text-right pr-5 mediaQuery";

        // row.insertCell(3).textContent =  "$"+  item.total_volume.toLocaleString();

        //percentage column => 
        const percentage = row.insertCell(4);
        percentage.className = "text-right pl-3 pr-1 "
        const priceChangeSpan = document.createElement('span');
        priceChangeSpan.innerText = item.price_change_percentage_24h.toFixed(2) + "%";// percentage.textContent = item.price_change_percentage_24h.toFixed(2) + "%"//innerText
        priceChangeSpan.className = item.price_change_percentage_24h > 0  ? "profit" : "loss";
        percentage.append(priceChangeSpan);
        const icon = document.createElement('i');
        icon.className = item.price_change_percentage_24h > 0 ? `fa-solid fa-arrow-trend-up profit` :  `fa-solid fa-arrow-trend-down loss`;
        icon.style.paddingLeft = '6px';
        percentage.append(icon);

        //2nd last you can use anything, just make sure sort by percentage works
        const col5 = row.insertCell(5);
        col5.textContent = "MktCap : $" + item.market_cap.toLocaleString().substring(0);
        col5.className = "text-center mediaQuery"
    });


    //Methodd - 2(Old way - BUT Repetitive work)
    /*data.forEach(item =>{
        const row = document.createElement('tr');
        const col1 = document.createElement('td');
        const img = document.createElement('img');
        img.src = item[i];
        img.alt = item.name;
        img.style.width = '50px';
        col1.append(img);
        col1.append(item.name);
        const col2 = document.createElement('td');
        col2.append(item.id.toUpperCase());
        const col3 = document.createElement('td');
        col3.append(item.symbol);
        const col4 = document.createElement('td');
        col4.append(item.current_price);
        const col5 = document.createElement('td');
        col5.append(item.total_volume);
        row.append(col1);
        row.append(col2);
        row.append(col3);
        row.append(col4);
        tableBody.append(row);
    });*/

}
let dataForBody = [{}];
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
        .then(data => {
            dataForBody = data;
            renderTable(data); //dataForBody = data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});    







//Filtering of Data
const inputElem = document.getElementById('input');
inputElem.addEventListener('input', handleSearchInput);
function handleSearchInput(event){
    const val =  event.target.value;
    // event.dataTransfer.setData("text", val); // ye bhi kar sakte h event mei
     localStorage.setItem('valueOfSearch', val);
     const word = val.trim().toLowerCase();
     if(word === '') renderTable(dataForBody);//render the table with originalData, reFilter i.e. reset the original table
     else filterData();   
 }
 
 function filterData(){
 const searchedWord = localStorage.getItem('valueOfSearch');
 const word = searchedWord.trim().toLowerCase();
 const newData = [];
 console.log("filtering tak ghuse");
 for (let i = 0; i < dataForBody.length; i++) {//here we need to filter on basis of name or Symbol
     const name = dataForBody[i].name.trim().toLowerCase();
     const symbol = dataForBody[i].symbol.trim().toLowerCase();
     if(name.includes(word) || symbol.includes(word)) {//if either or name or symbol includes word matches,  means we need that obj
         newData.push(dataForBody[i]); //Add data to array
     }
 }
    renderTable(newData);
}




//Sorting of Data
const buttonsElem = document.getElementsByClassName('btns');
for (let i = 0; i < buttonsElem.length; i++) {//here we need to filter on basis of name or Symbol
    buttonsElem[i].addEventListener('click', () => sortData(buttonsElem[i]));
}

function sortData(btn){
    const clickedBtn = btn.innerText;
    const newData = [];
    dataForBody.forEach(item => newData.push(item));//store the copied data and later on, sort copiedArr only not original

    if(clickedBtn.includes("Percentage")){//sort by percentage Change
        newData.sort((a, b) => {
           return  Math.abs(a.price_change_percentage_24h) - Math.abs(b.price_change_percentage_24h);//ascending order
        }); 
        console.log(newData);
    }else{
        newData.sort((a, b) => {//sort by marketCap
            return a.market_cap - b.market_cap;//ascending order  ,   return a.market_cap_rank - b.market_cap_rank;
        });
        console.log(newData);
    }
    renderTable(newData);
}
