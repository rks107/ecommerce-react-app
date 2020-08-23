import React from 'react' ;


class Item extends React.Component {

    state = {
        isEditing: false
    };

    toggleEditing = () => {
        this.setState({
            isEditing: !this.state.isEditing
        });
    }
    
    deleteItem = () => {
        this.props.deleteItemFromState(this.props.index);
    }

    editItemSubmitHandler = (event) => {
        event.preventDefault();
        const updatedItem = {};
        updatedItem.newName = this.newName.value;
        updatedItem.newPrice = this.newPrice.value;
        updatedItem.newStar = this.newStar.value;
        updatedItem.newDescription = this.newDescription.value;

        this.props.editItemFromState(this.props.index, updatedItem);
    
        this.toggleEditing();
    };
    render(){

        const {name, imgURL, price, star, description} = this.props.item;

        if(this.state.isEditing) {
            return(
                <React.Fragment>
                   <form className="item" onSubmit={this.editItemSubmitHandler}>
                       <div className="item-image">
                           <img src={imgURL} alt="item-pic" />
                       </div>
                       <div className="name-rs-star">
                           <input className="name" 
                                defaultValue={name} 
                                ref={ node=> {
                                   this.newName = node;
                                }}
                           /> 
                           <input className="name" 
                                defaultValue={price} 
                                ref={ node=> {
                                    this.newPrice = node;
                                 }}
                            /> 
                           <input className="name" 
                                defaultValue={star} 
                                ref={ node=> {
                                    this.newStar = node;
                                 }}
                            /> 
                       </div>
                       <div className="description">
                            <textarea className="item-description" 
                                defaultValue={description} 
                                ref={ node=> {
                                    this.newDescription = node;
                                 }}
                            />   
                            <div className="edit-delete-button">
                                <button type="submit">Save</button>
                                <button onClick={this.toggleEditing}>Cancel</button>
                            </div>
                       </div>
                    </form>
                </React.Fragment>
            );
        }

        return(
            <React.Fragment>
               <div className="item">
                   <div className="item-image">
                       <img src={imgURL} alt="item-pic" />
                   </div>
                   <div className="name-rs-star">
                       <h3 className="name"> {name} </h3> 
                       <p className="name"> Rs.{price} </p> 
                       <p className="name"> Star: {star} </p> 
                   </div>
                   <div className="description">
                        <h4 className="item-description">  {description} </h4>   
                        <div className="edit-delete-button">
                            <button onClick={this.toggleEditing}>Edit</button>
                            <button onClick={this.deleteItem}>Delete</button>
                        </div>
                   </div>
                </div>
            </React.Fragment>
        );
    }
    
}

export default Item;