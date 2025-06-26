class Services {
    async getDataServices(data, method, url) {
        let parameters = {
            method: method,
            mode: 'cors',
            headers: {},
        };

        if (data) {
            // Si es FormData, no se añade Content-Type
            if (data instanceof FormData) {
                parameters.body = data;
            } else {
                parameters.headers["Content-Type"] = "application/json";
                parameters.headers["X-Requested-With"] = "XMLHttpRequest";
                parameters.body = JSON.stringify(data);
            }
        }

        return await fetch(url, parameters);
    }

    async getServicesAuth(data, method, url, token) {
        let parameters;
        parameters = {
            method: method,
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }
        if (data != "") {
            parameters.body = JSON.stringify(data);
        }

        return await fetch(url, parameters);
    }
}