import React from 'react';

const DoodleBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-yellow-50">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    animation: 'slide 20s linear infinite'
                }}
            />

            {/* Floating Doodles */}
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <style>
                    {`
                        @keyframes float {
                            0% { transform: translateY(0px) rotate(0deg); }
                            50% { transform: translateY(-20px) rotate(10deg); }
                            100% { transform: translateY(0px) rotate(0deg); }
                        }
                        @keyframes wiggle {
                            0% { transform: rotate(-5deg); }
                            50% { transform: rotate(5deg); }
                            100% { transform: rotate(-5deg); }
                        }
                        @keyframes drift {
                            0% { transform: translate(0, 0) rotate(0deg); }
                            33% { transform: translate(10px, -10px) rotate(5deg); }
                            66% { transform: translate(-5px, 10px) rotate(-5deg); }
                            100% { transform: translate(0, 0) rotate(0deg); }
                        }
                        .doodle { animation: float 6s ease-in-out infinite; }
                        .doodle-fast { animation: float 4s ease-in-out infinite; }
                        .doodle-slow { animation: float 8s ease-in-out infinite; }
                        .wiggle { animation: wiggle 3s ease-in-out infinite; }
                        .drift { animation: drift 10s ease-in-out infinite; }
                    `}
                </style>

                {/* Original Doodles */}
                <svg x="10%" y="15%" overflow="visible">
                    <circle r="20" fill="none" stroke="#FF6B6B" strokeWidth="3" className="doodle" opacity="0.6" />
                </svg>

                <svg x="85%" y="10%" overflow="visible">
                    <path d="M0 0 L3 8 L12 9 L5 15 L7 24 L0 20 L-7 24 L-5 15 L-12 9 L-3 8 Z"
                        fill="none" stroke="#4ECDC4" strokeWidth="3" className="doodle-fast" opacity="0.6" />
                </svg>

                <svg x="15%" y="60%" overflow="visible">
                    <path d="M-40 0 Q -20 -50, 0 0 T 40 0" fill="none" stroke="#FFE66D" strokeWidth="4" className="wiggle" opacity="0.6" />
                </svg>

                <svg x="25%" y="35%" overflow="visible">
                    <path d="M-20 -20 L0 20 L-40 20 Z" fill="none" stroke="#FF6B6B" strokeWidth="3" className="doodle" opacity="0.5" />
                </svg>

                <svg x="75%" y="65%" overflow="visible">
                    <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#1A535C" strokeWidth="3" className="doodle-fast" opacity="0.5" />
                </svg>

                <svg x="8%" y="80%" overflow="visible">
                    <path d="M-20 0 L20 0 L10 -5 M20 0 L10 5" stroke="#FF6B6B" strokeWidth="3" fill="none" transform="rotate(-45)" className="doodle" opacity="0.6" />
                </svg>

                {/* New Doodles */}

                {/* Spiral (Top Right) */}
                <svg x="90%" y="5%" overflow="visible">
                    <path d="M-10,-10 A 10,10 0 1,1 10,10 A 20,20 0 1,1 -30,-30" fill="none" stroke="#9B5DE5" strokeWidth="3" className="drift" opacity="0.5" />
                </svg>

                {/* Cloud (Bottom Right) */}
                <svg x="85%" y="85%" overflow="visible">
                    <path d="M-40,10 Q-40,-10 -20,-10 Q-10,-30 10,-10 Q30,-10 30,10 Q40,10 40,30 Q40,50 20,50 L-20,50 Q-40,50 -40,30 Z" fill="none" stroke="#00BBF9" strokeWidth="3" className="doodle-slow" opacity="0.5" />
                </svg>

                {/* Lightning (Left Middle) */}
                <svg x="5%" y="40%" overflow="visible">
                    <path d="M10,-15 L-10,15 L5,15 L-5,45 L25,10 L10,10 Z" fill="none" stroke="#FEE440" strokeWidth="3" className="wiggle" opacity="0.6" />
                </svg>

                {/* Heart (Center Top) */}
                <svg x="50%" y="8%" overflow="visible">
                    <path d="M-20,-15 A10,10 0,0,1 0,-15 A10,10 0,0,1 20,-15 Q20,0 0,20 Q-20,0 -20,-15 Z" fill="none" stroke="#F15BB5" strokeWidth="3" className="doodle" opacity="0.5" />
                </svg>

                {/* Musical Note (Center Bottom) */}
                <svg x="45%" y="90%" overflow="visible">
                    <path d="M-10,15 L-10,-15 L10,-15 L10,10 M-10,15 A5,5 0 1,1 -20,15 A5,5 0 1,1 -10,15 M10,10 A5,5 0 1,1 0,10 A5,5 0 1,1 10,10" fill="none" stroke="#00F5D4" strokeWidth="3" className="doodle-fast" opacity="0.6" />
                </svg>

                {/* Smiley (Right Middle) */}
                <svg x="92%" y="45%" overflow="visible">
                    <g className="doodle" opacity="0.5">
                        <circle cx="0" cy="0" r="20" fill="none" stroke="#FB5607" strokeWidth="3" />
                        <circle cx="-7" cy="-5" r="2" fill="#FB5607" />
                        <circle cx="7" cy="-5" r="2" fill="#FB5607" />
                        <path d="M-10,5 Q0,15 10,5" fill="none" stroke="#FB5607" strokeWidth="2" />
                    </g>
                </svg>

                {/* Cube (Left Bottom) */}
                <svg x="5%" y="70%" overflow="visible">
                    <path d="M-15,-10 L5,-10 L15,-20 L-5,-20 Z M-15,-10 L-15,10 L5,10 L5,-10 Z M5,10 L15,0 L15,-20 M5,-10 L15,-20" fill="none" stroke="#3A86FF" strokeWidth="3" className="drift" opacity="0.5" />
                </svg>

                {/* Zigzag (Top Left) */}
                <svg x="20%" y="10%" overflow="visible">
                    <path d="M-20,10 L-10,-10 L0,10 L10,-10 L20,10" fill="none" stroke="#8338EC" strokeWidth="3" className="wiggle" opacity="0.6" />
                </svg>

                {/* Random Dots */}
                <svg x="15%" y="85%" overflow="visible"><circle r="5" fill="#FF006E" opacity="0.4" className="doodle-fast" /></svg>
                <svg x="85%" y="15%" overflow="visible"><circle r="8" fill="#3A86FF" opacity="0.4" className="doodle-slow" /></svg>
                <svg x="55%" y="50%" overflow="visible"><circle r="4" fill="#FFBE0B" opacity="0.4" className="doodle" /></svg>
                <svg x="35%" y="25%" overflow="visible"><circle r="6" fill="#00BBF9" opacity="0.4" className="doodle-slow" /></svg>
                <svg x="65%" y="75%" overflow="visible"><circle r="5" fill="#9B5DE5" opacity="0.4" className="wiggle" /></svg>
            </svg>
        </div>
    );
};

export default DoodleBackground;
