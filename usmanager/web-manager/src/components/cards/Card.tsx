import React from "react";
import ScrollBar from "react-perfect-scrollbar";
import {Link} from "react-router-dom";
import CardTitle from "../list/CardTitle";

/*$.fn.isolatedScroll = function() {
  this.bind('mousewheel DOMMouseScroll', function (e) {
    var delta = e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail,
      bottomOverflow = this.scrollTop + $(this).outerHeight() - this.scrollHeight >= 0,
      topOverflow = this.scrollTop <= 0;

    if ((delta < 0 && bottomOverflow) || (delta > 0 && topOverflow)) {
      e.preventDefault();
    }
  });
  return this;
};*/

interface CardProps<T> {
  title?: string;
  link?: { to: { pathname: string, state: T }}
  height?: number | string;
  margin?: number | string;
  hoverable?: boolean;
}

type Props<T> = CardProps<T>;

export default class Card<T> extends React.Component<Props<T>, {}> {

  private scrollbar: (ScrollBar | null) = null;

  componentDidMount(): void {
    this.scrollbar?.updateScroll();
  }

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
          <div className={`card gridCard`} style={{height: height || 150}}>
            <ScrollBar ref = {(ref) => { this.scrollbar = ref; }}
                       component="div">
              {link
                ? <Link to={{
                  pathname: link?.to.pathname,
                  state: link?.to.state
                }}>
                  <div className='card-content'>
                    {children}
                  </div>
                </Link>
                : <div className='card-content'>
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