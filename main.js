import { connectDB, addUser } from './index.js';

async function main() {
    await connectDB();
    
    try {
        //creating a new user here
        const user = {
        "username": "TestingOneFinalTime",
        "password": "$thisismyhashedpassword",
        "bio": "I am currently making da database",
        "hobbies": ["videogames", "hiking", "board games"],
        "matches": [
        {
            "userId": "65f12ab34cd5678901234567",
            "status": "matched"
        }
        ],
        "createdAt": "2025-02-27T15:30:00Z" 
        };

        const newUser = await addUser(user);
        console.log(`User added successfully: ${newUser.username}`);
    } catch (error) {
        console.error(`Error adding user: ${error.message}`);
    }
}

main();