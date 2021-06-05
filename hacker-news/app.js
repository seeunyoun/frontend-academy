const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

ajax.open("GET", NEWS_URL, false); // 데이터를 오픈한다. boolean값 -> true:비동기 false:동기
ajax.send(); // 데이터를 가져온다

const newsFeed = JSON.parse(ajax.response); // 응답값을 객체로 바꾼다 (JSON 데이터만 객체로 바꿀 수 있음)
const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  // 해쉬가 바뀌면! 함수가 실행되는 이벤트 추가
  const id = location.hash.substr(1); // 해시+id값에서 해시를 제외하는 문법!
  ajax.open("GET", CONTENT_URL.replace("@id", id), false);
  ajax.send();

  const newsContent = JSON.parse(ajax.response);
  const title = document.createElement("h1");

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.href = `#${newsFeed[i].id}`; // 해시 뒤에 id값을 같이 불러옴!
  a.innerHTML = `${newsFeed[i].title} (${newsFeed[i].comments_count})`;

  li.appendChild(a);
  ul.appendChild(li);
}

container.appendChild(ul);
container.appendChild(content);
