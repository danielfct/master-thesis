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

import React from "react";
import "./footer.css"
import { ListGroup, ListGroupItem } from 'react-bootstrap';

const links = [
    {
        href: "https://bitbucket.org/dpimenta/ciai/src/master/Client",
        name: "Repositório Cliente"
    },
    {
        href: "https://bitbucket.org/dpimenta/ciai/src/master/Server",
        name: "Repositório Servidor"
    },
    {
        href: "http://localhost:8080",
        name: "Servidor"
    },
];

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="left">
                <ListGroup className="listGroup">
                    {links.map((link, key) => {
                        return (
                            <ListGroupItem key={key}
                                           className={key === 0 || key === links.length-1 ? "listGroupItem" :
                                               "middleListGroupItem"}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    className="block"
                                >
                                    {link.name}
                                </a>
                            </ListGroupItem>
                        )
                    })}
                </ListGroup>
            </div>
            <p className="right">
          <span>
            &copy; {new Date().getFullYear()}
              {"  "} &bull; {" "}
              <a target="_blank" href="mailto:jc.reis@campus.fct.unl.pt">
              João Reis
            </a>
              {"  "} &bull; {" "}
              <a target="_blank" href="mailto:d.pimenta@campus.fct.unl.pt">
              Daniel Pimenta
            </a>
              {"  "} &bull; {" "}
              <a target="_blank" href="mailto:lg.martins@campus.fct.unl.pt">
              Luis Martins
            </a>
          </span>
            </p>
        </div>
    </footer>
);

export default Footer;
