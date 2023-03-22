$('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());
$(window).resize(() => {
    $('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());
});

import DropMenu from './DropMenu';
new DropMenu('.profile-menu');
let menuMobile = new DropMenu('.main__menu-mobil');
menuMobile.setBtnToggle('.main__menu-mobil img');

import Menu from './Menu';
new Menu('.main__menu-list', '.tabs-content');

import GetData from './GetData';
let getData = new GetData();
getData.getAll();

import 'jquery-mask-plugin';
$('.mask-phone')
  .mask('+7 (000) 000-00-00', {
    placeholder: '+7 (___) ___-__-__'
  });

import 'air-datepicker/air-datepicker.css';
import AirDatepicker from 'air-datepicker';
import {createPopper} from '@popperjs/core';
import moment from 'moment';

let date = new AirDatepicker('#date', {
  autoClose: true,
  position: 'bottom center',
  isMobile: $(window).outerWidth() <= 767,
  maxDate: moment().subtract(18, 'years')
});
$(window).resize(() => {
  let w = $(window).outerWidth();
  date.update({
    isMobile: w <= 767
  });
});

import './profile';