const addbtn = document.getElementById("addbtn");
const notes = document.querySelectorAll(".notes");
const navbtn = document.querySelector(".nav-link");
const searchBox = document.querySelector("#searchBox");
const delNotesArr = [];
const updateLS = () => {
    const textArea = document.querySelectorAll(".textArea");
    const notes = [];
    textArea.forEach((note) => {
        return notes.push(note.value);
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}

//inserting in trash page when deleted

const addNewNote = (event, mytext = '') => {
    const note = document.createElement("div");
    note.classList.add("note");
    const html = `
    <div class="main">
     <textarea name="textArea" class="textArea ${mytext ? "hidden" : ""}" ></textarea>
      <div class="textBox ${mytext ? "" : "hidden"}" ></div> 
    </div>
    
    <div class="operations">
      <i class="fa-solid fa-pen-to-square edit"></i>
       <i class="fa-solid fa-trash delbtn"></i>
    </div>`;
    note.insertAdjacentHTML("afterbegin", html);
    // notes.appendChild(html);
    const editbtn = note.querySelector(".edit");
    const delbtn = note.querySelector(".delbtn");
    const textbox = note.querySelector(".textBox");
    const textArea = note.querySelector(".textArea");
    textbox.innerText = mytext;
    textArea.value = mytext;


    delbtn.addEventListener('click', () => {

        const ele = textbox.innerText;

        const data = localStorage.getItem("delNotes");
        if (data) {
            let notesArr = JSON.parse(data);
            notesArr.push(ele);
            localStorage.setItem("delNotes", JSON.stringify(notesArr));
        }
        else {
            delNotesArr.push(ele);
            localStorage.setItem("delNotes", JSON.stringify(delNotesArr));
        }

        note.remove();
        updateLS();
        savenotes();
    })
    editbtn.addEventListener("click", () => {
        textbox.classList.toggle("hidden");
        textArea.classList.toggle("hidden");
    })
    textArea.addEventListener("change", (event) => {
        textbox.innerText = event.target.value;
        updateLS();
        savenotes();
    })
    document.body.childNodes[3].children[1].appendChild(note);
    savenotes();
};

const loadNotes = () => {
    const data = localStorage.getItem("notes");

    if (data) {
        const notes = JSON.parse(data);
        notes.forEach((note) => {
            return addNewNote("", note);

        });
    }

}
const getNotes = async () => {

}

const saveNotes = async () => {
    const data = localStorage.getItem("notes");
    const notes = JSON.parse(data);

}

const getDBNotes = async () => {
    try {
        const req = await fetch("/api/v1/notes", {
            method: "GET"
        });
        const data = await req.json();
        localStorage.setItem("notes", JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}
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
                'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(patchData)
        });
    }
    catch (err) {
    console.log(err);
    }
}
loadNotes();

addbtn.addEventListener("click", addNewNote);
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
logOut.addEventListener("click", ()=>{
    savenotes();
    localStorage.removeItem("notes");
    localStorage.removeItem("delNotes");
});