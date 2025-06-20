import { useEffect, useState } from 'react';

const FlowerAnimation: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const styles = `
    .flower-container {
      --dark-color: #000;
      --fl-speed: 0.8s;
    }

    .flower-container * {
      ${!isLoaded ? 'animation-play-state: paused !important;' : ''}
    }

    .flower {
      position: absolute;
      bottom: 2vmin;
      transform-origin: bottom center;
      z-index: 10;
    }

    .flower--1 {
      animation: moving-flower-1 4s linear infinite;
    }
    .flower--1 .flower__line {
      height: 14vmin;
      animation-delay: 0.3s;
    }
    .flower--1 .flower__line__leaf--1 {
      animation: blooming-leaf-right var(--fl-speed) 1.6s backwards;
    }
    .flower--1 .flower__line__leaf--2 {
      animation: blooming-leaf-right var(--fl-speed) 1.4s backwards;
    }
    .flower--1 .flower__line__leaf--3 {
      animation: blooming-leaf-left var(--fl-speed) 1.2s backwards;
    }
    .flower--1 .flower__line__leaf--4 {
      animation: blooming-leaf-left var(--fl-speed) 1s backwards;
    }
    .flower--1 .flower__line__leaf--5 {
      animation: blooming-leaf-right var(--fl-speed) 1.8s backwards;
    }
    .flower--1 .flower__line__leaf--6 {
      animation: blooming-leaf-left var(--fl-speed) 2s backwards;
    }

    .flower--2 {
      left: 50%;
      transform: rotate(20deg);
      animation: moving-flower-2 4s linear infinite;
    }
    .flower--2 .flower__line {
      height: 12vmin;
      animation-delay: 0.6s;
    }
    .flower--2 .flower__line__leaf--1 {
      animation: blooming-leaf-right var(--fl-speed) 1.9s backwards;
    }
    .flower--2 .flower__line__leaf--2 {
      animation: blooming-leaf-right var(--fl-speed) 1.7s backwards;
    }
    .flower--2 .flower__line__leaf--3 {
      animation: blooming-leaf-left var(--fl-speed) 1.5s backwards;
    }
    .flower--2 .flower__line__leaf--4 {
      animation: blooming-leaf-left var(--fl-speed) 1.3s backwards;
    }

    .flower--3 {
      left: 50%;
      transform: rotate(-15deg);
      animation: moving-flower-3 4s linear infinite;
    }
    .flower--3 .flower__line {
      animation-delay: 0.9s;
    }
    .flower--3 .flower__line__leaf--1 {
      animation: blooming-leaf-right var(--fl-speed) 2.5s backwards;
    }
    .flower--3 .flower__line__leaf--2 {
      animation: blooming-leaf-right var(--fl-speed) 2.3s backwards;
    }
    .flower--3 .flower__line__leaf--3 {
      animation: blooming-leaf-left var(--fl-speed) 2.1s backwards;
    }
    .flower--3 .flower__line__leaf--4 {
      animation: blooming-leaf-left var(--fl-speed) 1.9s backwards;
    }

    .flower__leafs {
      position: relative;
      animation: blooming-flower 2s backwards;
    }
    .flower__leafs--1 {
      animation-delay: 1.1s;
    }
    .flower__leafs--2 {
      animation-delay: 1.4s;
    }
    .flower__leafs--3 {
      animation-delay: 1.7s;
    }
    .flower__leafs::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(-50%, -100%);
      width: 1.6vmin;
      height: 1.6vmin;
      background-color: #6bf0ff;
      filter: blur(2vmin);
    }

    .flower__leaf {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 1.6vmin;
      height: 2.2vmin;
      border-radius: 51% 49% 47% 53%/44% 45% 55% 69%;
      background-color: #a7ffee;
      background-image: linear-gradient(to top, #54b8aa, #a7ffee);
      transform-origin: bottom center;
      opacity: 0.9;
      box-shadow: inset 0 0 0.4vmin rgba(255, 255, 255, 0.5);
    }
    .flower__leaf--1 {
      transform: translate(-10%, 1%) rotateY(40deg) rotateX(-50deg);
    }
    .flower__leaf--2 {
      transform: translate(-50%, -4%) rotateX(40deg);
    }
    .flower__leaf--3 {
      transform: translate(-90%, 0%) rotateY(45deg) rotateX(50deg);
    }
    .flower__leaf--4 {
      width: 1.6vmin;
      height: 1.6vmin;
      transform-origin: bottom left;
      border-radius: 0.8vmin 2vmin 0.8vmin 0.8vmin;
      transform: translate(0%, 18%) rotateX(70deg) rotate(-43deg);
      background-image: linear-gradient(to top, #39c6d6, #a7ffee);
      z-index: 1;
      opacity: 0.8;
    }

    .flower__white-circle {
      position: absolute;
      left: -0.7vmin;
      top: -0.6vmin;
      width: 1.8vmin;
      height: 0.8vmin;
      border-radius: 50%;
      background-color: #fff;
    }
    .flower__white-circle::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 60%;
      border-radius: inherit;
      background: linear-gradient(
        90deg,
        rgb(255, 235, 18),
        rgb(255, 206, 0)
      );
    }

    .flower__line {
      height: 11vmin;
      width: 0.3vmin;
      background-image: linear-gradient(
          to left,
          rgba(0, 0, 0, 0.2),
          transparent,
          rgba(255, 255, 255, 0.2)
        ),
        linear-gradient(to top, transparent 10%, #14757a, #39c6d6);
      box-shadow: inset 0 0 0.4vmin rgba(0, 0, 0, 0.5);
      animation: grow-flower-tree 4s backwards;
    }

    .flower__line__leaf {
      --w: 1.4vmin;
      --h: calc(var(--w) + 0.4vmin);
      position: absolute;
      top: 20%;
      left: 90%;
      width: var(--w);
      height: var(--h);
      border-top-right-radius: var(--h);
      border-bottom-left-radius: var(--h);
      background-image: linear-gradient(
        to top,
        rgba(20, 117, 122, 0.4),
        #39c6d6
      );
    }
    .flower__line__leaf--1 {
      transform: rotate(70deg) rotateY(30deg);
    }
    .flower__line__leaf--2 {
      top: 45%;
      transform: rotate(70deg) rotateY(30deg);
    }
    .flower__line__leaf--3,
    .flower__line__leaf--4,
    .flower__line__leaf--6 {
      border-top-right-radius: 0;
      border-bottom-left-radius: 0;
      border-top-left-radius: var(--h);
      border-bottom-right-radius: var(--h);
      left: -460%;
      top: 12%;
      transform: rotate(-70deg) rotateY(30deg);
    }
    .flower__line__leaf--4 {
      top: 40%;
    }
    .flower__line__leaf--5 {
      top: 0;
      transform-origin: left;
      transform: rotate(70deg) rotateY(30deg) scale(0.6);
    }
    .flower__line__leaf--6 {
      top: -2%;
      left: -450%;
      transform-origin: right;
      transform: rotate(-70deg) rotateY(30deg) scale(0.6);
    }

    .flower__light {
      position: absolute;
      bottom: 0vmin;
      width: 0.2vmin;
      height: 0.2vmin;
      background-color: rgb(255, 251, 0);
      border-radius: 50%;
      filter: blur(0.04vmin);
      animation: light-ans 4s linear infinite backwards;
    }
    .flower__light:nth-child(odd) {
      background-color: #23f0ff;
    }
    .flower__light--1 {
      left: -0.4vmin;
      animation-delay: 1s;
    }
    .flower__light--2 {
      left: 0.6vmin;
      animation-delay: 0.5s;
    }
    .flower__light--3 {
      left: -1.2vmin;
      animation-delay: 0.3s;
    }
    .flower__light--4 {
      left: 1.2vmin;
      animation-delay: 0.9s;
    }
    .flower__light--5 {
      left: -0.2vmin;
      animation-delay: 1.5s;
    }
    .flower__light--6 {
      left: -0.8vmin;
      animation-delay: 3s;
    }
    .flower__light--7 {
      left: 0.6vmin;
      animation-delay: 2s;
    }
    .flower__light--8 {
      left: -1.2vmin;
      animation-delay: 3.5s;
    }

    .grow-ans {
      animation: grow-ans 2s var(--d) backwards;
    }

    @keyframes grow-ans {
      0% {
        transform: scale(0);
        opacity: 0;
      }
    }

    @keyframes light-ans {
      0% {
        opacity: 0;
        transform: translateY(0vmin);
      }
      25% {
        opacity: 1;
        transform: translateY(-1vmin) translateX(-0.4vmin);
      }
      50% {
        opacity: 1;
        transform: translateY(-3vmin) translateX(0.4vmin);
        filter: blur(0.04vmin);
      }
      75% {
        transform: translateY(-4vmin) translateX(-0.4vmin);
        filter: blur(0.04vmin);
      }
      100% {
        transform: translateY(-6vmin);
        opacity: 0;
        filter: blur(0.2vmin);
      }
    }

    @keyframes moving-flower-1 {
      0%,
      100% {
        transform: rotate(2deg);
      }
      50% {
        transform: rotate(-2deg);
      }
    }

    @keyframes moving-flower-2 {
      0%,
      100% {
        transform: rotate(18deg);
      }
      50% {
        transform: rotate(14deg);
      }
    }

    @keyframes moving-flower-3 {
      0%,
      100% {
        transform: rotate(-18deg);
      }
      50% {
        transform: rotate(-20deg) rotateY(-10deg);
      }
    }

    @keyframes blooming-leaf-right {
      0% {
        transform-origin: left;
        transform: rotate(70deg) rotateY(30deg) scale(0);
      }
    }

    @keyframes blooming-leaf-left {
      0% {
        transform-origin: right;
        transform: rotate(-70deg) rotateY(30deg) scale(0);
      }
    }

    @keyframes grow-flower-tree {
      0% {
        height: 0;
        border-radius: 0.2vmin;
      }
    }

    @keyframes blooming-flower {
      0% {
        transform: scale(0);
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="flower-container mt-64 scale-[1.6] transform-gpu">
        <div className="relative">
          <div className="flower flower--1">
            <div className="flower__leafs flower__leafs--1">
              <div className="flower__leaf flower__leaf--1"></div>
              <div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div>
              <div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>

              <div className="flower__light flower__light--1"></div>
              <div className="flower__light flower__light--2"></div>
              <div className="flower__light flower__light--3"></div>
              <div className="flower__light flower__light--4"></div>
              <div className="flower__light flower__light--5"></div>
              <div className="flower__light flower__light--6"></div>
              <div className="flower__light flower__light--7"></div>
              <div className="flower__light flower__light--8"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div>
              <div className="flower__line__leaf flower__line__leaf--2"></div>
              <div className="flower__line__leaf flower__line__leaf--3"></div>
              <div className="flower__line__leaf flower__line__leaf--4"></div>
              <div className="flower__line__leaf flower__line__leaf--5"></div>
              <div className="flower__line__leaf flower__line__leaf--6"></div>
            </div>
          </div>

          <div className="flower flower--2">
            <div className="flower__leafs flower__leafs--2">
              <div className="flower__leaf flower__leaf--1"></div>
              <div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div>
              <div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>

              <div className="flower__light flower__light--1"></div>
              <div className="flower__light flower__light--2"></div>
              <div className="flower__light flower__light--3"></div>
              <div className="flower__light flower__light--4"></div>
              <div className="flower__light flower__light--5"></div>
              <div className="flower__light flower__light--6"></div>
              <div className="flower__light flower__light--7"></div>
              <div className="flower__light flower__light--8"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div>
              <div className="flower__line__leaf flower__line__leaf--2"></div>
              <div className="flower__line__leaf flower__line__leaf--3"></div>
              <div className="flower__line__leaf flower__line__leaf--4"></div>
            </div>
          </div>

          <div className="flower flower--3">
            <div className="flower__leafs flower__leafs--3">
              <div className="flower__leaf flower__leaf--1"></div>
              <div className="flower__leaf flower__leaf--2"></div>
              <div className="flower__leaf flower__leaf--3"></div>
              <div className="flower__leaf flower__leaf--4"></div>
              <div className="flower__white-circle"></div>

              <div className="flower__light flower__light--1"></div>
              <div className="flower__light flower__light--2"></div>
              <div className="flower__light flower__light--3"></div>
              <div className="flower__light flower__light--4"></div>
              <div className="flower__light flower__light--5"></div>
              <div className="flower__light flower__light--6"></div>
              <div className="flower__light flower__light--7"></div>
              <div className="flower__light flower__light--8"></div>
            </div>
            <div className="flower__line">
              <div className="flower__line__leaf flower__line__leaf--1"></div>
              <div className="flower__line__leaf flower__line__leaf--2"></div>
              <div className="flower__line__leaf flower__line__leaf--3"></div>
              <div className="flower__line__leaf flower__line__leaf--4"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlowerAnimation;
