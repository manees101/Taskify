const delNotes = document.querySelector(".delNotes");
const delAll = document.querySelector("#delAll");
const searchBox = document.querySelector("#searchBox");
//Updating local Storage when a note hase been deleted
const updateLS = () => {
    const textBox = document.querySelectorAll(".textBox");
    const notes = [];
    textBox.forEach((note) => {
        return notes.push(note.innerText);
    });
    localStorage.setItem("delNotes", JSON.stringify(notes));
}
//function to restore notes from trash
const restoreNotes = (value) => {
    const data = localStorage.getItem("notes");
    const delData = localStorage.getItem("delNotes");
    const delnotes = JSON.parse(delData);
    const idx = delnotes.indexOf(value);
    delnotes.splice(idx, 1);
    localStorage.setItem("delNotes", JSON.stringify(delnotes));
    if (data) {
        const notesArr = JSON.parse(data);
        notesArr.push(value);
        localStorage.setItem("notes", JSON.stringify(notesArr));
    }
    else {
        notesArr = [];
        notesArr.push(value);
        localStorage.setItem("notes", JSON.stringify(notesArr));
    }
    savenotes()
};
//function to add new note to the app

const addNewNote = (event, mytext = '') => {
    const note = document.createElement("div");
    note.classList.add("note");
    const html = `
    <div class="main">
     <textarea name="textArea" class="textArea" ></textarea>
      <div class="textBox" ></div> 
    </div>
    
    <div class="operations">
    <i class="fa-solid fa-rotate-left restore"></i>
       <i class="fa-solid fa-trash delbtn"></i>
    </div>`;
    note.insertAdjacentHTML("afterbegin", html);
    // notes.appendChild(html);
    const restorebtn = note.querySelector(".restore");
    const delbtn = note.querySelector(".delbtn");
    const textbox = note.querySelector(".textBox");
    textbox.innerText = mytext;

    delbtn.addEventListener('click', () => {
        note.remove();
        updateLS();
        savenotes()
    })
    restorebtn.addEventListener("click", () => {
        restoreNotes(textbox.innerText);
        note.remove();
        savenotes()
    })
    document.body.childNodes[3].children[1].appendChild(note);

};
const loadNotes = () => {
    const data = localStorage.getItem("delNotes");
    if (data) {
        const notes = JSON.parse(data);
        notes.forEach((note) => {
            return addNewNote("", note);

        })

    }



};
//deleting all trash notes from localStorage
delAll.addEventListener("click", async () => {
   
    localStorage.removeItem("delNotes");
    await savenotes()
    location.reload();
});

//saving notes data from local Storage to DB
const savenotes = async () => {
    try {
        const notes = localStorage.getItem("notes");
        const delnotes = localStorage.getItem("delNotes");
        var notesArr;
        var trash;
        if (notes) {
            notesArr = JSON.parse(notes);

        }
        else {
            notesArr = [];
        }
        if (delnotes) {
            trash = JSON.parse(delnotes);

        }
        else {
            trash = [];
        }
        const patchData = {
            notesArr: notesArr,
            trashNotes: trash
        }
        const req = await fetch("/api/v1/notes", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(patchData)
        });
        
    }
    catch (err) {

    }
}


//Search Function
searchBox.addEventListener('change', () => {
    const value = searchBox.value;
    if (value != "") {
        const notes = document.getElementsByClassName('note');
        for (const note of notes) {
            const data = note.childNodes[1].children[1].innerHTML;
            if (!data.includes(value)) {
                note.classList.add("hidden");
            }
        }
    }
    else {
        location.reload();
    }
})
const logOut = document.getElementById("logout");
//saving notes to DB upon logout
logOut.addEventListener("click",async()=>{
    await savenotes()
    localStorage.removeItem("notes");
    localStorage.removeItem("delNotes");
});

loadNotes();