import React, { Component, PropTypes as T } from 'react';
import { connect } from "react-redux";
import { setKeyword } from "../actions";

import ProductInput from './ProductInput';
import ProductCards from './/ProductCards';
import { products, categories } from '../models';

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tempKeyword: '',
    }
  }

  componentWillUnmount() {
    this.props.clearKeyword();
  }

  /*** Methods ***/

  actionTemp = (tempKeyword) => {
    this.setState({
      tempKeyword,
    })
  }

  /*** Render ***/
  
  render() {
    return (
      <div>
        <ProductInput
          placeholder="Cari Produk"
          tempKeyword={this.state.tempKeyword}
          actionTemp={this.actionTemp}
          withButton
          />
        <ProductCards
          items={products}
          sections={categories}
          fields={{
            title: 'name',
            description: 'desc',
            image: 'image',
            ribbon: 'promo',
            tooltip: 'promo_desc',
            section: 'category',
            disabled: 'empty'
          }}
          />
      </div>
    )
  }
}

Products.propTypes = {
  order: T.objectOf(T.number).isRequired,
  clearKeyword: T.func.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    order: state.order
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearKeyword: () => {
      dispatch(setKeyword(""));
    }
  };
};

Products = connect(
  mapStateToProps,
  mapDispatchToProps
)(Products);

export default Products;