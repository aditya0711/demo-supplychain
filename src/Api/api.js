export const createProduct = (product) => {
  const API_URL_CREATE_PRODUCT = 'http://localhost:3000/api/v1/product/createProduct';
  var options ={
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    //contentType: 'application/json',
    body: JSON.stringify({
      id                    : product[0].productId,
      name                  : product[0].name,
      price                 : product[0].price
    })
  };
  return fetch(API_URL_CREATE_PRODUCT, options)
    .then(response => {
      return response.json()
    })
    .then(json=> {
      return json;
    })
    .catch(err =>{
      console.log("ERROR in Saga createProduct:  "+ err);
    })
}

export const addSubProduct = (subProduct) => {
    const API_URL_ADD_SUB_PRODUCT = 'http://localhost:3000/api/v1/product/addSubProduct';
    var options ={
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        //contentType: 'application/json',
        body: JSON.stringify({
            parentId              : subProduct[0].productId,
            childId               : subProduct[0].childId,
            quantity              : subProduct[0].quantity
        })
    };
    return fetch(API_URL_ADD_SUB_PRODUCT, options)
        .then(response => {
            return response.json()
        })
        .then(json=> {
            return json;
        })
        .catch(err =>{
            console.log("ERROR in Saga addSubProduct:  "+ err);
        })
}
