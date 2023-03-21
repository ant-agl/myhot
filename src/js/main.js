$('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());
$(window).resize(() => {
    $('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());
});

import DropMenu from './DropMenu';
new DropMenu('.profile-menu');

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
import moment from 'moment';

new AirDatepicker('#date', {
  autoClose: true,
  position: 'bottom center',
  maxDate: moment().subtract(18, 'years')
});

import './profile';