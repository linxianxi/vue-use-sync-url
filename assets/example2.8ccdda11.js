import{u as _}from"./useSyncUrl.746468f7.js";import{d as i,r as p,a as m,b as r,e as a,w as D,F as g,f as s,o as f,h as C}from"./index.22cfd33d.js";const E=r("p",null,"\u5C06\u503C\u62C6\u5206\u6210\u4E24\u4E2A\u4E0D\u540C\u540D\u79F0\u7684\u952E\u503C\u5BF9\u5B58\u50A8",-1),S={class:"controls"},k=C("\u63D0\u4EA4"),x=i({__name:"example2",setup(V){const t=p({rangeDate:""}),{syncToUrl:u}=_({configs:[{key:"rangeDate",decodeKeys:["startDate","endDate"],encode:e=>({startDate:e[0].toISOString(),endDate:e[1].toISOString()}),decode:e=>({rangeDate:[e.startDate,e.endDate]})}],onDecode:(e,n)=>{Object.keys(e).forEach(o=>{t[o]=e[o]})}}),c=()=>{u(t)};return(e,n)=>{const o=s("el-date-picker"),d=s("el-button");return f(),m(g,null,[E,r("div",S,[a(o,{modelValue:t.rangeDate,"onUpdate:modelValue":n[0]||(n[0]=l=>t.rangeDate=l),type:"daterange"},null,8,["modelValue"]),a(d,{onClick:c},{default:D(()=>[k]),_:1})])],64)}}});export{x as default};