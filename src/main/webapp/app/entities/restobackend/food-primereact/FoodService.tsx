import axios from "axios";


export class CustomerService {

   
    getCustomersSmall() {
        return fetch('data/customers-small.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomersMedium() {
        return fetch('data/customers-medium.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomersLarge() {
        return fetch('data/customers-large.json').then(res => res.json())
                .then(d => d.data);
    }

    getCustomersXLarge() {
        return fetch('data/customers-xlarge.json').then(res => res.json())
                .then(d => d.data);
    }

    async getFoods(params?) {
        const queryParams = params ? Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&') : '';
        
        try {
            const res = await axios.get("services/restobackend/api/datatable?" + queryParams).then(res => res.data.data)
            return res;
          } catch (error) {
            // handle error
          }
    }

    
}
    