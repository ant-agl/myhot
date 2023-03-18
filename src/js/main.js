import 'jquery-mask-plugin';


import './index.js';
import GetData from './GetData';
let getData = new GetData();
getData.getAll();

import Menu from './Menu';
new Menu('.main__menu-list', '.tabs-content');