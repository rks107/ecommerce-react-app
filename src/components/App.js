import React from "react";
import {Item, AddItem, Navbar, CartItems} from "./";
import firebase from "../firebase";
import { fetchProducts, assOrder, disOrder } from "../actions";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      displayItems: true,
      displayCart: false,
      loading: true,
    };
    this.db = firebase.firestore();
  }

  componentDidMount() {
    const { store } = this.props;

    store.subscribe(() => {
      console.log("UPDATED");
      this.forceUpdate();
    });

    this.db
      .collection("items")
      .onSnapshot((snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          return data;
        });

        store.dispatch(fetchProducts(items));

        this.setState({
          items: items,
          loading: false,
        });
      });
  }

  // FOR SHOWING PRODUCTS
  callShowItems = () => {
    this.setState({
      displayItems: true,
      displayCart: false,
    });
  };

  // FOR SHOWING CART OF PRODUCTS
  callShowCart = () => {
    this.setState({
      displayCart: true,
    });
  };

  // FOR SHOWING FORM FOR ADDING PRODUCTS
  callAddItem = () => {
    this.setState({
      displayItems: false,
      displayCart: false,
    });
  };

  // ADD NEW ITEM TO THE DATABASE
  addItemToState = (item) => {
    item.qty = 0;
    item.inCart = false;

    this.db
      .collection("items")
      .add(item)
      .then((docRef) => {
        console.log("Product Added: ", docRef);
      })
      .catch((err) => {
        console.log("Error: ", err);
      });

    this.setState({
      displayItems: true,
    });
    // const newItems = this.state.items.concat(item);
  };

  // FOR DELETING PRODUCT FROM PRODUCT LIST
  deleteItemFromState = (index) => {
    const { items } = this.state;
    const docRef = this.db.collection("items").doc(items[index].id);

    if (items[index].inCart) {
      this.onDeleteProduct(index);
    }

    docRef
      .delete()
      .then(() => {
        console.log("Deleted Product from Database");
      })
      .catch((err) => {
        console.log("Error in Deleting product From Database", err);
      });
  };

  // function For Adding item into card
  addItemToCart = (index) => {
    const { items } = this.state;
    const docRef = this.db.collection("items").doc(items[index].id);
    console.log("ITEM", items[index].url);
    docRef
      .update({
        inCart: true,
        qty: 1,
      })
      .then(() => {
        console.log("Product Added to Cart !");
      })
      .catch((err) => {
        console.log(`Error in Adding product into Cart ${err}`);
      });
  };

  // FOR EDITING PRODUCTS DETAILS
  editItemFromState = (index, newItem) => {
    const { items } = this.state;
    const docRef = this.db.collection("items").doc(items[index].id);

    docRef
      .update({
        ...items[index],
        name: newItem.newName,
        price: newItem.newPrice,
        star: newItem.newStar,
        description: newItem.newDescription,
      })
      .then(() => {
        console.log("Updated Sucessfully");
      })
      .catch((error) => {
        console.log("Error in updating Product :", error);
      });
  };

  // FOR INCREASE PRODUCT QUANTITY IN CARD
  onIncreasQuantity = (index) => {
    const { items } = this.state;
    const docRef = this.db.collection("items").doc(items[index].id);

    docRef
      .update({
        qty: items[index].qty + 1,
      })
      .then(() => {
        console.log("Updated Sucessfully");
      })
      .catch((error) => {
        console.log("Error i updating Product :", error);
      });
  };

  // FOR DECREASING PRODUCT QUANTITY IN CARD
  onDecreaseQuantity = (index) => {
    const { items } = this.state;
    if (items[index].qty <= 0) {
      return;
    }
    const docRef = this.db.collection("items").doc(items[index].id);

    docRef
      .update({
        qty: items[index].qty - 1,
      })
      .then(() => {
        console.log("Updated Sucessfully");
      })
      .catch((error) => {
        console.log("Error i updating Product :", error);
      });
  };

  // FOR REMOVING ITEM FROM CART
  onDeleteProduct = (index) => {
    const { items } = this.state;
    const docRef = this.db.collection("items").doc(items[index].id);

    docRef
      .update({
        inCart: false,
        qty: 0,
      })
      .then(() => {
        console.log("Removed From Cart Sucessfully");
      })
      .catch((error) => {
        console.log("Error in removing Product from Cart:", error);
      });
  };
  
  ascendingOrder = () => {
    const { products } = this.props.store.getState();
    products.sort(function (a, b) {
      return a.price - b.price;
    });

    this.props.store.dispatch(assOrder(products));
  };

  descendingOrder = () => {
    const { products } = this.props.store.getState();
    products.sort(function (a, b) {
      return b.price - a.price;
    });

    this.props.store.dispatch(disOrder(products));
  };

  TotalItemInCart = () => {
    let count = 0;
    this.state.items.forEach((item) => {
      count += item.qty;
    });

    return count;
  };

  TotalItemInCartPrice = () => {
    let totalPrice = 0;
    this.state.items.forEach((item) => {
      totalPrice += item.qty * item.price;
    });

    return totalPrice;
  };

  render() {
    console.log("State:", this.props.store.getState());
    const { products } = this.props.store.getState();
    const { displayItems, displayCart, loading } = this.state;
    return (
      <div className='App'>
        <Navbar
          getItemCount={this.TotalItemInCart()}
          getTotalMRP={this.TotalItemInCartPrice()}
          callShowItems={this.callShowItems}
          callAddItem={this.callAddItem}
          callShowCart={this.callShowCart}
        />

        <div className='main'>
          <div className='order'>
            <h4>Sort:</h4>
            <button onClick={this.ascendingOrder}>ascending</button>
            <button onClick={this.descendingOrder}>descending</button>
          </div>
          {displayCart ? (
            products.map((item, index) => {
              return item.inCart ? (
                <CartItems
                  key={index}
                  index={index}
                  item={item}
                  onIncreasQuantity={this.onIncreasQuantity}
                  onDecreaseQuantity={this.onDecreaseQuantity}
                  onDeleteProduct={this.onDeleteProduct}
                />
              ) : (
                <br index={index} />
              );
            })
          ) : displayItems ? (
            products.map((item, index) => {
              return (
                <Item
                  key={index}
                  index={index}
                  item={item}
                  deleteItemFromState={this.deleteItemFromState}
                  editItemFromState={this.editItemFromState}
                  addItemToCart={this.addItemToCart}
                />
              );
            })
          ) : (
            <AddItem addItemToState={this.addItemToState} />
          )}
        </div>
        {loading && <h1> Loading Products...</h1>}
      </div>
    );
  }
}

export default App;
