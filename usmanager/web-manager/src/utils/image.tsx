/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  FaAddressCard,
  FaCodeBranch,
  FaDatabase,
  FaDocker,
  FaFingerprint, FaGlobeAmericas, FaGlobeEurope, FaIdBadge, FaMapMarkedAlt,
  FaMapMarkerAlt, FaMapPin,
  FaMinus,
  FaThumbsDown,
  FaThumbsUp
} from "react-icons/all";
import {FaDoorOpen} from "react-icons/all";
import {FaDoorClosed} from "react-icons/all";
import React from "react";
import {IRegion} from "../routes/region/Region";

export const mapLabelToMaterialIcon = (label: string, value: any): string | JSX.Element => {
  label = label.toLowerCase();
  if (label === 'defaultdb') {
    return <FaDatabase></FaDatabase>;
  }
  if (label === 'id') {
    return <FaFingerprint/>
  }
  if (label === 'state') {
    switch (value) {
      case 'ready': return <FaThumbsUp></FaThumbsUp>;
      case 'down': return <FaThumbsDown></FaThumbsDown>;
      case 'drain': return <FaMinus></FaMinus>;
    }
  }
  if (label === 'username') {
    return "account_circle";
  }
  if (label === 'region') {
    if (value === undefined) {
      return <FaMapMarkerAlt></FaMapMarkerAlt>;
    }
    const region = value as IRegion;
    if (region.name.includes('us')) {
      return <FaGlobeAmericas></FaGlobeAmericas>;
    }
    if (region.name.includes('eu')) {
      return <FaGlobeEurope></FaGlobeEurope>;
    }
  }
  if (label === 'country') {
    return <FaMapMarkedAlt></FaMapMarkedAlt>;
  }
  if (label === 'city') {
    return <FaMapPin></FaMapPin>;
  }
  if (label.includes('privateip')) {
    return <FaIdBadge></FaIdBadge>;
  }
  if (label.includes('publicip')) {
    return <FaAddressCard></FaAddressCard>;
  }
  if (label.includes('time')) {
    return "access_time";
  }
  if (label.includes('date')) {
    return "date_range";
  }
  if (label.includes('command')) {
    return "text_fields";
  }
  if (label.includes('host')) {
    return 'devices';
  }
  if (label.includes('file')) {
    return 'file_upload';
  }
  if (label.includes('name')) {
    return "text_fields";
  }
  if (label.includes('external')) {
    return <FaDoorOpen></FaDoorOpen>;
  }
  if (label.includes('internal')) {
    return <FaDoorClosed></FaDoorClosed>;
  }
  if (label.includes('memory')) {
    return 'memory';
  }
  if (label.includes('label')) {
    return 'label';
  }
  if (label.includes('service')) {
    return 'layers';
  }
  if (label.includes('docker')) {
    return <FaDocker></FaDocker>;
  }

  if (label.includes('password')) {
    return 'vpn_key';
  }
  if (label.includes('version')) {
    return <FaCodeBranch></FaCodeBranch>;
  }
  if (value === true) {
    return "check";
  }
  if (value === false) {
    return "clear";
  }
  return "account_circle";
}

export const mapLabelToBootstrapIcon = (label: string, value: any): string => {
  //TODO
  return 'glyphicon glyphicon-asterisk';
}