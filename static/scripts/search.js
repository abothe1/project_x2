/*************************************************************************
 *
 * BANDA CONFIDENTIAL
 * __________________
 *
 *  Copyright (C) 2019
 *  Banda Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Banda Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Banda Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Banda Incorporated.
 *
*************************************************************************/

var state = 0;

function changeState(newState){
  if(newState == state){
    // do nothing
  }else{
    var m = document.getElementById("m");
    var mv = document.getElementById("mv");
    var v = document.getElementById("v");

    switch(newState){
      case 0:
        m.src = "../static/assets/Search/m_filter_selected.png";
        mv.src = "../static/assets/Search/mv_filter.png"
        v.src = "../static/assets/Search/v_filter.png"
        state = 0;
        filterResults();
        break;
      case 1:
        m.src = "../static/assets/Search/m_filter.png";
        mv.src = "../static/assets/Search/mv_filter_selected.png"
        v.src = "../static/assets/Search/v_filter.png"
        state = 1;
        filterResults();
        break;
      case 2:
        m.src = "../static/assets/Search/m_filter.png";
        mv.src = "../static/assets/Search/mv_filter.png"
        v.src = "../static/assets/Search/v_filter_selected.png"
        state = 2;
        filterResults();
        break;
    }
  }
}


function filterResults(){
  console.log(state);
}
