import{h as u,u as w,i as j}from"./index.1d775f90.js";const E=n=>{window.addEventListener("popstate",n),u(()=>{window.removeEventListener("popstate",n)})};function g(n){return Object.prototype.toString.call(n)==="[object Object]"}function A(n){return{true:!0,false:!1}[n]}const O=({configs:n,onDecodeSuccess:i})=>{const y=w(),d=j(),a=r=>{const t=new URL(location.href).searchParams,e={};for(const o of t.keys()){const s=t.getAll(o);e[o]=s.length>1?s:t.get(o)||""}n.forEach(o=>{const s=t.getAll(o.name);if(s.length>1)o.decode(s,e,r);else{const c=t.get(o.name);o.decode(c,e,r)}}),i==null||i(r)},h=(r,t,e,o=!0,s=!0,c=!0)=>{if(Array.isArray(e))e.forEach(l=>{if(typeof l=="object"&&l!==null)throw new Error("please check type");r.append(t,String(l))});else{if(typeof e=="object"&&e!==null)throw new Error("please check type");e===""?o?r.delete(t):r.set(t,e):e===null?s?r.delete(t):r.set(t,String(e)):e===void 0&&c?r.delete(t):r.set(t,String(e))}},b=r=>{const t=new URL(location.href);if(n.forEach(({name:e,encode:o,omitEmptyString:s,omitNull:c,omitUndefined:l})=>{const f=o();if(g(f)){if(!Object.keys(f).length){t.searchParams.delete(e);return}Object.keys(f).forEach(p=>{h(t.searchParams,p,f[p],s,c,l)})}else h(t.searchParams,e,f,s,c,l)}),r)if(Array.isArray(r))r.forEach(({name:e,value:o,omitEmptyString:s,omitNull:c,omitUndefined:l})=>{h(t.searchParams,e,o,s,c,l)});else{const e=Object.keys(r);e.length&&e.forEach(o=>{h(t.searchParams,o,r[o])})}location.search!==t.search&&d.push(y.path+t.search)};return a(!1),E(()=>{a(!0)}),b};export{A as t,O as u};
