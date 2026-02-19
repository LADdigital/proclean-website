import{r as a,j as e,X as T,S as U}from"./index-BoNhX6Li.js";const M="https://hook.us2.make.com/ef4ytowuiw45sn7qp1h7cstinxdkcgds",R="https://procleanautodetailing.setmore.com/",k="[[SHOW_BOOK_BUTTON]]";function g(){return e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:"w-6 h-6",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})}function _(t){const s=document.createElement("div");return s.innerHTML=t,s.querySelectorAll("script, iframe, object, embed, form").forEach(l=>l.remove()),s.querySelectorAll("*").forEach(l=>{Array.from(l.attributes).forEach(o=>{(o.name.startsWith("on")||o.value.includes("javascript:"))&&l.removeAttribute(o.name)})}),s.innerHTML}function $(t){let s=t.bot_message||"";const n=s.includes(k);return s=s.replace(k,"").trim(),s=_(s),{content:s,showBookButton:n}}function E(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const s=Math.random()*16|0;return(t==="x"?s:s&3|8).toString(16)})}async function A(t,s){try{const n=await fetch(M,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t,session_id:s})});if(!n.ok)throw new Error(`Webhook error: ${n.statusText}`);return await n.json()}catch(n){return console.error("Chatbot webhook error:",n),null}}function D({message:t,prefersReducedMotion:s}){const n=t.role==="user",c=s?"":"animate-fadeInUp";return e.jsxs("div",{className:`flex flex-col ${n?"items-end":"items-start"} ${c}`,children:[e.jsx("div",{className:`max-w-[85%] px-4 py-3 rounded-2xl ${n?"bg-white/10 backdrop-blur-sm border-r-2 border-brand-red/50 text-white":"bg-white/5 backdrop-blur-sm text-stone-200"}`,children:n?e.jsx("p",{className:"text-sm leading-relaxed",children:t.content}):e.jsx("div",{className:"text-sm leading-relaxed prose prose-invert prose-sm max-w-none",dangerouslySetInnerHTML:{__html:t.content}})}),t.showBookButton&&e.jsx("a",{href:R,target:"_blank",rel:"noopener noreferrer",className:"mt-3 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-red-900/30 transition-all text-center",children:"Book Now"})]})}function H({prefersReducedMotion:t}){return e.jsx("div",{className:"flex items-start",children:e.jsx("div",{className:"bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3",children:e.jsx("div",{className:"flex gap-1",children:[0,1,2].map(s=>e.jsx("div",{className:"w-2 h-2 rounded-full bg-stone-400",style:{animation:t?"none":`pulse 1.4s ease-in-out ${s*.2}s infinite`}},s))})})})}function W(){const[t,s]=a.useState(!1),[n,c]=a.useState([]),[l,f]=a.useState(""),[o,w]=a.useState(!1),[d,y]=a.useState(!1),[C,I]=a.useState(()=>E()),S=a.useRef(null),B=a.useRef(null),v=a.useRef(null),p=a.useRef(null);a.useEffect(()=>{const r=window.matchMedia("(prefers-reduced-motion: reduce)");y(r.matches);const i=u=>y(u.matches);return r.addEventListener("change",i),()=>r.removeEventListener("change",i)},[]);const j=a.useCallback(()=>{p.current&&p.current.scrollIntoView({behavior:d?"auto":"smooth"})},[d]);a.useEffect(()=>{j()},[n,o,j]);const h=a.useCallback(()=>{s(!1)},[]);a.useEffect(()=>{const r=i=>{i.key==="Escape"&&t&&h()};if(t)return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},[t,h]),a.useEffect(()=>{t&&(n.length===0&&I(E()),setTimeout(()=>{var r;return(r=v.current)==null?void 0:r.focus()},100))},[t,n.length]);const N=async()=>{const r=l.trim();if(!r||o)return;const i={role:"user",content:r};c(m=>[...m,i]),f(""),w(!0);const u=await A(r,C);let b;if(u&&u.bot_message){const{content:m,showBookButton:O}=$(u);b={role:"assistant",content:m,showBookButton:O}}else b={role:"assistant",content:"Sorry, we're having trouble connecting right now. Please call us directly at 509-454-9299."};c(m=>[...m,b]),w(!1)},L=r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),N())},x=d?"":"transition-all duration-300";return e.jsxs(e.Fragment,{children:[e.jsx("button",{ref:B,onClick:()=>s(!t),"aria-label":"Open chat assistant","aria-expanded":t,className:"fixed bottom-6 right-6 z-[9999] group",children:e.jsxs("div",{className:`relative w-14 h-14 flex items-center justify-center text-white cursor-pointer
            ${x}
            ${t?"scale-95":"scale-100 hover:scale-110"}
          `,children:[e.jsx("div",{className:`absolute inset-0 rounded-full bg-gradient-to-br from-brand-red to-brand-orange opacity-0 blur-xl
              ${x}
              ${t?"opacity-70":"group-hover:opacity-50"}
            `}),e.jsx("div",{className:`absolute inset-0 rounded-full bg-gradient-to-br from-brand-red to-brand-orange border border-white/60
              ${x}
            `,style:{boxShadow:"0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(185, 28, 28, 0.3)"}}),e.jsx("div",{className:`relative z-10 ${x}`,children:e.jsx(g,{})})]})}),t&&e.jsx("div",{className:"fixed inset-0 z-[9998]",onClick:h,"aria-hidden":"true"}),e.jsxs("div",{ref:S,className:`fixed z-[10000] flex flex-col bg-brand-charcoal/95 backdrop-blur-[12px] border border-white/10 shadow-2xl
          max-w-sm w-full mx-4
          ${x}
          ${t?"opacity-100 pointer-events-auto translate-y-0 lg:translate-x-0":"opacity-0 pointer-events-none max-lg:translate-y-full lg:translate-x-full"}
          lg:bottom-24 lg:right-6 lg:rounded-2xl lg:h-[600px]
          max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:mx-0 max-lg:rounded-t-3xl max-lg:h-[85vh]
        `,role:"dialog","aria-modal":"true","aria-labelledby":"chatbot-title",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 sm:p-5 border-b border-white/10",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-brand-red to-brand-orange text-white",children:e.jsx(g,{})}),e.jsxs("div",{children:[e.jsx("h2",{id:"chatbot-title",className:"text-sm sm:text-base font-semibold text-white",children:"Pro Clean Assistant"}),e.jsx("p",{className:"text-xs text-stone-400",children:"Here to help"})]})]}),e.jsx("button",{onClick:h,"aria-label":"Close chat",className:"p-2 text-stone-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red rounded-lg",children:e.jsx(T,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-4 space-y-4",children:[n.length===0&&e.jsxs("div",{className:"flex flex-col items-center justify-center h-full text-center px-4",children:[e.jsx("div",{className:"w-16 h-16 rounded-full bg-gradient-to-r from-brand-red to-brand-orange flex items-center justify-center mb-4",children:e.jsx(g,{})}),e.jsx("h3",{className:"text-white font-semibold mb-2",children:"Welcome!"}),e.jsx("p",{className:"text-stone-400 text-sm leading-relaxed",children:"Ask us about our detailing services, pricing, or book an appointment."})]}),n.map((r,i)=>e.jsx(D,{message:r,prefersReducedMotion:d},i)),o&&e.jsx(H,{prefersReducedMotion:d}),e.jsx("div",{ref:p})]}),e.jsxs("div",{className:"p-4 border-t border-white/10",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{ref:v,type:"text",value:l,onChange:r=>f(r.target.value),onKeyDown:L,placeholder:"Type your message...",disabled:o,className:"flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/30 text-sm disabled:opacity-50","aria-label":"Chat message input"}),e.jsx("button",{onClick:N,disabled:o||!l.trim(),className:"px-4 py-3 bg-gradient-to-r from-brand-red to-brand-orange text-white rounded-xl hover:shadow-lg hover:shadow-red-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed","aria-label":"Send message",children:e.jsx(U,{className:"w-5 h-5"})})]}),e.jsxs("p",{className:"text-xs text-stone-500 text-center mt-2",children:["Powered by ",e.jsx("a",{href:"https://laddigitalofyakima.com",target:"_blank",rel:"noopener noreferrer",className:"text-stone-400 hover:text-white transition-colors underline",children:"LAD Digital"})]})]})]}),e.jsx("style",{children:`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out;
        }

        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fadeInUp {
            animation: none;
          }
        }
      `})]})}export{W as default};
