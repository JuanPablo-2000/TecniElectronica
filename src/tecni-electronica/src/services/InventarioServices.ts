
export default class InventarioServices {

    URL_API: string = "http://localhost:4000/inventario";

    headers() {
        const token = localStorage.getItem("token");
        let tokenFormat = "";

        if (token && token != "undefined") {
            tokenFormat = token;
        } else {
            localStorage.removeItem("token");
        }

        return {
            'x-access-token': `${tokenFormat}`,
            "Content-type": "application/json"
        }
    }

    getInventarioPagination(limit: number, skip: number) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/pagination?skip=${skip}&limit=${limit}`, {
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    getSearchForInventario(filtro: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${filtro}`, {
                    method: 'GET',
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    createInventario(body: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: this.headers()
                });
                
                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    updateInventario(body: any, id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteInventario(id: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.URL_API}/${id}`, {
                    method: 'DELETE',
                    headers: this.headers()
                });

                if(response.ok) {
                    const json = await response.json();
                    resolve(json);
                }else {
                    const json = await response.json();
                    reject(json);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

}