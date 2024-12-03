document.addEventListener('DOMContentLoaded', () => {
    const formOpenBtn = document.querySelector("#form-open"),
        home = document.querySelector(".home"),
        formContainer = document.querySelector(".form_container"),
        formCloseBtn = document.querySelector(".form_close"),
        signupBtn = document.querySelector("#signup"),
        loginBtn = document.querySelector("#login"),
        pwShowHide = document.querySelectorAll(".pw_hide"),
        loginForm = document.querySelector(".login_form form"),
        signupForm = document.querySelector(".signup_form form"),
        errorMessage = document.getElementById('error-message');

    if (formOpenBtn) {
        formOpenBtn.addEventListener("click", () => formContainer.classList.add("show"));
    }

    if (formCloseBtn) {
        formCloseBtn.addEventListener("click", () => formContainer.classList.remove("show"));
    }

    pwShowHide.forEach((icon) => {
        icon.addEventListener("click", () => {
            let getPwInput = icon.parentElement.querySelector("input");
            if (getPwInput.type === "password") {
                getPwInput.type = "text";
                icon.classList.replace("uil-lock-eye-slash", "uil-eye");
            } else {
                getPwInput.type = "password";
                icon.classList.replace("uil-eye", "uil-lock-eye-slash");
            }
        });
    });

    if (signupBtn) {
        signupBtn.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            formContainer.classList.remove("active");
        });
    }

    // Client-side validation and AJAX for login form
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector("input[name='email']").value;
            const password = loginForm.querySelector("input[name='password']").value;
            if (!email || !password) {
                errorMessage.textContent = "Please fill in all fields";
                errorMessage.style.display = "block";
                return;
            }

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.status === 'error') {
                errorMessage.textContent = result.message;
                errorMessage.style.display = "block";
            } else {
                window.location.href = '/';
            }
        });
    }

    // Client-side validation and AJAX for signup form
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = signupForm.querySelector("input[name='name']").value;
            const email = signupForm.querySelector("input[name='email']").value;
            const password = signupForm.querySelector("input[name='password']").value;
            const confirmPassword = signupForm.querySelector("input[name='confirm_password']").value;

            if (!name || !email || !password || !confirmPassword) {
                errorMessage.textContent = "Please fill in all fields";
                errorMessage.style.display = "block";
                return;
            }

            if (password !== confirmPassword) {
                errorMessage.textContent = "Passwords do not match";
                errorMessage.style.display = "block";
                return;
            }

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, confirm_password: confirmPassword })
            });
            const result = await response.json();
            if (result.status === 'error') {
                errorMessage.textContent = result.message;
                errorMessage.style.display = "block";
            } else {
                window.location.href = '/';
            }
        });
    }

});