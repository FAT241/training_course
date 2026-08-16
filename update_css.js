const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf-8');

const target = 'background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);';
const replacement = `background: 
    linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 100%),
    url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;`;

css = css.replace(target, replacement);

const targetCircles = `.login-decorative-circle {
  position: absolute;
  top: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%);
}

.login-decorative-circle-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249,115,22,0.1) 0%, rgba(249,115,22,0) 70%);
}`;

css = css.replace(targetCircles, `.login-decorative-circle { display: none; }\n.login-decorative-circle-2 { display: none; }`);

fs.writeFileSync('client/src/index.css', css, 'utf-8');
console.log('Done');
