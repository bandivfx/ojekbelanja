import React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

import MainNav from '../../components/MainNav';
import Header from '../../components/Header';
import DescriptionList from '../../components/DescriptionList';
import Table from '../../components/Table';
import Brand from '../../components/Brand';
import { quantify, subtotal, total } from '../../services/product';
import { stores, products } from '../../models';
import '../pages.css';
import './ThankYou.css';

let ThankYou = ({ match, order, user }) => {
  const storeId = match.params.storeId;
  const toko = stores[storeId];

  const pemesanList = [
    { term: 'No. Pesanan', definition: '' },
    { term: 'Tanggal Pengiriman', definition: '' },
    { term: 'Nama', definition: user.name },
    { term: 'Panggilan', definition: user.nickname },
    { term: 'Email', definition: user.email },
    { term: 'No. HP', definition: user.phone },
    { term: 'Kota', definition: user.city },
    { term: 'Alamat', definition: user.address },
    { term: 'Catatan', definition: user.notes },
  ];

  const tokoList = [
    { term: 'Nama Toko', definition: toko.name },
    { term: 'Area Layanan', definition: toko.area },
    { term: 'No. HP', definition: toko.phone },
  ];

  const type = {
    'No': 'number',
    'Nama': 'name',
    'Harga': 'price',
    'Jumlah': 'qty',
    'Subtotal': 'price',
  }

  const body =
    Object.keys(order)
      .map((key, id) => {
        const item = products[key];
        const row = {
          'No': id + 1,
          'Nama': item.name,
          'Harga':
          <div>
            Rp {(item.price).toLocaleString('id')}
            <span className="ThankYou-pesanan-unit"> /{item.unit}</span>
          </div>,
          'Jumlah': quantify(order[key], item.step, item.unit),
          'Subtotal': subtotal(order[key], item.step, item.price),
        }
        return row;
      });

  const footerColSpan = {
    'Nama': 2,
    'Harga': 3,
  }
  const footerClassName = {
    1: 'italic',
    2: 'total',
  }
  const productsTotalPrice = total(order, products);
  const footer = [
    {
      'Nama': 'Subtotal',
      'Harga': `Rp ${productsTotalPrice.toLocaleString('id')}`,
    },
    {
      'Nama': 'Ongkos Kirim',
      'Harga': `Rp ${(toko.cost).toLocaleString('id')}`,
    },
    {
      'Nama': 'Total',
      'Harga': `Rp ${(toko.cost + productsTotalPrice).toLocaleString('id')}`,
    },
  ]

  return (
    !order || Object.keys(order).length === 0 ? (
      // No ordered Item, go back to Toko page
      <Redirect to={`/toko/${storeId}`}/>
    ) : (
      <div className="l-fullwidth">
        <div className="l-wrapper-MainNav">
          <MainNav />
        </div>
        <Header heading={"Toko " + toko.name} />
        <main className="l-ThankYou">
          <p>Terima kasih telah berbelanja di toko {toko.name}, berikut detil transaksi Anda:</p>
          <DescriptionList
            list={pemesanList}
            />
          <Table
            type={type}
            body={body}
            footerColSpan={footerColSpan}
            footerClassName={footerClassName}
            footer={footer}
            />
          <h4>Cara Pembayaran</h4>
          <ol>
            <li>Pastikan Anda telah menerima email konfirmasi pesanan dari <Brand />.</li>
            <li>Untuk pertanyaan lebih lanjut, berikut detil informasi toko tempat Anda memesan:
              <DescriptionList
                list={tokoList}
                />
            </li>
            <li>Pembayaran dilakukan dengan cara <i>COD (Cash On Delivery)</i>.</li>
          </ol>
        </main>
      </div>
    )
  );
};

const mapStateToProps = (state, ownProps) => ({
  order: state.order,
  user: state.user,
});

ThankYou = connect(
  mapStateToProps,
)(ThankYou);

export default ThankYou;
