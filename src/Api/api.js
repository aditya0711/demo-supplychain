export const getProductsList = () => {

  const PRODUCT_LIST_API_ENDPOINT = `//localhost:3000/api/v1/products`;

  return fetch(PRODUCT_LIST_API_ENDPOINT)
      .then(handleApiError)
      .then(response => {
        return response.json();
        })
      .then(json => {
        return json;
        })
        .then(json => {
        return json.data.map(({ id, name, price }) => ({
            id,
            name,
            price
        }));
        })
        .catch(function (error) {
            console.log(error);
            throw error;
        })
};


function handleApiError(response) {
    return new Promise(function(resolve,reject){
        if(!response.ok) {
            response.text().then(function(text){
                reject(new Error(response.statusText + ": " + text));
            })
        }
        else {
            resolve(response);
        }
    })
}