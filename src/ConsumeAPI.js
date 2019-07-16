import axios from 'axios';

var crypto = require('crypto');


const url = 'http://localhost:5000/api/user/';
const invurl = 'http://localhost:5000/api/inventory/';

class ConsumeAPI {
  //Get Posts
  static getInventory() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(invurl);
        const data = res.data;
        resolve(
          data.map(inv => ({
            ...inv,
            createdAt: new Date(inv.createdAt)
          }))
        );
      }
      catch (err) {
        reject(err);
      }
    });
  }

  //Create Item
  static insertInv(name, price, quantity, supplier, category) {
    return axios.post(invurl, {
      item: name,
      price: price,
      quantity: quantity,
      supplier: supplier,
      category: category
    });
  }

  static searchInv(selected, query) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`${invurl}search`, {
          searchType: selected,
          query: query
        }).then(result => result);
        const data = res.data;
        resolve(
          data
        );

      }
      catch (err) {
        reject(err);
      }
    });
  }
  //delete item
  static deleteItem(id) {
    return axios.delete(`${invurl}${id}`);

  }

  //TODO: finish verification
  //Doing login here is insecure as user can use debugger to manipulate the logins
  //Login
  static login(username, password) {

    var verify = (axios.post(url + "finduser", {
      username
    })).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      if (!response.data) {
        return false;
      }
      else {
        var passwordData = this.sha512(password, response.data.salt);

        //check if password matches
        if (passwordData.passwordHash === response.data.password) {
          return [true, response.data.username];
        }
        else {
          return false;
        }
      }
    });
    return verify;
    //implement compare here;
  }

  //edit item
  static editItem(id, edit) {
    return axios.put(`${invurl}${id}`, {
      item: edit.name,
      price: edit.price,
      quantity: edit.quantity,
      supplier: edit.supplier,
      category: edit.category
    });
  }

  //Delete Post
  static deletePost(id) {
    return axios.delete(`${url}${id}`);
  }

  static updatePost(id, text) {
    return axios.put(`${url}${id}`, {
      text
    });
  }

  static getCategory() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${url}getcategory/5d1d398425b78b22847c7603`);
        //return just the category
        const data = res.data.category;
        resolve(
          data
        );
      }
      catch (err) {
        reject(err);
      }
    });

  }

  static addCategory(newCategory) {
    //for now we hardcode the id in
    // should be replaced with 
    // return axios.put(`${url}category/${id}`
    return axios.put(`${url}category/5d1d398425b78b22847c7603`, {
      category: newCategory
    });
  }


  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */

  /**
  * hash password with sha512.
  * @function
  * @param {string} password - List of required fields.
  * @param {string} salt - Data to be validated.
  */
  static sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
      salt: salt,
      passwordHash: value
    }
  }
}

export default ConsumeAPI;