// Variables
    let index = 0;
    let employee = []; 
   

// Ajax fetch method

    const getUsers = (e) => {

        const url = 'https://randomuser.me/api/?results=12';

        fetch(url)
        .then((response) => {
            if(response.status!== 200){
                console.log(response)
                throw Error("This is not 200 answer");
            }else{
                return response.json();// transformation from json to java script object
            }
        })
        .then(json => showUsers(json.results)) // showUsers call back uses json (which is transformed/ parsed  into javaScript object) as an argument
        .catch(err => console.log(err,"error"))
    }

//adding a search bar dynamiclly //

    const search = document.querySelector('.search-container')
    search.insertAdjacentHTML('beforeend',`
            <form action="#" method="get">
                <input type="search" id="search-input" class="search-input" placeholder="Search...">
                <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
            </form>`
        
    )

// Search add event listener ---> we can search employees through the card-info-container content 

    let names = document.getElementsByClassName("card-info-container");
    const searchInput = document.querySelector('#search-input');

    searchInput.addEventListener('keyup', (e)=>{
        let searchString = searchInput.value.toUpperCase(); 
            for(namE of names){
            
            if(namE.innerHTML.toUpperCase().includes(searchString)){
                namE.parentNode.style.display ="";
                
            }else{
                namE.parentNode.style.display ="none";
              
            }
        }      
    });

// this function displays users in the gallery and it creates an array from which we will take data for modal window later; 

    const showUsers = (users) =>{
        const resultArea = document.querySelector('#gallery');
        resultArea.textContent="";

        users.forEach( user => {
            const item = document.createElement('div');
            item.className = 'card click';
            item.setAttribute("data-index",index)
            // I had to add data-index attribute to all of this lines, I dont know how to set the click only on item - div not on paragraphs, header,img etc...
            item.innerHTML = `
            <div class="click card-img-container" data-index="${index}">
                <img class="click card-img" data-index="${index}" src=${user.picture.large}>
            </div>
            <div class="click card-info-container" data-index="${index}">
                <h4 class="click" data-index="${index}">${user.name.first} ${user.name.last}</h4>
                <p class="click" data-index="${index}">${user.email}</p>
                <p class="click" data-index="${index}">${user.location.city}</p>
            </div>
            
            `;

            let person = [user.picture.large, user.name.first, user.name.last, user.email, user.location.city, user.phone, user.location.street, user.location.state, user.location.postcode, user.dob.date.slice(0,10) ]
            employee.push(person); 
            resultArea.appendChild(item);
            index++; // it will help me later to get index value from employee array
        
        })
        
    }

/* Bug line 101---> it doesn´t want to read user.lacation.street, I dont know why and I was trying diffrent things /
 I will use this function to switch user using the next and prev button */  

    const modalInnerHtml = (modal,index0) =>{

        modal.innerHTML = `
            
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong class="close">X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee[index0][0]}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee[index0][1]} ${employee[index0][2]} </h3>
                <p class="modal-text">${employee[index0][3]}</p>
                <p class="modal-text cap">${employee[index0][4]}</p>
                <hr>
                <p class="modal-text">${employee[index0][5]}</p>
                <p class="modal-text">${employee[index0][6]}, ${employee[index0][7]}, ${employee[index0][8]}</p>
                <p class="modal-text">Birthday: ${employee[index0][9]}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" data-index="${index0}" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" data-index="${index0}" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `

    }

// this function displays modal window and uses callback of modalInnerHtml function 

    const displayEmployee = (index0)=>{
        const modal = document.createElement('div');
        modal.className="modal-container";
        modal.style.zIndex="2000"; 
        document.querySelector('body').appendChild(modal);
        modalInnerHtml(modal,index0);
    }              

/* this function displays modal window, it obtains data from employee array, thanks to this function we can close the modal window and
press the next and prev button */

    const showModal = () =>{

        document.querySelector('.gallery').addEventListener('click', e =>{
    
            let target = e.target;

            // displaying modal window here

            if(target.className.includes("click") ){
                let index1 = target.getAttribute('data-index');
                displayEmployee(index1);
            }

            let modal = document.querySelector('.modal-container');


            // add event listener on whole modal window 

            modal.addEventListener('click',(e)=>{

                let target = e.target;
                console.log(target)

                // the next button 
                if(target.id==="modal-next"){
                    let modal = document.querySelector('.modal-container');
                    let index1 = parseInt(target.getAttribute('data-index'));
                    index1++;
                    if(index1>11){
                        index1 = 0; 
                    }
                    modalInnerHtml(modal,index1);

                // the prev button
                }else if(target.id==="modal-prev"){
                    let modal = document.querySelector('.modal-container');
                    let index1 = parseInt(target.getAttribute('data-index'));
                        
                    index1--; 
                    
                    if(index1<0){
                        index1 = 11; 
                    }
                    modalInnerHtml(modal,index1);

                //closing the modal window

                }else if(target.className==="modal-close-btn"||target.className==="close"){
                    document.querySelector(".modal-container").remove()
                }
            })
        }
    )};

// We can call the main functions here :

showModal();
getUsers(); 



