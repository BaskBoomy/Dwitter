//jwtkey 
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2NjEzNTU0MjZ9.9DjKM266hwXivndnBPwJ_Bt-J5ztuZQGxDnsH_0co4o
let users = [
    {
        "id" : "1",
        "username": "jack",
        "email" : "jack@jack.com",
        "password": "$2b$12$B4a3qsFbIhln5ueaXOXEt.jJqNmt5psqy/4WwalAHdjRBd4G33rUW",
        "name": "jack",
        "url": "",
    },
    {
        "id" : "2",
        "username": "david",
        "email" : "david@david.com",
        "password": "$2b$12$B4a3qsFbIhln5ueaXOXEt.jJqNmt5psqy/4WwalAHdjRBd4G33rUW",
        "name": "david",
        "url": "",
    }
];
export async function findByUsername(username){
    return users.find(u => u.username === username);
}

export async function findById(userId){
    return users.find(u => u.id === userId);
}

export async function createUser(newUser){
    const created = {...newUser, id:Date.now().toString()}
    users.push(created);
    return created.id;
}