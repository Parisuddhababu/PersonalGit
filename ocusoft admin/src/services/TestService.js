export class TestService {

    getProductsSmall() {
        return fetch('./TestData/testdata.json').then(res => res.json()).then(d => d.data);
    }

    getProducts() {
        return fetch('./TestData/testdata.json').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
        return fetch('./TestData/testdata.json').then(res => res.json()).then(d => d.data);
    }
}
    