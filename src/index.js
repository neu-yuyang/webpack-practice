import "./assets/style.css"
function foo() {
  let obj = {
    age: 11
  }

  let objBak = { name: "yy", ...obj } // 不支持es6+语法的浏览器，会报错
  document.body.innerText = JSON.stringify(objBak)
}
foo()
