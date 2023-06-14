export default class UserServices {
    URL_API: string = "http://localhost:4000/user";

    getUserByUsername(username: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${username}`, {
                    method: "GET",
                    headers: { 
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    }
                });
                const json = await response.json();
                
                resolve(json);
            } catch (error) {
                reject(error)
            }
        });
    }
}