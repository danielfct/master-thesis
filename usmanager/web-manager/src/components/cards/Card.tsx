import React, {createRef, WheelEventHandler} from "react";
import ScrollBar from "react-perfect-scrollbar";
import {Link} from "react-router-dom";
import CardTitle from "../list/CardTitle";



interface CardProps<T> {
  title?: string;
  link?: { to: { pathname: string, state: T }}
  height?: number | string;
  margin?: number | string;
  hoverable?: boolean;
}

type Props<T> = CardProps<T>;

export default class Card<T> extends React.Component<Props<T>, {}> {

  DEFAULT_HEIGHT = 150;

  private scrollbar: (ScrollBar | null) = null;
  private card = createRef<HTMLDivElement>();
  private cardContent = createRef<HTMLDivElement>();

  componentDidMount(): void {
    this.scrollbar?.updateScroll();
    this.blockBodyScroll();
  }

  private blockBodyScroll = () => {
    const cardContent = this.cardContent.current;
    let height = this.props.height || this.DEFAULT_HEIGHT;
    if (typeof height == 'string') {
      height = height.replace(/[^0-9]/g,'');
    }
    if (cardContent && cardContent.scrollHeight > height) {
      this.card.current?.addEventListener('wheel', event => event.preventDefault())
    }
  };

  render() {
    const {title, link, height, margin, hoverable, children} = this.props;
    return (
      <div className={`col s6 m4 l3`} style={{margin}}>
        <div className={hoverable ? 'hoverable' : undefined}>
          {title && (
            link
              ? <Link to={{
                pathname: link?.to.pathname,
                state: link?.to.state}}>
                <CardTitle title={title}/>
              </Link>
              : <CardTitle title={title}/>
          )}
          <div className={`card gridCard`}
               style={{height: height || 150}}
               ref={this.card}>
            <ScrollBar ref = {(ref) => { this.scrollbar = ref; }}
                       component="div">
              {link
                ? <Link to={{
                  pathname: link?.to.pathname,
                  state: link?.to.state
                }}>
                  <div className='card-content' ref={this.cardContent}>
                    {children}
                  </div>
                </Link>
                : <div className='card-content' ref={this.cardContent}>
                  {children}
                </div>
              }
            </ScrollBar>
          </div>
        </div>
      </div>
    );
  }
}