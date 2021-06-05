const ajax = new XMLHttpRequest();
let NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";

ajax.open("GET", NEWS_URL, false); // 데이터를 오픈한다. boolean값 -> true:비동기 false:동기
ajax.send(); // 데이터를 가져온다

const newsFeed = JSON.parse(ajax.response); // 응답값을 객체로 바꾼다 (JSON 데이터만 객체로 바꿀 수 있음)

const ul = document.createElement("ul");
for (let i = 0; i < 10; i++) {
  const li = document.createElement("li");
  li.innerHTML = newsFeed[i].title;
  ul.appendChild(li);
}

document.getElementById("root").appendChild(ul);
