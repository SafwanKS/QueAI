import React, { useState } from 'react';
import '../css/Tooltip.css';

const Tooltip = ({ text, position = 'bottom', children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
            tabIndex={0}
        >
            {children}

            {isVisible && (
                <div className={`tooltip-tip ${position}`}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;