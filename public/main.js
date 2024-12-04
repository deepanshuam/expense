

function parseJwt (token) {
    if(!token){
        return null;
    }
    console.log("token in parsejwt",token);
    // var base64Url = token;
    var base64Url = token.split('.')[1];
    console.log("base64url:",base64Url);
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded',async () => {
    const token=localStorage.getItem('token');
    console.log("token mainjs", token);
    checkPremiumUser();
    function checkPremiumUser(){
        const token=localStorage.getItem('token');
        console.log("token mainjs", token);
        const decodeToken=parseJwt(token);
        console.log("decodetoken in main.js:",decodeToken);
        const isPremiumUser=decodeToken.ispremiumuser;
        console.log(isPremiumUser);
        
        if (decodeToken.ispremiumuser) {
            document.getElementById('premium').style.display = 'none';
            document.getElementById('premiummessage').style.display='block';
            document.getElementById('btn_leader_board').style.display='block';
            document.getElementById('btn_download').style.display='block';
            document.getElementById('premium_content_container').style.display = 'block';
    
            
        } else {
            document.getElementById('premium_content_container').style.display = 'none';
    
            document.getElementById('premium').style.display = 'block';
            document.getElementById('premiummessage').style.display = 'none';
        }
    }
    
    // Function to check if user is a premium member
    
      // Call checkPremiumUser after user logs in or reloads the page
     
 
// const user=response.data;
// console.log("USer:",user);
    console.log("Expense Tracker Main JS");
    const btnLeaderBoard = document.getElementById("btn_leader_board");
const leaderBoardTitle = document.getElementById("leader_board_title");
const leaderBoardTable = document.getElementById("leader_board_table");

    document.getElementById('home_btn').onclick=function(){

window.location.href='./main.html';
checkPremiumUser();
    document.getElementById('expense-form-container').style.display='block';
        document.getElementById('expenses-container').style.display='block';
        document.getElementById('leaderboard-container').style.display = 'none';
    }; 



btnLeaderBoard.onclick = async () => {
    try {
        document.getElementById('expense-form-container').style.display='none';
        document.getElementById('expenses-container').style.display='none';
        document.getElementById('leaderboard-container').style.display = 'block';
        document.getElementById('premium_content_container').style.display = 'none';
        document.getElementById('downloadHistoryContainer').style.display = 'none';
    
        console.log("style updated")
        leaderBoardTitle.textContent = "Leader Board:";
        const token = localStorage.getItem('token');
        console.log("Token retrieved for expense", token);
        
        if (!token) {
            console.error('No token found');
            return;
        }

        console.log("Show leaderboard");
        console.log("token in leaderboard", token);
        const response = await axios.get("http://localhost:3000/premium/showleaderboard", { 
            headers:{
            'Authorization': `Bearer ${token}` 
            }
        });
        const data = response.data;
        console.log("data in leaderboard js ", data);
        renderLeaderBoard(data);
    } catch (error) {
        console.log(error);
    }
};

const renderLeaderBoard = (data) => {
    // Clear existing table content
    
    leaderBoardTable.innerHTML = "";
  
// Create the <thead> element
const thead = document.createElement("thead");

const headerRow = document.createElement("tr");

const positionHeader = document.createElement("th");
positionHeader.textContent = "Position";

const nameHeader = document.createElement("th");
nameHeader.textContent = "Name";

const totalExpensesHeader = document.createElement("th");
totalExpensesHeader.textContent = "Total Expenses";

headerRow.appendChild(positionHeader);
headerRow.appendChild(nameHeader);
headerRow.appendChild(totalExpensesHeader);

thead.appendChild(headerRow);

leaderBoardTable.appendChild(thead);

const tbody = leaderBoardTable.querySelector("tbody");
if (tbody) {
    tbody.style.backgroundColor = "#ecfaff"; // Example background color
    tbody.style.fontFamily = "'Roboto', sans-serif"; // Example font family
    tbody.style.fontSize = '16px'; // Example font size
    tbody.style.color = '#333';// Add more style properties as needed
}

    // Populate table with leaderboard data
    for (let i = 0; i < data.length; i++) {
        const row = leaderBoardTable.insertRow();
        const positionCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const totalExpensesCell = row.insertCell(2);
        positionCell.textContent = i + 1; // Position starts from 1
        nameCell.textContent = data[i].name;
        totalExpensesCell.textContent = data[i].totalExpense;
  }
};

const btnDownload = document.getElementById('btn_download');

btnDownload.onclick = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:3000/users/download', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
            const link = document.createElement('a');
            link.href = response.data.fileURL;
            link.download = 'expenses.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error("Download failed:", response.data.message);
        }
    } catch (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download expenses. Please try again.");
    }
};



    document.getElementById('premium').onclick = async function (e) {
    console.log("token in premium:", token);

    try {
        const token = localStorage.getItem('token');
        console.log("Token retrieved for expense", token);
        
        if (!token) {
            console.error('No token found');
            return;
        }

        console.log("Making request to get premium membership...");
        const response = await axios.get('http://localhost:3000/users/premium/premiummembership', { 
           
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("get successful");
        console.log(response);
        console.log("updated token:", response.data.token);   
        localStorage.setItem('token', response.data.token);

        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                await axios.post('http://localhost:3000/users/premium/updateTransactionStatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                alert('You are Premium User Now');
                document.getElementById('premium').style.display = 'none';
                document.getElementById('premiummessage').style.display = 'block';
                document.getElementById('btn_leader_board').style.display = 'block';
                document.getElementById('btn_download').style.display = 'block';
                document.getElementById('premium_content_container').style.display = 'block';
            },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Payment Failed!');
        });
    } catch (error) {
        console.log("Error:", error);
        alert('Error while processing request');
    }
};

    
    let globalLimit=5;
   
// Function to fetch and display expenses
async function fetchAndDisplayExpenses(page = 1) {
    
    try {
        const token = localStorage.getItem('token');
        console.log("Token retrieved for expense", token);
        
        if (!token) {
            console.error('No token found');
            return;
        }

        const expensesResponse = await axios.get(`http://127.0.0.1:3000/users/expenses?page=${page}&limit=${globalLimit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
       
        console.log("expensesResponse.data", expensesResponse.data);
        
        const { userExpenses, currentPage, hasNextPage, hasPreviousPage, nextPage, previousPage, lastPage } = expensesResponse.data;
        const expensesBody = document.getElementById('expenses-body');
        expensesBody.innerHTML = ''; // Clear existing table body

        userExpenses.forEach(expense => {
            const row = document.createElement('tr');

            // Format date
            const expenseDate = new Date(expense.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });// Modify as per your date format needs
    
            row.innerHTML = `
            <td>${expenseDate}</td>
            <td>${expense.category}</td>
                
                <td>${expense.description}</td>
                <td>${expense.amount}</td>
                <td><button class="edit-button" data-id="${expense.id}">Edit</button></td>
                <td><button class="delete-button" data-id="${expense.id}">Delete</button></td>
            `;
            // Add event listeners to edit and delete buttons
            const editButton = row.querySelector('.edit-button');
            editButton.addEventListener('click', () => {
                editExpense(expense);
            });
            const deleteButton = row.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => {
                deleteExpense(expense.id);
            });
            expensesBody.appendChild(row);
        });
        showpagination({
            currentPage,
            hasNextPage,
            hasPreviousPage,
            nextPage,
            previousPage,
            lastPage
        });
    } catch (error) {
        console.error(error);
    }
}

    

    // Function to handle form submission
    async function handleFormSubmission(event) {
        event.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        
        console.log("amount, desc, category:", { amount, description, category });

        try {
            const token = localStorage.getItem('token');
            console.log("token in main js file",token);
        if (!token) {
            // Handle case when token is not present
            console.error('No token found in mainjs');
            return;
        }
            const response = await axios.post('http://127.0.0.1:3000/users/expenses', { 
                amount, 
                description, 
                category 
            },
                { headers: 
                    { 'Authorization': `Bearer ${token}` }
                }
            );
            console.log(response.data);
            console.log("expense posted");

            clearFields();
            fetchAndDisplayExpenses();
        } catch (error) {
            console.error(error);
        }
    }

    // Function to handle editing expense
    function editExpense(expense) {
        // Populate input fields with expense data for editing
        console.log("in edit func");
       const expenseId=expense.id;
       console.log("expenseid:",expenseId);
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;
        deleteExpense(expenseId)

        // Implement editing logic here (optional)
    }

    // Function to handle deleting expense
    async function deleteExpense(expenseId) {
        console.log("in delete func");
        try {
            // Fetch the token from localStorage and log it for debugging
            const token = localStorage.getItem('token');
            console.log("Token retrieved:", token);
    
            // Ensure the token is not null or undefined
            if (!token) {
                throw new Error('Token not found in localStorage');
            }
    
            // Perform the delete request
            await axios.delete(`http://127.0.0.1:3000/users/expenses/${expenseId}`, {
                headers: { 'Authorization': `Bearer ${token}` } // Use Bearer prefix
            });
    
            console.log("Delete completed");
            fetchAndDisplayExpenses();
        } catch (error) {
            console.error(error);
        }
    }
    const showpagination = ({
        currentPage,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        lastPage,
    }) => {
        pagination.innerHTML = "";
        if (hasPreviousPage) {
            const btn2 = document.createElement("button");
            btn2.innerHTML = previousPage;
            btn2.addEventListener("click", () => fetchAndDisplayExpenses(previousPage));
            pagination.appendChild(btn2);
        }
        const btn1 = document.createElement("button");
        btn1.innerHTML = `<h3>${currentPage}</h3>`;
        btn1.addEventListener("click", () => fetchAndDisplayExpenses(currentPage));
        pagination.appendChild(btn1);
    
        if (hasNextPage) {
            const btn3 = document.createElement("button");
            btn3.innerHTML = nextPage;
            btn3.addEventListener("click", () => fetchAndDisplayExpenses(nextPage));
            pagination.appendChild(btn3);
        }
        if (lastPage > 2 && lastPage > nextPage) {
            const btn4 = document.createElement("button");
            btn4.innerHTML = lastPage;
            btn4.addEventListener("click", () => fetchAndDisplayExpenses(lastPage));
            pagination.appendChild(btn4);
        }
    }
    
// Get reference to the limit input and submit button
const limitInput = document.getElementById('rows_limit');
const limitSubmitButton = document.getElementById('limit');
console.log(limitInput);
limitSubmitButton.addEventListener('click', () => {
     const newLimit = parseInt(limitInput.value);

    if (!isNaN(newLimit) && newLimit > 0) {
       globalLimit=newLimit;
       limitInput.value='';
       fetchAndDisplayExpenses(1);
    } else {
         console.error('Invalid input for number of rows.');
    }
});

    // Function to clear input fields
    function clearFields() {
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        document.getElementById('category').value = '';
        console.log("Fields cleared");
    }
    
// Function to fetch and display download history
async function displayDownloadHistory() {
    try {
        const token = localStorage.getItem('token');
        console.log("Token retrieved for expense", token);
        
        if (!token) {
            console.error('No token found');
            return;
        }

        console.log("Show downl;oad history");
        console.log("token in leaderboard", token);
        // Fetch download history from the server
        const response = await axios.get('http://localhost:3000/premium/alldownloadhistory', {
            headers:{
                'Authorization': `Bearer ${token}` 
            }
        });

        console.log(response);
        // Get reference to the download history list
        const downloadHistoryList = document.getElementById('downloadHistoryList');

        // Clear existing list items
        downloadHistoryList.innerHTML = '';
        const downloadHistoryArray = response.data.downloadHistory;
      
        // Populate list with download history URLs
 // Loop through the download history array and create list items
 if (downloadHistoryArray.length === 0) {
    // If download history array is empty, display a message
    const listItem = document.createElement('li');
    listItem.textContent = 'No download history found';
    downloadHistoryList.appendChild(listItem);
} else{
 downloadHistoryArray.forEach(download => {
    const listItem = document.createElement('li');

  // Create anchor element for the URL
            const urlLink = document.createElement('a');
            urlLink.textContent = download.url;
            urlLink.href = download.url;
            urlLink.target = "_blank"; // Open link in new tab

            // Append anchor element to list item
            listItem.appendChild(urlLink);

            // Append list item to download history list
            downloadHistoryList.appendChild(listItem);
});
}

        // Display the download history list
        downloadHistoryList.style.display = 'block';
    } catch (error) {
        console.error(error);
        // Handle error
    }
}

// Function to toggle display of download history list
document.getElementById('toggleDownloadHistoryBtn').addEventListener('click', function() {
    const downloadHistoryList = document.getElementById('downloadHistoryList');
    if (downloadHistoryList.style.display === 'none') {
        // If list is hidden, display it
        displayDownloadHistory();
    } else {
        // If list is visible, hide it
        downloadHistoryList.style.display = 'none';
    }
});


    // Add event listener for form submission
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', handleFormSubmission);

    // Fetch and display expenses on page load
    fetchAndDisplayExpenses();
    const btnSignOut=document.getElementById('btn_Sign_out');
 
    function handleSignOut() {
       window.location.href = './login.html'; // Adjust the path as per your file structure
   }
   
   btnSignOut.addEventListener("click", handleSignOut);
});
