import React, { useState, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import Empty from "../Empty";

export default function AnimatedList(props) {
    const {list, show} = props;
    const [rows, set] = useState(list);
    useEffect(() => set(list),[list]);

    let height = 0;
    const transitions = useTransition(
        rows.map(data => ({ data, height: 25, y: (height += 25) - 25 })),
        item => item.data,
        {
            enter: ({ y, height }) => ({ y, height, opacity: 1 }),
            update: ({ y, height }) => ({ y, height })
        }
    );
    return (
        <div style={{ height }}>
            {transitions.map(({item, props: {y, ...rest}, key}, index) => (
                <animated.div
                    key={key}
                    style={{
                        zIndex: list.length - index,
                        transform: y.interpolate(y => `translate3d(0, ${y}px, 0)`), ...rest
                    }}>
                    {show(item.data)}
                </animated.div>
            ))}
        </div>
    )
}