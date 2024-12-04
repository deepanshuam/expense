document.addEventListener('DOMContentLoaded', () => {
  // Function to clear input fields
  function clearFields() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    console.log("Fields cleared");
  }

  // Remove error message when the user starts typing
  const inputs = ['email', 'password'];
  inputs.forEach(inputId => {
    document.getElementById(inputId).addEventListener('input', () => {
      const errorMessage = document.querySelector('#signup-form p');
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  });

  // Signup form submission
  document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("name, email, password:", { name, email, password });

    try {
      const response = await axios.post('/users/signup', { name, email, password });
      console.log(response.data);
      
      alert('Sign Up Successful!');
      clearFields();
    } catch (error) {
      console.error(error.response.data);
      const errorMessage = document.createElement('p');
      errorMessage.textContent = error.response.data.message || 'An error occurred';
      errorMessage.style.color = 'red';
      document.getElementById('signup-form').appendChild(errorMessage);
    }
  });

  // Login form submission
  document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("email, password:", { email, password });

    try {
      const response = await axios.post('/users/login', { email, password });
      console.log(response.data);

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Assuming the token is returned
        window.location.href = '/'; // Redirect to the home page
      }
    } catch (error) {
      console.log("error:", error);
      const errorMessage = document.createElement('p');
      errorMessage.textContent = error.response.data.message || 'Login failed';
      errorMessage.style.color = 'red';
      document.getElementById('login-form').appendChild(errorMessage);
    }

    // Clear the email and password fields
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  });
});
