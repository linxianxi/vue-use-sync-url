import{i as j,j as v,r as U}from"./index.22cfd33d.js";const x=d=>{j(()=>{window.addEventListener("popstate",d)}),v(()=>{window.removeEventListener("popstate",d)})};function L(d){return Object.prototype.toString.call(d)==="[object Object]"}const R=d=>{const{mode:h="history",configs:u,onDecode:b}=d,n=U({});function A(){if(h==="history")return window.location.search||"";const i=window.location.hash||"",e=i.indexOf("?");return e>0?i.slice(e):""}function O(i){const e=i.toString();if(h==="history")return`${e?`?${e}`:""}${location.hash||""}`;const t=window.location.hash||"#",a=t.indexOf("?");return a>0?`${t.slice(0,a)}${e?`?${e}`:""}`:`${t}${e?`?${e}`:""}`}function p(){return new URLSearchParams(A())}function f(i){const e=new Set(Object.keys(n));for(const t of i.keys()){const a=i.getAll(t);n[t]=a.length>1?a:i.get(t)||"",e.delete(t)}Array.from(e).forEach(t=>delete n[t])}const w=i=>{const e={};u.forEach(t=>{if(t.decode)if(t.decodeKeys){const a=Object.keys(n).filter(r=>{var o;return(o=t.decodeKeys)==null?void 0:o.includes(r)});a.length&&a.forEach(r=>{e[r]=n[r]})}else t.key in n&&(e[t.key]=t.decode(n[t.key]));else t.key in n&&(e[t.key]=n[t.key])}),b(e,i)},m=p();return m.keys().next().value&&f(m),j(()=>{w(!1)}),x(()=>{f(p()),w(!0)}),{searchParams:n,syncToUrl:i=>{const e=new URLSearchParams("");u.forEach(r=>{var E,S,k;const o=r.key,s=i[o];if(r.encode){const c=r.encode(s);L(c)?Object.keys(c).forEach(l=>{const y=c[l];Array.isArray(y)?y.forEach($=>e.append(o,String($))):e.set(l,String(y))}):Array.isArray(c)?c.forEach(l=>e.append(o,String(l))):e.set(o,String(c))}else if(Array.isArray(s))s.forEach(c=>{if(typeof c=="object"&&s!==null)throw new Error("please check your type or use encode");e.append(o,c)});else{if(typeof s=="object"&&s!==null)throw new Error("please check your type or use encode");const c=(E=r.omitEmptyString)!=null?E:!0,l=(S=r.omitNull)!=null?S:!0,y=(k=r.omitUndefined)!=null?k:!0;s===""?!c&&e.set(o,s):s===null?!l&&e.set(o,s):s===void 0?!y&&e.set(o,s):e.set(o,s)}}),Object.keys(n).forEach(r=>{if(!u.some(o=>o.key===r)){const o=n[r];Array.isArray(o)?o.forEach(s=>e.append(r,s)):e.set(r,o)}}),f(e);const t=O(e);(h==="history"?window.location.search:window.location.hash)!==t&&window.history.pushState(window.history.state,window.document.title,window.location.pathname+t)}}};export{R as u};
