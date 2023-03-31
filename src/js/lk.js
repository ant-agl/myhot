import './default';

function changeHeightOnResize() {
  $('.main').css('min-height', $(window).outerHeight() - $('.header').outerHeight());

  let hMainSection = $(window).outerHeight() - $('.header').outerHeight();
  hMainSection = Math.max(hMainSection, $('.main__menu').outerHeight(true));
  $('.main__section').css('max-height', hMainSection);
}
changeHeightOnResize();
$(window).resize(changeHeightOnResize);

import Menu from './components/Menu';
new Menu('.main__menu-list', '.tabs-content');

import 'air-datepicker/air-datepicker.css';
import AirDatepicker from 'air-datepicker';
import moment from 'moment';

let birthday = new AirDatepicker('#date', {
  autoClose: true,
  position: 'bottom center',
  isMobile: $(window).outerWidth() <= 767,
  maxDate: moment().subtract(18, 'years')
});
$(window).resize(() => {
  let w = $(window).outerWidth();
  birthday.update({
    isMobile: w <= 767
  });
});

import GetData from './components/GetData';
let getData = new GetData();
getData.getLk({
  user: birthday
});

import './components/profile';