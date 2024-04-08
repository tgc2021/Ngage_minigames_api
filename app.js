
const express = require("express");
const cors = require("cors");
const axios = require('axios');

const mysql = require("mysql2");
const fs=require("fs")
const https=require("https")
const app = express();
const port = 2000;
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(cors());



// Create a MySQL database connection
// const db = mysql.createConnection({
//   host: "13.127.109.239",
//   user: "TgcRajatP2L",
//   password: "Rajat@P2Lcub",
//   //database: "pypdb",
//   database: "db_new_ngage",
// });

// Create a MySQL database connection
const db = mysql.createConnection({
    host: "13.127.109.239",
    user: "TgcRajatP2L",
    password: "Rajat@P2Lcub",
    //database: "pypdb",
   database: "db_new_ngage",
  });
  

  
const db2 = mysql.createConnection({
    host: "13.127.109.239",
    user: "TgcRajatP2L",
    password: "Rajat@P2Lcub",
    database: "db_tgc_game_pro", // Database 2
  });


  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  db2.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database1:', err);
      return;
    }
    console.log('Connected to MySQL database1');
  });


const httpsOptions = {
  key: fs.readFileSync('/opt/bitnami/letsencrypt/certificates/m2ost.com.key'),
  cert: fs.readFileSync('/opt/bitnami/letsencrypt/certificates/m2ost.com.crt'),
}

// app.post('/api/users', (req, res) => {
//   const { org_id, name, email, phone_number, password, city } = req.body;
//   const query = `INSERT INTO tbl_temp_User (org_id, name, email, phone_number, password, city, updated_datetime) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
//   db.query(query, [org_id, name, email, phone_number, password, city], (err, result) => {
//     if (err) {
//       console.error('Error inserting user:', err);
//       res.status(500).json({ error: 'Failed to insert user' });
//       return;
//     }
//     console.log('User inserted successfully');
//     res.status(200).json({ message: 'User inserted successfully' });
//   });
// });


// app.post('/api/users', (req, res) => {
//   const { org_id, name, email,phone_number, password, city } = req.body;

//   // Insert into tbl_temp_User in db1
//   const queryTempUser = `INSERT INTO tbl_temp_User (org_id, name, email,phone_number, password, city, updated_datetime) VALUES (?, ?, ?, ?, ?, ?,NOW())`;
//   db.query(queryTempUser, [org_id, name, email,phone_number, password, city], (err, result) => {
//     if (err) {
//       console.error('Error inserting user into tbl_temp_User:', err);
//       res.status(500).json({ error: 'Failed to insert user into tbl_temp_User' });
//       return;
//     }
//     console.log('User inserted successfully into tbl_temp_User');

//     // Get the inserted user's ID
//     const userId = result.insertId;

//     // Insert into tbl_users in db2
//     const queryUsers = `
//       INSERT INTO db_tgc_game_beta.tbl_users (Name, Email, Phone_No, Password, ID_ORGANIZATION, login_type)
//       VALUES (?, ?, ?, ?, ?, 1)
//     `;
//     db2.query(queryUsers, [name, email, null, password, org_id], (usersErr, usersResult) => {
//       if (usersErr) {
//         console.error('Error inserting user into tbl_users:', usersErr);
//         res.status(500).json({ error: 'Failed to insert user into tbl_users' });
//         return;
//       }
//       console.log(usersResult);
//       console.log('User inserted successfully into tbl_users in db2');
//       res.status(200).json({ message: 'User inserted successfully' });
//     });
//   });
// });


// app.post('/api/signup', (req, res) => {
//   const { org_id, name, email, password, phone_number, city } = req.body;
  
//   // Check if the email or phone number already exists in the database
//   const checkQuery = `SELECT COUNT(*) AS count FROM tbl_temp_User WHERE email = ? OR phone_number = ?`;
//   db.query(checkQuery, [email, phone_number], (err, result) => {
//     if (err) {
//       console.error('Error checking for existing user:', err);
//       res.status(500).json({ error: 'Failed to check for existing user' });
//       return;
//     }
    
//     const existingUserCount = result[0].count;
    
//     if (existingUserCount > 0) {
//       // User with the same email or phone number already exists
//       res.status(400).json({ error: 'User with the same email or phone number already exists' });
//       return;
//     }
    
//     // No existing user found, proceed with insertion
//     const insertQuery = `INSERT INTO tbl_temp_User (org_id, name, email, password, phone_number, city, updated_datetime) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
//     db.query(insertQuery, [org_id, name, email, password, phone_number, city], (err, result) => {
//       if (err) {
//         console.error('Error inserting user:', err);
//         res.status(500).json({ error: 'Failed to insert user' });
//         return;
//       }
//       console.log('User inserted successfully');
//       res.status(200).json({ message: 'User inserted successfully' });
//     });
//   });
// });

app.post('/api/signup', (req, res) => {
  const { org_id, name, email, password, phone_number, city } = req.body;
  
  // Check if a user with the same org_id, email, and phone_number already exists in the database
  const checkQuery = `SELECT COUNT(*) AS count FROM tbl_temp_User WHERE org_id = ? AND (email = ? OR phone_number = ?)`;
  db.query(checkQuery, [org_id, email, phone_number], (err, result) => {
    if (err) {
      console.error('Error checking for existing user:', err);
      res.status(500).json({ error: 'Failed to check for existing user' });
      return;
    }
    
    const existingUserCount = result[0].count;
    
    if (existingUserCount > 0) {
      // User with the same org_id, email, or phone number already exists
      res.status(400).json({ error: 'User with the same org_id, email, or phone number already exists' });
      return;
    }
    
    // No existing user found, proceed with insertion
    const insertQuery = `INSERT INTO tbl_temp_User (org_id, name, email, password, phone_number, city, updated_datetime) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
    db.query(insertQuery, [org_id, name, email, password, phone_number, city], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).json({ error: 'Failed to insert user' });
        return;
      }
      console.log('User inserted successfully');
      res.status(200).json({ message: 'User inserted successfully' });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { org_id, email, password } = req.body;

  // Construct the SQL query to check if the user exists
  const query = `
    SELECT * FROM tbl_temp_User WHERE org_id = ? AND Email = ? AND Password = ?
  `;

  // Execute the SQL query with org_id, email, and password as parameters
  db.query(
    query,
    [org_id, email, password],
    (err, result) => {
      if (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      
      // Check if any rows were returned (indicating a matching user)
      if (result.length > 0) {
        // User exists, return success response
        res.status(200).json({ message: "Login successful", user: result[0] });
      } else {
        // No matching user found, return error response
        res.status(401).json({ error: "Invalid org_id, email, or password" });
      }
    }
  );
});

// app.post("/api/login", (req, res) => {
//   const { email, password } = req.body;

//   // Construct the SQL query to check if the user exists
//   const query = `
//     SELECT * FROM tbl_temp_User WHERE Email = ? AND Password = ?
//   `;

//   // Execute the SQL query with email and password as parameters
//   db.query(
//     query,
//     [email, password],
//     (err, result) => {
//       if (err) {
//         console.error("Error during login:", err);
//         res.status(500).json({ error: "Internal server error" });
//         return;
//       }
      
//       // Check if any rows were returned (indicating a matching user)
//       if (result.length > 0) {
//         // User exists, return success response
//         res.status(200).json({ message: "Login successful", user: result[0] });
//       } else {
//         // No matching user found, return error response
//         res.status(401).json({ error: "Invalid email or password" });
//       }
//     }
//   );
// });


// app.post("/api/registration", (req, res) => {
//   const { Name, Email, Phone_No, Password, Organization_Name, IsActive, ID_ORGANIZATION, login_type, Id_CmsUser } = req.body;

//   // Construct the SQL INSERT query
//   const query = `
//     INSERT INTO tbl_users (Name, Email, Phone_No, Password, Organization_Name, IsActive, Updated_Date_Time, ID_ORGANIZATION, login_type, Id_CmsUser)
//     VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)
//   `;

//   // Execute the SQL query with the user data as parameters
//   db2.query(
//     query,
//     [Name, Email, Phone_No, Password, Organization_Name, IsActive, ID_ORGANIZATION, login_type, Id_CmsUser],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting user:", err);
//         res.status(500).json({ error: "Failed to insert user" });
//         return;
//       }
//       console.log("User inserted successfully");
//       res.status(200).json({ message: "User inserted successfully" });
//     }
//   );
// });


// app.get('/api/game_user_logs/:Id_Game', (req, res) => {
//   const { Id_Game } = req.params;

//   const query = `SELECT * FROM tbl_game_user_log WHERE Id_Game = ? ORDER BY score DESC`;
//   db2.query(query, [Id_Game], (err, result) => {
//     if (err) {
//       console.error('Error retrieving game user logs:', err);
//       res.status(500).json({ error: 'Failed to retrieve game user logs' });
//       return;
//     }
//     res.status(200).json({ game_user_logs: result });
//   });
// });

app.post("/api/games", (req, res) => {
  const { id_game, org_id, front_image, back_image, game_name,game_url, enable_status } = req.body;

  // Construct the SQL INSERT query
  const query = `
    INSERT INTO tbl_game_list (id_game, org_id, front_image, back_image, game_name,game_url, enable_status, updated_datetime)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  // Execute the SQL query with the game details as parameters
  db.query(
    query,
    [id_game, org_id, front_image, back_image, game_name, game_url, enable_status],
    (err, result) => {
      if (err) {
        console.error("Error inserting game details:", err);
        res.status(500).json({ error: "Failed to insert game details" });
        return;
      }
      console.log("Game details inserted successfully");
      res.status(200).json({ message: "Game details inserted successfully" });
    }
  );
});

app.post("/api/updatePlayStatus", (req, res) => {
  const { id_game, org_id, played } = req.body;

  // Construct the SQL UPDATE query
  const query = `
    UPDATE tbl_game_list
    SET played = ?
    WHERE id_game = ? AND org_id = ?

  `;

  // Execute the SQL query with the updated back_image and matching id_game and org_id
  db.query(
    query,
    [played, id_game, org_id],
    (err, result) => {
      if (err) {
        console.error("Error updating game details:", err);
        res.status(500).json({ error: "Failed to update game details" });
        return;
      }
      if (result.affectedRows === 0) {
        // If no rows were affected, it means no matching records were found
        res.status(404).json({ error: "No matching game details found" });
        return;
      }
      console.log("Game details updated successfully");
      res.status(200).json({ message: "Game details updated successfully" });
    }
  );
});



app.get("/api/getGameList/:orgId", (req, res) => {
  const orgId = req.params.orgId;

  // Construct the SQL SELECT query
  const query = `
    SELECT * FROM tbl_game_list WHERE org_id = ?
  `;

  // Execute the SQL query with the orgId as parameter
  db.query(
    query,
    [orgId],
    (err, result) => {
      if (err) {
        console.error("Error retrieving game details:", err);
        res.status(500).json({ error: "Failed to retrieve game details" });
        return;
      }
      res.status(200).json({ games: result });
    }
  );
});

app.get('/api/getAssessment', (req, res) => {
  const { ID_ORGANIZATION, Id_Game } = req.query; // Assuming the client will send these values as query parameters

  // Construct the SQL SELECT query
  const query = `
    SELECT * FROM tbl_assessment 
    WHERE ID_ORGANIZATION = ? AND Id_Game = ?
  `;

  // Execute the SQL query with the provided parameters
  db2.query(
    query,
    [ID_ORGANIZATION, Id_Game],
    (err, result) => {
      if (err) {
        console.error('Error fetching assessment details:', err);
        res.status(500).json({ error: 'Failed to fetch assessment details' });
        return;
      }
      res.status(200).json({ assessments: result });
    }
  );
});

app.post('/api/autoAssignAssessment', (req, res) => {
  const { Id_User, Email, Id_Assessment, ID_ORGANIZATION, IsActive } = req.body;

  // Check if a record with the same combination of Id_User, Email, Id_Assessment, and ID_ORGANIZATION already exists
  const checkQuery = `
    SELECT COUNT(*) AS count FROM tbl_question_user_log 
    WHERE Id_User = ? AND Email = ? AND Id_Assessment = ? AND ID_ORGANIZATION = ?
  `;
  db2.query(checkQuery, [Id_User, Email, Id_Assessment, ID_ORGANIZATION], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking for existing record:', checkErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const existingRecordCount = checkResult[0].count;
    if (existingRecordCount > 0) {
      // Record already exists, return error response
      res.status(400).json({ error: 'Duplicate entry for Id_User, Email, Id_Assessment, and ID_ORGANIZATION' });
      return;
    }

    // If no existing record found, proceed with insertion
    // Construct the SQL INSERT query
    const insertQuery = `
      INSERT INTO tbl_question_user_log (Id_User, Email, Id_Assessment, ID_ORGANIZATION, IsActive, UPDATED_DATE_TIME)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    
    // Execute the SQL query to insert the new record
    db2.query(insertQuery, [Id_User, Email, Id_Assessment, ID_ORGANIZATION, IsActive], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Error inserting data into tbl_question_user_log:', insertErr);
        res.status(500).json({ error: 'Failed to insert data into tbl_question_user_log' });
        return;
      }
      console.log('Data inserted successfully into tbl_question_user_log');
      res.status(200).json({ message: 'Data inserted successfully into tbl_question_user_log' });
    });
  });
});


app.post("/api/updatePassword", (req, res) => {
  const { org_id, email, phone_number, password } = req.body;

  // Construct the SQL UPDATE query
  const updateQuery = `
    UPDATE tbl_temp_user 
    SET password = ?
    WHERE org_id = ? AND (email = ? OR phone_number = ?)
  `;

  // Execute the SQL query
  db.query(
    updateQuery,
    [password, org_id, email, phone_number],
    (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ error: "Failed to update password" });
        return;
      }

      // Check if any row was updated
      if (result.affectedRows === 0) {
        // No matching record found
        res.status(404).json({ error: "No matching record found" });
        return;
      }

      // Password updated successfully
      res.status(200).json({ message: "Password updated successfully" });
    }
  );
});



// app.post('/api/autoAssignAssessment', (req, res) => {
//   const { Id_User,Email, Id_Assessment, ID_ORGANIZATION, IsActive } = req.body;

//   // Construct the SQL INSERT query
//   const query = `
//     INSERT INTO tbl_question_user_log (Id_User, Email,Id_Assessment, ID_ORGANIZATION, IsActive, UPDATED_DATE_TIME)
//     VALUES (?, ?, ?, ?, ?, NOW())
//   `;

//   // Execute the SQL query with the data from the request body as parameters
//   db2.query(
//     query,
//     [Id_User,Email, Id_Assessment, ID_ORGANIZATION, IsActive],
//     (err, result) => {
//       if (err) {
//         console.error('Error inserting data into tbl_question_user_log:', err);
//         res.status(500).json({ error: 'Failed to insert data into tbl_question_user_log' });
//         return;
//       }
//       console.log('Data inserted successfully into tbl_question_user_log');
//       res.status(200).json({ message: 'Data inserted successfully into tbl_question_user_log' });
//     }
//   );
// });


// app.get('/api/gameLeaderboard', (req, res) => {
//   const { id_user, Id_Game, status, ID_ORGANIZATION } = req.query;

//   // Construct the SQL SELECT query to retrieve scores and rank
//   const query = `
//     SELECT *, 
//            FIND_IN_SET(score, (SELECT GROUP_CONCAT(score ORDER BY score DESC) FROM tbl_game_user_log WHERE Id_Game = ? AND status = ? AND ID_ORGANIZATION = ?)) AS ranking
//     FROM tbl_game_user_log
//     WHERE id_user = ? AND Id_Game = ? AND status = ? AND ID_ORGANIZATION = ?
//     ORDER BY score DESC;
//   `;

//   // Execute the SQL query with the provided parameters
//   db2.query(
//     query,
//     [Id_Game, status, ID_ORGANIZATION, id_user, Id_Game, status, ID_ORGANIZATION],
//     (err, result) => {
//       if (err) {
//         console.error('Error fetching scores:', err);
//         res.status(500).json({ error: 'Failed to fetch scores' });
//         return;
//       }
//       res.status(200).json({ scores: result });
//     }
//   );
// });



// app.get('/api/leaderboard', (req, res) => {
//   const { id_game, ID_ORGANIZATION } = req.query; // Assuming the client will send these values as query parameters

//   // Construct the SQL SELECT query to fetch leaderboard data
//   const mainQuery = `
//     SELECT id_user, score,
//            @row_number := @row_number + 1 AS ranking
//     FROM (
//         SELECT id_user, SUM(score) AS score
//         FROM tbl_game_user_log 
//         WHERE id_game = ? AND ID_ORGANIZATION = ?
//         GROUP BY id_user
//         ORDER BY score DESC
//     ) AS ranked_users;
//   `;

//   // Execute the SET statement to initialize the row number variable
//   db.query('SET @row_number = 0;', (err) => {
//     if (err) {
//       console.error('Error initializing row number variable:', err);
//       res.status(500).json({ error: 'Failed to fetch leaderboard data' });
//       return;
//     }

//     // Execute the main query after setting the variable
//     db2.query(mainQuery, [id_game, ID_ORGANIZATION], (err, result) => {
//       if (err) {
//         console.error('Error fetching leaderboard data:', err);
//         res.status(500).json({ error: 'Failed to fetch leaderboard data' });
//         return;
//       }
//       res.status(200).json({ leaderboard: result });
//     });
//   });
// });


app.get('/api/leaderboard', (req, res) => {
  const { id_game, ID_ORGANIZATION } = req.query; // Assuming the client will send these values as query parameters

  // Construct the SQL SELECT query to fetch leaderboard data
  const mainQuery = `
    SELECT id_user, score,
           @row_number := IF(@prev_score = score, @row_number, @row_number + 1) AS ranking,
           @prev_score := score
    FROM (
        SELECT id_user, SUM(score) AS score
        FROM tbl_game_user_log 
        WHERE id_game = ? AND ID_ORGANIZATION = ?
        GROUP BY id_user
        ORDER BY score DESC
    ) AS g,
    (SELECT @row_number := 0, @prev_score := NULL) AS r;
  `;

  // Execute the main query
  db2.query(mainQuery, [id_game, ID_ORGANIZATION], (err, result) => {
    if (err) {
      console.error('Error fetching leaderboard data:', err);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
      return;
    }
    res.status(200).json({ leaderboard: result });
  });
});

app.get('/api/overallleaderboard', (req, res) => {
  const { ID_ORGANIZATION } = req.query;

  // Construct the SQL SELECT query to fetch leaderboard data
  const queryLeaderboard = `
    SELECT id_user, total_score,
           @rank := IF(@prev_score = total_score, @rank, @rank + @prev := 1) AS rank,
           @prev_score := total_score
    FROM (
        SELECT id_user, SUM(score) AS total_score
        FROM tbl_game_user_log 
        WHERE ID_ORGANIZATION = ?
        GROUP BY id_user
        ORDER BY total_score DESC
    ) AS g,
    (SELECT @rank := 0, @prev := 0, @prev_score := NULL) AS r
    ORDER BY total_score DESC;
  `;

  // Execute the SQL query to fetch leaderboard data
  db2.query(queryLeaderboard, [ID_ORGANIZATION], (err, leaderboardResult) => {
    if (err) {
      console.error('Error fetching leaderboard data:', err);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
      return;
    }

    // Extract user ids from the leaderboard results
    const userIds = leaderboardResult.map(entry => entry.id_user);

    // Construct the SQL SELECT query to fetch user details
    const queryUserDetails = `
      SELECT Id_User, Name, Email
      FROM tbl_users
      WHERE ID_ORGANIZATION = ? AND Id_User IN (?)
    `;

    // Execute the SQL query to fetch user details
    db2.query(queryUserDetails, [ID_ORGANIZATION, userIds], (err, userDetailsResult) => {
      if (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Failed to fetch user details' });
        return;
      }

      // Combine leaderboard data with user details
      const combinedResult = leaderboardResult.map(leaderboardEntry => {
        const userDetails = userDetailsResult.find(user => user.Id_User === leaderboardEntry.id_user);
        return {
          id_user: leaderboardEntry.id_user,
          name: userDetails ? userDetails.Name : null,
          email: userDetails ? userDetails.Email : null,
          total_score: leaderboardEntry.total_score,
          rank: leaderboardEntry.rank
        };
      });

      // Extract user emails for fetching city names
      const userEmails = combinedResult.map(entry => entry.email);

      // Construct the SQL SELECT query to fetch city names
      const queryCityNames = `
        SELECT email, city
        FROM tbl_temp_user
        WHERE email IN (?)
      `;

      // Execute the SQL query to fetch city names
      db.query(queryCityNames, [userEmails], (err, cityResult) => {
        if (err) {
          console.error('Error fetching city names:', err);
          res.status(500).json({ error: 'Failed to fetch city names' });
          return;
        }

        // Map city names to the combined result
        combinedResult.forEach(entry => {
          const cityEntry = cityResult.find(city => city.email === entry.email);
          entry.city = cityEntry ? cityEntry.city : null;
        });

        res.status(200).json({ leaderboard: combinedResult });
      });
    });
  });
});

// app.get('/api/overallleaderboard', (req, res) => {
//   const { ID_ORGANIZATION } = req.query;

//   // Construct the SQL SELECT query to fetch leaderboard data
//   const queryLeaderboard = `
//     SELECT id_user, total_score,
//            @rank := IF(@prev_score = total_score, @rank, @rank + @prev := 1) AS rank,
//            @prev_score := total_score
//     FROM (
//         SELECT id_user, SUM(score) AS total_score
//         FROM tbl_game_user_log 
//         WHERE ID_ORGANIZATION = ?
//         GROUP BY id_user
//         ORDER BY total_score DESC
//     ) AS g,
//     (SELECT @rank := 0, @prev := 0, @prev_score := NULL) AS r
//     ORDER BY total_score DESC;
//   `;

//   // Execute the SQL query to fetch leaderboard data
//   db2.query(queryLeaderboard, [ID_ORGANIZATION], (err, leaderboardResult) => {
//     if (err) {
//       console.error('Error fetching leaderboard data:', err);
//       res.status(500).json({ error: 'Failed to fetch leaderboard data' });
//       return;
//     }

//     // Extract user ids from the leaderboard results
//     const userIds = leaderboardResult.map(entry => entry.id_user);

//     // Construct the SQL SELECT query to fetch user details
//     const queryUserDetails = `
//       SELECT Id_User, Name, Email
//       FROM tbl_users
//       WHERE ID_ORGANIZATION = ? AND Id_User IN (?)
//     `;

//     // Execute the SQL query to fetch user details
//     db2.query(queryUserDetails, [ID_ORGANIZATION, userIds], (err, userDetailsResult) => {
//       if (err) {
//         console.error('Error fetching user details:', err);
//         res.status(500).json({ error: 'Failed to fetch user details' });
//         return;
//       }

//       // Combine leaderboard data with user details
//       const combinedResult = leaderboardResult.map(leaderboardEntry => {
//         const userDetails = userDetailsResult.find(user => user.Id_User === leaderboardEntry.id_user);
//         return {
//           id_user: leaderboardEntry.id_user,
//           name: userDetails ? userDetails.Name : null,
//           email: userDetails ? userDetails.Email : null,
//           total_score: leaderboardEntry.total_score,
//           rank: leaderboardEntry.rank
//         };
//       });

//       res.status(200).json({ leaderboard: combinedResult });
//     });
//   });
// });




// app.get('/api/overallleaderboard', (req, res) => {
//   const { ID_ORGANIZATION } = req.query;

//   // Construct the SQL SELECT query to fetch leaderboard data
//   const query = `
//     SELECT id_user, total_score,
//            @rank := IF(@prev_score = total_score, @rank, @rank + @prev := 1) AS rank,
//            @prev_score := total_score
//     FROM (
//         SELECT id_user, SUM(score) AS total_score
//         FROM tbl_game_user_log 
//         WHERE ID_ORGANIZATION = ?
//         GROUP BY id_user
//         ORDER BY total_score DESC
//     ) AS g,
//     (SELECT @rank := 0, @prev := 0, @prev_score := NULL) AS r
//     ORDER BY total_score DESC;
//   `;

//   // Execute the SQL query
//   db2.query(query, [ID_ORGANIZATION], (err, result) => {
//     if (err) {
//       console.error('Error fetching leaderboard data:', err);
//       res.status(500).json({ error: 'Failed to fetch leaderboard data' });
//       return;
//     }
//     res.status(200).json({ leaderboard: result });
//   });
// });



// app.get('/api/userInfo', (req, res) => {
//   const { id_user, id_game, id_organization } = req.query; // Assuming the client will send these values as query parameters

//   // Construct the SQL SELECT query to retrieve user information
//   const query = `
//     SELECT tbl_users.Email, tbl_users.ID_ORGANIZATION
//     FROM tbl_users
//     JOIN tbl_game_user_log ON tbl_users.Id_User = tbl_game_user_log.id_user
//     WHERE tbl_game_user_log.id_user = ? AND tbl_game_user_log.Id_Game = ? AND tbl_game_user_log.ID_ORGANIZATION = ?
//     LIMIT 1;
//   `;

//   // Execute the SQL query with the provided parameters
//   db2.query(query, [id_user, id_game, id_organization], (err, result) => {
//     if (err) {
//       console.error('Error fetching user information:', err);
//       res.status(500).json({ error: 'Failed to fetch user information' });
//       return;
//     }
//     if (result.length > 0) {
//       // User found, return user information
//       res.status(200).json({ email: result[0].Email, organization: result[0].ID_ORGANIZATION });
//     } else {
//       // User not found
//       res.status(404).json({ error: 'User not found' });
//     }
//   });
// });

app.get('/api/userInfo', (req, res) => {
  const { id_user, id_game, id_organization } = req.query; // Assuming the client will send these values as query parameters

  // Construct the SQL SELECT query to retrieve email and organization information
  const query = `
    SELECT tbl_users.Email, tbl_users.ID_ORGANIZATION
    FROM tbl_users
    JOIN tbl_game_user_log ON tbl_users.Id_User = tbl_game_user_log.id_user
    WHERE tbl_game_user_log.id_user = ? AND tbl_game_user_log.Id_Game = ? AND tbl_game_user_log.ID_ORGANIZATION = ?
    LIMIT 1;
  `;

  // Execute the SQL query with the provided parameters
  db2.query(query, [id_user, id_game, id_organization], (err, result) => {
    if (err) {
      console.error('Error fetching user information:', err);
      res.status(500).json({ error: 'Failed to fetch user information' });
      return;
    }
    if (result.length > 0) {
      const userEmail = result[0].Email;

      // Now, compare the retrieved email with the tbl_temp_user table
      const tempUserQuery = `
        SELECT *
        FROM tbl_temp_user
        WHERE email = ?
        LIMIT 1;
      `;

      // Execute the SQL query to retrieve user details from tbl_temp_user table
      db.query(tempUserQuery, [userEmail], (tempErr, tempResult) => {
        if (tempErr) {
          console.error('Error fetching user details from tbl_temp_user:', tempErr);
          res.status(500).json({ error: 'Failed to fetch user details from tbl_temp_user' });
          return;
        }
        if (tempResult.length > 0) {
          // User found in tbl_temp_user, return user details
          res.status(200).json({ email: userEmail, organization: result[0].ID_ORGANIZATION, userDetails: tempResult[0] });
        } else {
          // User not found in tbl_temp_user
          res.status(404).json({ error: 'User not found in tbl_temp_user' });
        }
      });
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// Define the API endpoint to insert organization name and sub-organization details
app.post('/api/createOrganizations', (req, res) => {
  // Extract organization details from the request body
  const { organization_name, sub_org_id, sub_org_name } = req.body;

  // Execute SQL query to insert organization details into tbl_ngage_organization
  const insertOrganizationQuery = `
    INSERT INTO tbl_ngage_organization (organization_name, updated_datetime)
    VALUES (?, NOW())
  `;
  db.query(insertOrganizationQuery, [organization_name], (err, result) => {
    if (err) {
      console.error('Error inserting organization:', err);
      res.status(500).json({ error: 'Failed to insert organization' });
      return;
    }

    const organizationId = result.insertId;

    // Execute SQL query to insert sub-organization details into tbl_sub_organizations
    const insertSubOrganizationQuery = `
      INSERT INTO tbl_sub_organizations (sub_org_id, sub_org_name, updated_datetime, id_ngage_Organization)
      VALUES (?, ?, NOW(), ?)
    `;
    db.query(insertSubOrganizationQuery, [sub_org_id, sub_org_name, organizationId], (subOrgErr) => {
      if (subOrgErr) {
        console.error('Error inserting sub-organization:', subOrgErr);
        res.status(500).json({ error: 'Failed to insert sub-organization' });
        return;
      }

      res.status(200).json({ message: 'Organization and sub-organization inserted successfully' });
    });
  });
});

// Define the API endpoint to insert data into tbl_coins_game_log
app.post('/api/coinsGameLog', (req, res) => {
  // Extract data from the request body
  const { org_id, id_game, xps, time, id_user, status } = req.body;

  // Execute SQL query to insert data into tbl_coins_game_log
  const insertQuery = `
    INSERT INTO tbl_coins_game_log (org_id, id_game, xps, time, id_user, status, updated_datetime)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  db.query(insertQuery, [org_id, id_game, xps, time, id_user, status], (err, result) => {
    if (err) {
      console.error('Error inserting data into tbl_coins_game_log:', err);
      res.status(500).json({ error: 'Failed to insert data into tbl_coins_game_log' });
      return;
    }

    res.status(200).json({ message: 'Data inserted successfully into tbl_coins_game_log' });
  });
});
// Define the GET API endpoint to retrieve data from tbl_coins_game_log
app.get('/api/coins-game-log', (req, res) => {
  // Extract org_id and id_game from query parameters
  const { org_id, id_game } = req.query;

  // Construct the SQL SELECT query to retrieve data and rank
  const query = `
    SELECT *, 
           @rank := IF(@prev_xps = xps, @rank, @rank + 1) AS rank,
           @prev_xps := xps
    FROM (
        SELECT id_user, SUM(xps) AS xps
        FROM tbl_coins_game_log
        WHERE org_id = ? AND id_game = ?
        GROUP BY id_user
        ORDER BY xps DESC
    ) AS ranked_data,
    (SELECT @rank := 0, @prev_xps := NULL) AS r;
  `;

  // Execute the SQL query with the provided parameters
  db.query(query, [org_id, id_game], (err, result) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'Failed to retrieve data' });
      return;
    }

    // Process the retrieved data to calculate rank and sum xps for same id_user
    let rank = 0;
    let prevXps = null;
    result.forEach((row, index) => {
      if (row.xps !== prevXps) {
        rank++;
        prevXps = row.xps;
      }
      row.rank = rank;
    });

    res.status(200).json({ data: result });
  });
});


app.get('/api/overallxps', (req, res) => {
  const { org_id } = req.query;

  // Construct the SQL SELECT query to fetch overall xps data
  const queryXps = `
    SELECT id_user, SUM(xps) AS overall_xps
    FROM tbl_coins_game_log
    WHERE org_id = ?
    GROUP BY id_user
    ORDER BY overall_xps DESC;
  `;

  // Execute the SQL query to fetch overall xps data
  db.query(queryXps, [org_id], (err, xpsResult) => {
    if (err) {
      console.error('Error fetching overall xps data:', err);
      res.status(500).json({ error: 'Failed to fetch overall xps data' });
      return;
    }

    // If there are no results, return an empty response
    if (xpsResult.length === 0) {
      res.status(200).json({ overall_xps: [] });
      return;
    }

    // Assign ranks
    let rank = 1;
    let prevXps = null;
    const rankedXpsResult = xpsResult.map((entry, index) => {
      if (entry.overall_xps !== prevXps) {
        rank = index + 1;
        prevXps = entry.overall_xps;
      }
      return { ...entry, rank };
    });

    // Extract user ids from the overall xps result
    const userIds = rankedXpsResult.map(entry => entry.id_user);

    // Construct the SQL SELECT query to fetch user details
    const queryUserDetails = `
      SELECT u.Id_User, u.Name, u.Email
      FROM tbl_users u
      WHERE u.Id_User IN (${userIds.map(() => '?').join(',')})
    `;

    // Execute the SQL query to fetch user details
    db2.query(queryUserDetails, userIds, (err, userDetailsResult) => {
      if (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'Failed to fetch user details' });
        return;
      }

      // Combine overall xps data with user details
      const combinedResult = rankedXpsResult.map(xpsEntry => {
        const userDetails = userDetailsResult.find(user => String(user.Id_User) === String(xpsEntry.id_user));
        return {
          id_user: xpsEntry.id_user,
          name: userDetails ? userDetails.Name : null,
          email: userDetails ? userDetails.Email : null,
          overall_xps: xpsEntry.overall_xps,
          rank: xpsEntry.rank
        };
      });

      // Extracting name and email from userDetailsResult
      const name = userDetailsResult.map(user => user.Name);
      const email = userDetailsResult.map(user => user.Email);

      // Construct the SQL SELECT query to fetch city from tbl_temp_user
      const queryCity = `
        SELECT city
        FROM tbl_temp_user
        WHERE org_id = ? AND name IN (${name.map(() => '?').join(',')}) AND email IN (${email.map(() => '?').join(',')})
      `;

      // Execute the SQL query to fetch city
      db.query(queryCity, [org_id, ...name, ...email], (err, cityResult) => {
        if (err) {
          console.error('Error fetching city:', err);
          res.status(500).json({ error: 'Failed to fetch city' });
          return;
        }

        // Create a map of user IDs to cities
        const cityMap = {};
        cityResult.forEach((cityEntry, index) => {
          cityMap[name[index] + '|' + email[index]] = cityEntry.city;
        });

        // Update the combinedResult with city
        const combinedResultWithCity = combinedResult.map(entry => ({
          ...entry,
          city: cityMap[entry.name + '|' + entry.email] || null
        }));

        res.status(200).json({ overall_xps: combinedResultWithCity });
      });
    });
  });
});







// Define the endpoint to send OTP
// app.get('/api/send-otp', async (req, res) => {
//   console.log(req);
//   try {
//     // Extract query parameters from the request URL
//     const { template_id, mobile, authkey } = req.body;
//     console.log(req.body);
//     // Make a request to the MSG91 OTP API
//     const response = await axios.get('https://control.msg91.com/api/v5/otp', {
//       params: {
//         template_id,
//         mobile,
//         authkey
//       }

//     });
//     // Send back the response from the MSG91 API
//     res.json(response.data);
//   } catch (error) {
//     // Handle errors
//     console.error('Error:', error.response.data);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post('/api/send-otp', async (req, res) => {
  try {
    // Extract data from the request body
    const { template_id, mobile, authkey } = req.body;

    // Make a request to the MSG91 OTP API
    const response = await axios.post('https://control.msg91.com/api/v5/otp', {
      template_id,
      mobile,
      authkey
    });

    // Send back the response from the MSG91 API
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error.response.data);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/api/verify-otp', async (req, res) => {
//   try {
//     const otp = req.query.otp;
//     const mobile = req.query.mobile;
//     const authkey = req.headers['authkey'];

//     // Make a request to the MSG91 OTP verification API
//     const response = await axios.get(`https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${mobile}`, {
//       headers: {
//         'authkey': authkey
//       }
//     });

//     // Send back the response from the MSG91 API
//     res.json(response.data);
//   } catch (error) {
//     // Handle errors
//     console.error('Error:', error.response.data);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




app.get('/api/verify-otp', async (req, res) => {
  try {
    const otp = req.query.otp;
    const mobile = req.query.mobile;
    const authkey = req.query.authkey; // Get authkey from query parameter

    // Make a request to the MSG91 OTP verification API
    const response = await axios.get(`https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${mobile}`, {
      headers: {
        'authkey': authkey // Pass authkey as a header
      }
    });

    // Send back the response from the MSG91 API
    res.json(response.data);
  } catch (error) {
    // Handle errors
    console.error('Error:', error.response.data);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Define the route to retrieve user details
app.post('/api/ngageLogin', (req, res) => {
  const { email, password, id_organization } = req.body;

  // Define the SQL query to select user details based on email, password, and ID_ORGANIZATION
  const query = `
    SELECT * FROM tbl_users 
    WHERE Email = ? AND Password = ? AND ID_ORGANIZATION = ?
  `;

  // Execute the SQL query
  db2.query(query, [email, password, id_organization], (err, result) => {
    if (err) {
      console.error('Error retrieving user details:', err);
      res.status(500).json({ error: 'Failed to retrieve user details' });
      return;
    }
    
    if (result.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // User found, return user details
    res.status(200).json({ user: result[0] });
  });
});

app.post('/api/updatePassword', (req, res) => {
  const { org_id, phone_number, password } = req.body;

  // Construct the SQL UPDATE query
  const query = `
    UPDATE tbl_temp_user 
    SET password = ?
    WHERE org_id = ? AND phone_number = ?
  `;

  // Execute the SQL query with the data from the request body as parameters
  db.query(
    query,
    [password, org_id, phone_number],
    (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'Failed to update password' });
        return;
      }
      // Check if any rows were affected (indicating a successful update)
      if (result.affectedRows === 0) {
        // No matching record found, return error response
        res.status(404).json({ error: 'No matching record found' });
        return;
      }
      console.log('Password updated successfully');
      res.status(200).json({ message: 'Password updated successfully' });
    }
  );
});
app.post("/api/insertGamePlayedStatus", (req, res) => {
  const { id_game, id_user, org_id, play_status } = req.body;

  // Construct the SQL SELECT query to check for existing records
  const selectQuery = `
    SELECT id FROM game_played_status
    WHERE id_game = ? AND id_user = ? AND org_id = ? AND play_status = ?
    LIMIT 1
  `;

  // Execute the SQL query to check for existing records
  db.query(selectQuery, [id_game, id_user, org_id, play_status], (err, rows) => {
    if (err) {
      console.error("Error checking for existing game played status:", err);
      return res.status(500).json({ error: "Failed to check for existing game played status" });
    }

    if (rows.length > 0) {
      // Record already exists, return a message indicating duplication
      return res.status(400).json({ error: "Duplicate game played status" });
    }

    // No duplicate found, proceed with insertion
    const playStatusValue = play_status !== undefined ? play_status : 0;
    const updatedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const insertQuery = `
      INSERT INTO game_played_status (id_game, id_user, org_id, play_status, updated_datetime)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [id_game, id_user, org_id, playStatusValue, updatedDateTime], (err, result) => {
      if (err) {
        console.error("Error inserting game played status:", err);
        return res.status(500).json({ error: "Failed to insert game played status" });
      }
      console.log("Game played status inserted successfully");
      return res.status(200).json({ message: "Game played status inserted successfully" });
    });
  });
});


// app.post("/api/insertGamePlayedStatus", (req, res) => {
//   const { id_game, id_user, org_id, play_status } = req.body;

//   // Set default play_status if not provided
//   const playStatusValue = play_status !== undefined ? play_status : 0;

//   // Create a timestamp for updated_datetime
//   const updatedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

//   // Construct the SQL INSERT query
//   const query = `
//     INSERT INTO game_played_status (id_game, id_user, org_id, play_status, updated_datetime)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   // Execute the SQL query with the provided values
//   db.query(
//     query,
//     [id_game, id_user, org_id, playStatusValue, updatedDateTime],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting game played status:", err);
//         res.status(500).json({ error: "Failed to insert game played status" });
//         return;
//       }
//       console.log("Game played status inserted successfully");
//       res.status(200).json({ message: "Game played status inserted successfully" });
//     }
//   );
// });

app.get("/api/getGamePlayedStatus/:id_user/:org_id", (req, res) => {
  const { id_user, org_id } = req.params;

  // Construct the SQL SELECT query
  const query = `
    SELECT *
    FROM game_played_status
    WHERE id_user = ? AND org_id = ?
  `;

  // Execute the SQL query with the provided parameters
  db.query(
    query,
    [ id_user, org_id],
    (err, result) => {
      if (err) {
        console.error("Error retrieving game played status:", err);
        res.status(500).json({ error: "Failed to retrieve game played status" });
        return;
      }
      if (result.length === 0) {
        res.status(404).json({ error: "Game played status not found" });
        return;
      }
      console.log("Game played status retrieved successfully");
      res.status(200).json(result);
    }
  );
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const server = https.createServer(httpsOptions,app).listen(4000, () => {
  console.log("Server running on https://localhost:4000/");
});
