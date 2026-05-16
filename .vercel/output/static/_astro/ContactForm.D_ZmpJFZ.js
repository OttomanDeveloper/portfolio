import{r as u}from"./index.CO9X3OiW.js";var p={exports:{}},o={};var f;function g(){if(f)return o;f=1;var l=Symbol.for("react.transitional.element"),d=Symbol.for("react.fragment");function a(n,r,t){var i=null;if(t!==void 0&&(i=""+t),r.key!==void 0&&(i=""+r.key),"key"in r){t={};for(var s in r)s!=="key"&&(t[s]=r[s])}else t=r;return r=t.ref,{$$typeof:l,type:n,key:i,ref:r!==void 0?r:null,props:t}}return o.Fragment=d,o.jsx=a,o.jsxs=a,o}var h;function v(){return h||(h=1,p.exports=g()),p.exports}var e=v();function j({to:l}){const d=u.useRef(Date.now()),[a,n]=u.useState("idle"),[r,t]=u.useState(null);u.useEffect(()=>{d.current=Date.now()},[]);async function i(s){s.preventDefault(),n("sending"),t(null);const c=new FormData(s.currentTarget),b={from:String(c.get("from")??""),about:String(c.get("about")??""),body:String(c.get("body")??""),website:String(c.get("website")??""),startedAt:d.current};try{const m=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(b)});if(!m.ok){const x=await m.json().catch(()=>({}));t(typeof x.error=="string"?x.error:"couldn't send. try again or email me directly."),n("error");return}n("sent")}catch{t("network error. try again or email me directly."),n("error")}}return a==="sent"?e.jsx("div",{className:"cf",role:"status","aria-live":"polite",children:e.jsx("p",{className:"ok",children:"✓ sent. i'll reply within ~24h."})}):e.jsxs("form",{className:"cf",onSubmit:i,noValidate:!0,children:[e.jsx("input",{type:"text",name:"website",tabIndex:-1,autoComplete:"off","aria-hidden":"true",style:{position:"absolute",left:"-9999px",width:1,height:1}}),e.jsxs("label",{className:"ln",children:[e.jsx("span",{className:"k",children:"from:"}),e.jsx("input",{name:"from",type:"email",required:!0,placeholder:"your@email.com"})]}),e.jsxs("label",{className:"ln",children:[e.jsx("span",{className:"k",children:"about:"}),e.jsx("input",{name:"about",type:"text",required:!0,minLength:2,maxLength:120,placeholder:"role · contract · advice · just saying hi"})]}),e.jsxs("label",{className:"ln",children:[e.jsx("span",{className:"k",children:"body:"}),e.jsx("textarea",{name:"body",required:!0,minLength:10,maxLength:4e3,placeholder:"i'll read every message and reply within ~24h"})]}),e.jsx("button",{type:"submit",disabled:a==="sending",children:a==="sending"?"▸ sending…":"▸ send"}),r&&e.jsx("p",{className:"err",role:"alert",children:r}),e.jsxs("p",{className:"fallback",children:["or email me directly: ",e.jsx("a",{href:`mailto:${l}`,children:l})]}),e.jsx("style",{children:`
        .cf {
          margin-top: 12px; padding: 18px 20px;
          background: var(--bg-elev); border: 1px solid var(--border-soft);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono); font-size: var(--fs-base);
        }
        .ln { display: block; padding: 4px 0; }
        .k { color: var(--key); display: inline-block; min-width: 64px; }
        .cf input, .cf textarea {
          background: var(--bg); border: 1px solid var(--border-soft);
          color: var(--fg); font-family: inherit; font-size: inherit;
          padding: 6px 10px; border-radius: var(--radius-sm);
          width: 100%; max-width: 320px; outline: none;
        }
        .cf textarea { width: 100%; max-width: 480px; min-height: 80px; }
        .cf input:focus, .cf textarea:focus { border-color: var(--accent); }
        .cf button {
          margin-top: 10px; padding: 8px 16px;
          background: var(--accent); color: var(--bg);
          border: 0; border-radius: var(--radius-sm);
          font: inherit; font-weight: 600; cursor: pointer;
          min-height: 44px;
        }
        .cf button:disabled { opacity: 0.6; cursor: progress; }
        .err { color: var(--alert); margin-top: 8px; font-size: var(--fs-sm); }
        .ok { color: var(--accent); margin: 0; }
        .fallback { color: var(--fg-dim); font-size: var(--fs-sm); margin-top: 8px; }
      `})]})}export{j as default};
