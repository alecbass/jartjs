import "./style.css";
import heroImg from "./assets/hero.png";
import typescriptLogo from "./assets/typescript.svg";
import viteLogo from "./assets/vite.svg";
import { setupCounter } from "./counter.ts";
import { createOrUpdateRoot } from "./jsx-runtime.ts";
import { Component } from "./Component.tsx";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.tsx</code> and save to test <code>HMR</code></p>
  </div>
</section>

<button id="counter" type="button" class="counter"></button>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const centerSection = document.querySelector("#center")!;
// const divJsx = (
//   <div
//     id="jsx-root"
//     title="Div"
//     className="parent"
//     style={{ display: "flex", color: "#FFFFFF" }}
//   >
//     First bit of text
//     <div title="Child" />
//     <div title="Second child">
//       <span
//         title="Second child element"
//         className="test"
//         style={{ color: "blue" }}
//       >
//         <span>Sub-Child of the second element</span>
//       </span>
//     </div>
//     Second bit of text
//   </div>
// );
// createOrUpdateRoot(divJsx, centerSection);
// createOrUpdateRoot(
//   <div>
//     Replaced child<span>With a sibling</span>
//   </div>,
//   centerSection,
// );
createOrUpdateRoot(
  <Component
    title="Function component"
    renderLastChild={() => <div>This is rendered by a prop function</div>}
  >
    yeah<span>Another</span>
  </Component>,
  centerSection,
);

const button = document.querySelector("#counter")! as HTMLButtonElement;
let clickCount = 0;

button.addEventListener("click", () => {
  createOrUpdateRoot(<div>Clicked {++clickCount} times</div>, centerSection);
});
