<template>
  <div class="container">
    <!-- TODO: implement modals form properly with b-form -->
    <h1 align="left">Inventory</h1>
    <b-button v-b-modal.addItem variant="primary" class="custom-btn">Add Item</b-button>
    <b-button v-b-modal.categoryModal variant="primary" class="custom-btn">Add Category</b-button>

    <form v-on:submit.prevent="searchInv(search)">
      <div class="row">
        <div class="form-group col-2">
          <label for="searchOption">Search Type</label>
          <b-form-select id="searchOption" v-model="search.selected" :options="search.option"></b-form-select>
        </div>
        <div class="form-group col-10">
          <label for="search">Search</label>
          <input id="search" placeholder="Enter query" class="form-control" v-model="search.query" />
        </div>
      </div>
    </form>

    <!-- Add item modal -->

    <b-modal id="addItem" title="Add an item" hide-footer>
      <b-form v-on:submit.stop.prevent="createInventory">
        <div class="form-group">
          <label for="category">Category</label>
          <b-form-select id="category" v-model="create.category" :options="category"></b-form-select>
        </div>
        <div class="form-group">
          <label for="item">Item name</label>
          <input
            id="item"
            placeholder="Enter item name"
            class="form-control"
            v-model="create.name"
            required
          />
        </div>
        <div class="form-group">
          <label for="price">Price</label>
          <input
            class="form-control"
            id="price"
            placeholder="Enter price"
            v-model="create.price"
            required
          />
        </div>

        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input
            class="form-control"
            id="quantity"
            placeholder="Enter quantity"
            v-model="create.quantity"
            required
          />
        </div>
        <div class="form-group">
          <label for="supplier">Supplier</label>
          <input
            class="form-control"
            id="supplier"
            placeholder="Enter supplier"
            v-model="create.supplier"
            required
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="disabled"
        >Add</button>
      </b-form>
    </b-modal>

    <!-- Edit item modal -->
    <b-modal id="editModal" title="Edit an item" hide-footer>
      <div class="form-group">
        <label for="category2">Category</label>
        <b-form-select id="category2" v-model="edit.category" :options="category"></b-form-select>
      </div>
      <div class="form-group">
        <label for="item2">Item name</label>
        <input v-model="edit.name" id="item2" placeholder="Enter item name" class="form-control" />
      </div>
      <div class="form-group">
        <label for="price1">Price</label>
        <input
          class="form-control"
          id="price1"
          placeholder="Enter price"
          v-model.number="edit.price"
        />
      </div>
      <div class="form-group">
        <label for="quantity1">Quantity</label>
        <input
          class="form-control"
          id="quantity1"
          placeholder="Enter quantity"
          v-model.number="edit.quantity"
        />
      </div>
      <div class="form-group">
        <label for="supplier1">Supplier</label>
        <input
          class="form-control"
          id="supplier1"
          placeholder="Enter supplier"
          v-model="edit.supplier"
        />
      </div>
      <button
        type="button"
        v-on:click="editItem(edit._id)"
        class="btn btn-primary"
        :disabled="disabled"
      >Edit</button>
    </b-modal>

    <b-modal id="deleteModal" title="Delete an item">
      <p class="my-4">Are you sure you want to delete this item?</p>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="danger" v-on:click="deleteItem(deleteId)" @click="ok">Yes</b-button>
        <b-button variant="primary" @click="cancel()">No</b-button>
      </template>
    </b-modal>

    <b-modal id="categoryModal" title="Add category">
      <div class="form-group">
        <label for="newCategory">Category</label>
        <input
          class="form-control"
          id="newCategory"
          placeholder="Enter category name"
          v-model="newCategory"
        />
      </div>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button variant="danger" v-on:click="addCategory(newCategory)" @click="ok">Add</b-button>
        <b-button variant="primary" @click="cancel()">Cancel</b-button>
      </template>
    </b-modal>
    <!-- End of modal -->

    <p class="error" v-if="err">{{err}}</p>

    <div class="inventory-container">
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Supplier</th>
            <th>Manage</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(inventory,index) in inventory"
            v-bind:item="inventory"
            v-bind:index="index"
            v-bind:key="inventory._id"
          >
            <td>{{inventory.category}}</td>
            <td>{{inventory.item}}</td>
            <td>{{inventory.price}}</td>
            <td>{{inventory.quantity}}</td>
            <td>{{inventory.supplier}}</td>
            <td width="10%" class="manage">
              <ul>
                <li>
                  <p v-on:click="editModal(inventory)" class="pointer edit">
                    Edit
                    <font-awesome-icon icon="edit" />
                  </p>
                </li>
                <li>
                  <p v-on:click="deleteModal(inventory._id)" class="pointer">
                    Delete
                    <font-awesome-icon icon="trash" />
                  </p>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ConsumeAPI from "../ConsumeAPI";
export default {
  name: "inventory",
  data() {
    return {
      inventory: [],
      err: "",
      text: "",
      create: {},
      edit: {
        _id: "",
        name: "",
        price: 0,
        quantity: 0,
        supplier: "",
        category: ""
      },
      deleteId: "",
      disabled: false,
      newCategory: "",
      category: [],
      search: {
        selected: "name",
        option: [
          { value: "name", text: "Name" },
          { value: "category", text: "Category" },
          { value: "price", text: "Price" },
          { value: "quantity", text: "Quantity" }
        ],
        query: ""
      }
    };
  },
  async created() {
    try {
      this.inventory = await ConsumeAPI.getInventory();
      this.category = await ConsumeAPI.getCategory();
    } catch (err) {
      this.err = err.message;
    }
  },
  methods: {
    async createInventory() {
      //disable add button while it's clicked
      this.disabled = true;
      await ConsumeAPI.insertInv(
        this.create.name,
        this.create.price,
        this.create.quantity,
        this.create.supplier,
        this.create.category
      );
      this.inventory = await ConsumeAPI.getInventory();
      //reactivate button after await
      this.disabled = false;
      this.$bvModal.hide("addItem");
    },
    async searchInv(search) {
      this.inventory = await ConsumeAPI.searchInv(
        search.selected,
        search.query
      );
    },
    editModal: function(inventory) {
      this.edit._id = inventory._id;
      this.edit.name = inventory.item;
      this.edit.price = inventory.price;
      this.edit.quantity = inventory.quantity;
      this.edit.supplier = inventory.supplier;
      this.edit.category = inventory.category;
      this.$bvModal.show("editModal");
    },
    deleteModal: function(id) {
      this.deleteId = id;
      this.$bvModal.show("deleteModal");
    },
    async deleteItem(id) {
      await ConsumeAPI.deleteItem(id);
      this.inventory = await ConsumeAPI.getInventory();
    },
    async addCategory(newCategory) {
      await ConsumeAPI.addCategory(newCategory);
      this.category = await ConsumeAPI.getCategory();

      this.inventory = await ConsumeAPI.getInventory();
    },
    async updatePost(id) {
      await ConsumeAPI.updatePost(id, this.text);
      this.inventory = await ConsumeAPI.getInventory();
      this.inventory = "";
    },
    async editItem(id) {
      this.$bvModal.hide("editModal");

      await ConsumeAPI.editItem(id, this.edit);
      this.inventory = await ConsumeAPI.getInventory();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-btn {
  margin: 1em;
}
table {
  width: 100%;
  border: 3px solid orange;
  border-collapse: collapse;
}
thead {
  border: 2px solid black;
}
th,
td {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-collapse: collapse;
  padding: 15px;
  text-align: left;
}
.manage {
  text-align: center;
}
.pointer {
  cursor: pointer;
  margin-bottom: 0em;
}
.edit {
  margin-bottom: 1em;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
