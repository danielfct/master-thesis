/*
 * Copyright (c) 2020 usmanager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Card from "../../../components/cards/Card";
import CardItem from "../../../components/list/CardItem";
import React from "react";
import {IEdgeHost} from "./EdgeHost";

interface EdgeHostCardProps {
  edgeHost: IEdgeHost;
}

type Props = EdgeHostCardProps;

const EdgeHostCard = ({edgeHost}: Props) => (
  <Card<IEdgeHost> title={edgeHost.hostname}
                   link={{to: {pathname: `/hosts/edge/${edgeHost.hostname }`, state: edgeHost }}}
                   height={'215px'}
                   margin={'10px 0'}
                   hoverable>
    <CardItem key={'sshUsername'}
              label={'Ssh username'}
              value={`${edgeHost.sshUsername}`}/>
    <CardItem key={'sshPassword'}
              label={'Ssh password (base64)'}
              value={`${edgeHost.sshPassword}`}/>
    <CardItem key={'region'}
              label={'Region'}
              value={`${edgeHost.region}`}/>
    <CardItem key={'country'}
              label={'Country'}
              value={`${edgeHost.country}`}/>
    <CardItem key={'city'}
              label={'City'}
              value={`${edgeHost.city}`}/>
    <CardItem key={'local'}
              label={'Local'}
              value={`${edgeHost.local}`}/>
  </Card>
);

export default EdgeHostCard;