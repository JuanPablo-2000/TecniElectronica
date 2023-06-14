export default class LoginServices {
    URL_API: string = "http://localhost:4000/auth/signin";

    authentication(body: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}`, {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: { "Content-type": "application/json" }
                });
                const json = await response.json();
                resolve(json);
            } catch (error) {
                reject(error);
            }
        });
    }

}