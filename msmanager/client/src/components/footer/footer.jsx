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
