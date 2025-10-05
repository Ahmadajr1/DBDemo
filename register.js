//from the file dp.js (that has sql connection)
const bcrypt = require('bcrypt');
const db = require('./dp'); 


//simple hashing function (SHA256 here, adjust if you need bcrypt)
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

//Simulated request object (like PHP's $_SERVER + $_POST)
async function handleRequest(req, res) {
  if (req.method === "POST"){

    //getting constants ready
    let errors = [];
    let firstName = "";
    let lastName = "";
    let jobRole = "";
    let phoneNumber = "";
    let email = "";

    //getting inputs and cleaning them
    firstName   =    (req.body.firstName   || "").trim();
    lastName    =    (req.body.lastName    || "").trim();
    jobRole    =    (req.body.jobRole    || "").trim();
    phoneNumber =    (req.body.phoneNumber || "").trim();
    email       =    (req.body.email       || "").trim();
    const password = (req.body.password || "");

    console.log('REQ BODY:', req.body);
    //checking input
    if (!firstName)    { errors.push("First name is required."); }
    if (!lastName)     { errors.push("Last name is required."); }
    if (!jobRole)     { errors.push("Job role is required."); }
    if (!phoneNumber)  { errors.push("Phone number is required."); }
    if (!email)        { errors.push("Email is required."); }
    if (!password)     { errors.push("Password is required."); }

    //If there are validation errors, send them back
    if (errors.length > 0) {
      res.send(`<div style="color:red;">${errors.join("<br>")}</div>`);
      return;
    }

    try {
      //Check if email or phone number already exists
      const [rows] = await db.query(
        "SELECT id FROM users WHERE email = ? OR phone_number = ?",
        [email, phoneNumber]
      );

      if (rows.length > 0) {
        res.send(`<div style="color:red;">An account with this Email or phone number already exists.</div>`);
        return;
      }

      //if nothing wrong it will register new user
      const Hashed = await hashPassword(password); // hashing the password
      const [result] = await db.query(
        "INSERT INTO users (first_name, last_name, job_role, phone_number, email, password) VALUES (?,?,?,?,?,?)",
        [firstName, lastName, jobRole, phoneNumber, email, Hashed]
      );

      if (result.affectedRows > 0) {
        res.send(`
          <script>
            alert('Registration successful! Redirecting to users page.');
            window.location.href = 'users.html';
          </script>
        `);
        return;
      } else {
        res.send(`<div style="color:red;">Registration failed. Please try again later.</div>`);
      }
    } catch (err) {
      console.error(err);
      res.send(`<div style="color:red;">Server error: ${err.message}</div>`);
    }
  } else {
    res.send(`<div style="color:red;">Invalid request method.</div>`);
  }
}

//
module.exports = handleRequest;
