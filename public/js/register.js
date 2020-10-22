let born_date = document.querySelector('#born_date');
born_date.min = new Date().toISOString().split("T")[0].replace(`${new Date().getFullYear()}`, `${new Date().getFullYear() - 120}`);
born_date.max = new Date().toISOString().split("T")[0];


async function tamer_existence_check(login_email){
  try {
      const data = {login_email: login_email};
      const options = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      } 
      const response = await fetch('/tamer/register/existencecheck', options);
      const exam = await response.json();
      return exam.response;
  } catch (error) {
      console.error(error);
  }
}

document.querySelector('#formCadastro').addEventListener('focusin', async (e) => {
    document.querySelector('#language').value = localStorage.getItem('language');
    form_check(e);
});

document.querySelector('#formCadastro').addEventListener('focusout', async (e) => {
    form_check(e);
});

document.querySelector('#formCadastro').addEventListener('input', async (e) => {
    form_check(e);
});

async function form_check(e){
    let firstname = document.querySelector('#firstname'),
        lastname = document.querySelector('#lastname'),
        login = document.querySelector('#login'),
        born_date = document.querySelector('#born_date'),
        pw = document.querySelector('#pw'),
        repw = document.querySelector('#repw'),
        email = document.querySelector('#email'),
        reemail = document.querySelector('#reemail');

    let general_filter = /[^a-z|0-9|@|-|_|一-龠|ぁ-ゔ|ァ-ヴー|ａ-ｚＡ-Ｚ|々〆〤|.]/giu,
        actual_date = new Date();

    firstname.value = firstname.value.replace(/\s/g, '');
    if(firstname.value.length > 0){
            form_field_message(firstname, true);
    }else{
        let message = language.form_field.messages.fill_first_name;
        form_field_message(firstname, false, message);
    }

    lastname.value = lastname.value.replace(/\s/g, '');
    if(lastname.value.length > 0){
        form_field_message(lastname, true);
    }else{
        let message = language.form_field.messages.fill_last_name;
        form_field_message(lastname, false, message);
    }
    
    if(login.value.length > 0 && e.target.id == 'login'){
        login.value = login.value.replace(general_filter,'');
        if(login.value.length > 20){
            login.value = login.value.slice(0,20);
        }
        if(login.value.length > 2){
            let existence;
            existence = await tamer_existence_check(login.value);
            if(existence){
                let message = language.form_field.messages.login_in_use;
                form_field_message(login, false, message);
            }else{
                form_field_message(login, true);
            }
        }else{
            let message = language.form_field.messages.login_out_range;
            form_field_message(login, false, message);
        }
    } 

    if(born_date.value){
        if(new Date(Date.parse(born_date.value)) < actual_date){
            form_field_message(born_date, true);
        }else{
            let message = language.form_field.messages.born_first;
            form_field_message(born_date, false, message);
        }
    }

    if(pw.value.length > 0){
        if(pw.value.length > 7){
            form_field_message(pw, true);
        }else{
            let message = language.form_field.messages.pw_out_range;
            form_field_message(pw, false, message);
        }
    } 

    if(repw.value.length > 0 && pw.value.length > 7){
        if(repw.value == pw.value){
            form_field_message(repw, true);
        }else{
            let message = language.form_field.messages.pw_no_match;
            form_field_message(repw, false, message);
        }
    } 

    if(email.value.length > 0 && e.target.id == 'email'){
        let email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if((email_reg.test(email.value)) && e.target.id == 'email'){
            let existence = await tamer_existence_check(email.value);
            if(existence){
                let message = language.form_field.messages.email_in_use;
                form_field_message(email, false, message);
            }else{
                form_field_message(email, true);
            }
        }else{
            let message = language.form_field.messages.email_invalid;
            form_field_message(email, false, message);
        }
    } 

    if(reemail.value.length > 0 && email.value.length > 0){
        if(reemail.value == email.value){
            form_field_message(reemail, true);
        }else{
            let message = language.form_field.messages.email_no_match;
            form_field_message(reemail, false, message);
        }
    } 

    button_liberation();
}

function form_field_message(element, valid, message = ''){
    let check = element.parentElement.children[1];
    if(valid){
        check.className = 'fas fa-check fa-lg';
        check.style.color = 'green';
    }else{
        check.className = 'fas fa-times fa-lg';
        check.style.color = 'red';
    }
    check.title = message;
    element.title = message;
}

function button_liberation(){
    let check = document.querySelectorAll('.form-field-wrapper > i');
    let submit = document.querySelector('#submit');
    for(let i = 0; i < check.length; i++){
        if(!check[i].classList.contains('fa-check')){
            submit.disabled = true;
            return;
        }
    }
    submit.disabled = false;
}