const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

password.addEventListener("change", async () => {
    try {

        const req = await fetch(`/notes?username=${username.value}&password=${password.value}`, {
            method: "GET"
        });
        const data = await req.json();
        localStorage.setItem("notes", JSON.stringify(data.notes));
        localStorage.setItem("delNotes", JSON.stringify(data.trash));

        console.log(data);
    } catch (err) {
        console.log(err);
    }
});


