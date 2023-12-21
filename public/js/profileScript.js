document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    // const avatarInput = document.getElementById('avatar');
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const profileForm = document.getElementById('profile-form');
    const profile=document.getElementById("profile");
    const heading=document.getElementById("heading");
    //function to save updated data to the database
    const saveData=async()=>{
        try{
            const patchData={
                name:nameInput.value,
                username:usernameInput.value,
                email:emailInput.value
            };
           await fetch("/api/v1/user",{
                method:"PATCH",
                headers:{
              'Content-Type':'application/json',      
                },
                body:JSON.stringify(patchData)
            });
        }
        catch(err)
        {
          console.log(err);
        }
      
    }
    // Enable editing of fields
    editButton.addEventListener('click', () => {
        nameInput.removeAttribute('readonly');
        usernameInput.removeAttribute('readonly');
        emailInput.removeAttribute('readonly');
        // avatarInput.style.display = 'block';
        saveButton.style.display = 'block';
        editButton.style.display = 'none';
    });

    // Handle form submission (save changes)
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Send data to the server for updating user profile
        saveData();
        // After successful update, disable editing and show the edit button again
        nameInput.setAttribute('readonly', true);
        usernameInput.setAttribute('readonly', true);
        emailInput.setAttribute('readonly', true);
        // avatarInput.style.display = 'none';
        saveButton.style.display = 'none';
        editButton.style.display = 'block';
        heading.innerText=nameInput.value;
    });
    const loadData=async()=>{
        try{
             const data=await fetch('/api/v1/user',{
                method:"GET"
             })
             const user=await data.json();
              nameInput.value=user.name;
              usernameInput.value=user.username;
              emailInput.value=user.email;
              profile.innerText=user.username;
              heading.innerText=user.name;    
        }
        catch(err)
        { 
              console.log(err);
        }
    }
    loadData();
});
