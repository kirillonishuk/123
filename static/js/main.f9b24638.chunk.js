(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{18:function(e){e.exports={bot:{type:"web",id:"762273404"}}},37:function(e,t,a){e.exports=a(79)},42:function(e,t,a){},44:function(e,t,a){},46:function(e,t,a){},76:function(e,t){},79:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),i=a(33),s=a.n(i),r=(a(42),a(19)),c=a(8),l=a(9),m=a(11),u=a(10),g=a(12),p=(a(44),a(46),a(34)),f=a.n(p),h=a(35),b=a.n(h),d=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,i=new Array(n),s=0;s<n;s++)i[s]=arguments[s];return(a=Object(m.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(i)))).createFile=function(){console.log(a.props.file.byteLength);var e=new Blob([a.props.file],{type:b.a.lookup(a.props.name.split(".")[1])});return console.log(e),URL.createObjectURL(e)},a.renderMessage={message:function(e){return o.a.createElement("div",{className:e},a.props.text)},image:function(e){return o.a.createElement("div",{className:e},o.a.createElement("img",{src:"data:image/png;base64,".concat(a.props.image),alt:"sending"}))},file:function(e){return o.a.createElement("div",{className:e},o.a.createElement("a",{href:a.createFile(),download:a.props.name,className:"file-download"},a.props.name),o.a.createElement("div",{className:"file-size"},"".concat(a.props.file.byteLength," \u0431\u0430\u0439\u0442")))}},a}return Object(g.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=f()({outgoing:"outgoing"===this.props.type,incoming:"incoming"===this.props.type,image:"image"===this.props.form,"message-box":!0});return this.renderMessage[this.props.form](e)}}]),t}(n.Component),x=a(36),y=a.n(x),v={"component-outgoing-message":function(e){return{text:e.text,type:"incoming",form:"message"}},"component-keyboard":function(e){var t="";return e.buttons.forEach(function(e,a,n){a!==n.length-1?t+="".concat(e.text,"/"):t+=e.text}),{text:"\u0412\u0430\u0440\u0438\u0430\u043d\u0442\u044b \u043e\u0442\u0432\u0435\u0442\u0430: ".concat(t),type:"incoming",form:"message"}},"component-outgoing-picture":function(e){return{image:e.image,filename:e.filename,type:"incoming",form:"image"}},"component-outgoing-document":function(e){return{file:e.file,name:e.name,type:"incoming",form:"file"}},default:function(e){return{text:e.text||"Error message!",type:"incoming",form:"message"}}},w=function(e){return e.type in v?v[e.type](e):v.default(e)},E=a(18),k=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(m.a)(this,Object(u.a)(t).call(this,e))).scrollToBottom=function(){a.chatbox&&(a.chatbox.scrollTop=a.chatbox.scrollHeight)},a.changeMessage=function(e){a.setState({text:e.target.value})},a.sendMessage=function(e){e.preventDefault();var t={bot:{type:E.bot.type,id:a.state.botId},user:a.state.userId};a.state.text&&(t=Object(r.a)({},t,{type:"message",text:a.state.text}),a.setState(function(e){return{text:"",box:e.box.concat({text:e.text,type:"outgoing",form:"message"})}})),a.state.image&&(t=Object(r.a)({},t,{image:a.state.image.split(",")[1],filename:a.state.filename,type:"picture"}),a.setState(function(e){return{image:"",filename:"",box:e.box.concat({image:e.image.split(",")[1],type:"outgoing",form:"image"})}})),t.type&&a.socket.emit("web-chat",t)},a.renderMessage=function(){return a.state.box.map(function(e,t){return o.a.createElement(d,Object.assign({key:t},e))})},a.startChat=function(){a.socket.emit("web-chat",{bot:{type:E.bot.type,id:a.state.botId},user:a.state.userId,text:"/start",type:"message"})},a.loadImage=function(e){var t=e.target.files;if(FileReader&&t&&t.length){var n=new FileReader;n.onload=function(){a.setState({image:n.result,filename:o})};var o=t[0].name,i=t[0];n.readAsDataURL(i),e.target.files=null,a.chat.focus()}else alert("Error!")},a.state={botId:"",userId:(new Date).getTime()*Math.floor(999*Math.random()+1),text:"",box:[],image:"",filename:""},a.socket=y()("wss://localhost:3015",{path:"/ws",transports:["websocket"]}),a.socket.on("web-bot-message",function(e){var t=w(e);a.setState({box:a.state.box.concat(t)})}),a}return Object(g.a)(t,e),Object(l.a)(t,[{key:"componentDidUpdate",value:function(e,t){this.state.box.length!==t.box.length&&this.scrollToBottom()}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"bot-connection"},o.a.createElement("label",{htmlFor:"bot-id"},"Bot:ID "),o.a.createElement("input",{type:"text",id:"bot-id",value:this.state.botId,onChange:function(t){e.setState({botId:t.target.value})}})),o.a.createElement("div",{className:"App",ref:function(t){e.chatbox=t}},this.renderMessage()),this.state.box.length?o.a.createElement("form",{onSubmit:this.sendMessage},o.a.createElement("input",{ref:function(t){return e.chat=t},autoFocus:!0,className:"chat-input App-input",value:this.state.text,onChange:this.changeMessage,type:"text",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435..."}),o.a.createElement("label",{htmlFor:"select-file",className:"custom-input-file"}),o.a.createElement("input",{type:"file",id:"select-file",accept:"image/*",onChange:this.loadImage})):o.a.createElement("button",{className:"chat-input start-chat-btn",onClick:this.startChat},"Start"),this.state.image?o.a.createElement("img",{src:this.state.image,className:"selected-image",alt:"selected"}):null)}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(o.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[37,2,1]]]);
//# sourceMappingURL=main.f9b24638.chunk.js.map