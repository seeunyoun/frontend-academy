const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL); // 응답값을 객체로 바꾼다 (JSON 데이터만 객체로 바꿀 수 있음)
const ul = document.createElement("ul");

window.addEventListener("hashchange", function () {
  // 해쉬가 바뀌면! 함수가 실행되는 이벤트 추가
  const id = location.hash.substr(1); // 해시+id값에서 해시를 제외하는 문법!
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  const title = document.createElement("h1");

  title.innerHTML = newsContent.title;
  content.appendChild(title);
});

for (let i = 0; i < 10; i++) {
  const div = document.createElement("div");

  div.innerHTML = `
  <li>
    <a href="#${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
    </a>
  </li>
  `;

  ul.appendChild(div.firstElementChild);
}

container.appendChild(ul);
container.appendChild(content);
