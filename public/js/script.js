const links = document.getElementsByClassName('links');

// To convert links object to a valid array I used Array.from()
Array.from(links).map((link) => {
    // Highlight the current link
    if (window.location.href == link) { link.classList.add('activeLink'); }
});

// Login Page Form Validation
if ((window.location.href).includes('/login')) {
    const login_btn = document.getElementById('login_btn');
    login_btn.disabled = true;

    const uname = document.getElementById('uname');
    uname.focus();

    const uNameError = document.getElementById('uNameCheckLogin');
    let isValidUserName = false;

    // Event listener on username
    uname.addEventListener('keyup', validateUserName);

    function validateUserName() {
        // if username is a number
        if (!isNaN(this.value)) {
            uNameError.innerText = "Username must be a string";
            uNameError.style.display = "block";
            this.focus();
            isValidUserName = false;
            login_btn.disabled = true;
        }
        else {
            uNameError.style.display = "none";
            isValidUserName = true;
            login_btn.disabled = false;
        }
    }
}
// Add Teacher Form Validation
if ((window.location.href).includes('/addTeacher')) {
    const add_teacher_btn = document.getElementById('add_teacher_btn');

    // Disabled add_teacher_btn until each entries are not valid
    add_teacher_btn.disabled = true;

    const teacher_name = document.getElementById('teacher_name');
    const password_teacher = document.getElementById('password_teacher');
    const password_repeat_teacher = document.getElementById('password_repeat_teacher');

    // Set focus to the first input element 
    teacher_name.focus();

    // Adding event listeners to our singn_up form elements
    teacher_name.addEventListener('keyup', validateUname);
    password_teacher.addEventListener('keyup', validatePassword);
    password_repeat_teacher.addEventListener('keyup', validateRepeatedPassword);

    // Error messages
    const uNameError = document.getElementById('teacher_name_check');
    const uPassError = document.getElementById('uPassCheck');
    const uPassRepeatError = document.getElementById('uPassRepeatCheck');

    // Hide error messages initially
    uNameError.style.display = "none";
    uPassError.style.display = "none";
    uPassRepeatError.style.display = "none";

    let validUName = false;
    let isPasswordMatch = false;
    let isPasswordEntered = false;

    // Functions for event listeners of our form
    function validateUname() {
        // if username is empty
        if (this.value == "") {
            uNameError.innerText = "Username is required";
            uNameError.style.display = "block";
            this.focus();
            validUName = false;
            add_teacher_btn.disabled = true;
        }
        // if username is a number
        else if (!isNaN(this.value)) {
            uNameError.innerText = "Username must be a string";
            uNameError.style.display = "block";
            this.focus();
            validUName = false;
            add_teacher_btn.disabled = true;
        }
        else {
            uNameError.style.display = "none";
            validUName = true;
        }
    }
    function validatePassword() {
        if (this.value == "") {
            uPassError.innerText = "Password is must";
            uPassError.style.display = "block";
            this.focus();
            isPasswordEntered = false;
            add_teacher_btn.disabled = true;
        }
        else {
            isPasswordEntered = true;
            uPassError.style.display = "none";
        }
    }
    function validateRepeatedPassword() {
        if (this.value == "") {
            uPassRepeatError.innerText = "Please re-enter your password";
            uPassRepeatError.style.display = "block";
            this.value = "";
            this.focus();
            isPasswordMatch = false;
            add_teacher_btn.disabled = true;
        }
        else if (this.value !== password_teacher.value) {
            uPassRepeatError.innerText = "Password did not match";
            uPassRepeatError.style.display = "block";
            isPasswordMatch = false;
            add_teacher_btn.disabled = true;
        }
        else {
            uPassRepeatError.style.display = "none";
            isPasswordMatch = true;
        }
    }
    // To check whether all entries are valid or not
    setInterval(() => {
        if (validUName && isPasswordEntered && isPasswordMatch) {
            if (add_teacher_btn.disabled != false) { add_teacher_btn.disabled = false; }
        }
    }, 100);
}
// Add Student Form Validation
if ((window.location.href).includes('/addStudent')) {
    const add_student_btn = document.getElementById('add_student_btn');

    // Disabled add_teacher_btn until each entries are not valid
    add_student_btn.disabled = true;

    const student_name = document.getElementById('student_name');
    const password_student = document.getElementById('password_student');
    const password_repeat_student = document.getElementById('password_repeat_student');

    // Set focus to the first input element 
    student_name.focus();

    // Adding event listeners to our singn_up form elements
    student_name.addEventListener('keyup', validateUname);
    password_student.addEventListener('keyup', validatePassword);
    password_repeat_student.addEventListener('keyup', validateRepeatedPassword);

    // Error messages
    const uNameError = document.getElementById('student_name_check');
    const uPassError = document.getElementById('uPassCheck');
    const uPassRepeatError = document.getElementById('uPassRepeatCheck');

    // Hide error messages initially
    uNameError.style.display = "none";
    uPassError.style.display = "none";
    uPassRepeatError.style.display = "none";

    let validUName = false;
    let isPasswordMatch = false;
    let isPasswordEntered = false;

    // Functions for event listeners of our form
    function validateUname() {
        // if username is empty
        if (this.value == "") {
            uNameError.innerText = "Username is required";
            uNameError.style.display = "block";
            this.focus();
            validUName = false;
            add_student_btn.disabled = true;
        }
        // if username is a number
        else if (!isNaN(this.value)) {
            uNameError.innerText = "Username must be a string";
            uNameError.style.display = "block";
            this.focus();
            validUName = false;
            add_student_btn.disabled = true;
        }
        else {
            uNameError.style.display = "none";
            validUName = true;
        }
    }
    function validatePassword() {
        if (this.value == "") {
            uPassError.innerText = "Password is must";
            uPassError.style.display = "block";
            this.focus();
            isPasswordEntered = false;
            add_student_btn.disabled = true;
        }
        else {
            isPasswordEntered = true;
            uPassError.style.display = "none";
        }
    }
    function validateRepeatedPassword() {
        if (this.value == "") {
            uPassRepeatError.innerText = "Please re-enter your password";
            uPassRepeatError.style.display = "block";
            this.value = "";
            this.focus();
            isPasswordMatch = false;
            add_student_btn.disabled = true;
        }
        else if (this.value !== password_student.value) {
            uPassRepeatError.innerText = "Password did not match";
            uPassRepeatError.style.display = "block";
            isPasswordMatch = false;
            add_student_btn.disabled = true;
        }
        else {
            uPassRepeatError.style.display = "none";
            isPasswordMatch = true;
        }
    }
     // To check whether all entries are valid or not
     setInterval(() => {
        if (validUName && isPasswordEntered && isPasswordMatch) {
            if (add_student_btn.disabled != false) { add_student_btn.disabled = false; }
        }
    }, 100);
}