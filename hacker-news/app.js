const container = document.querySelector("#root");
const ajax = new XMLHttpRequest();
const content = document.createElement("div");
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json";
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json";
const store = {
  currentPage: 1,
};

function getData(url) {
  ajax.open("GET", url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

function newsFeed() {
  const newsFeed = getData(NEWS_URL); // 응답값을 객체로 바꾼다 (JSON 데이터만 객체로 바꿀 수 있음)
  const newsList = [];

  newsList.push("<ul>");

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
        ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
    `);
  }

  newsList.push("</ul>");
  newsList.push(`
    <div>
      <a href="#/page/${
        store.currentPage > 1 ? store.currentPage - 1 : 1
      }">이전 페이지</a>
      <a href="#/page/${
        store.currentPage < 3 ? store.currentPage + 1 : 3
      }">다음 페이지</a>
    </div>
  `);
  container.innerHTML = newsList.join("");
}

function newsDetail() {
  // 해쉬가 바뀌면! 함수가 실행되는 이벤트 추가
  const id = location.hash.substr(7); // 해시+id값에서 해시를 제외하는 문법!
  const newsContent = getData(CONTENT_URL.replace("@id", id));

  container.innerHTML = `
  <h1>${newsContent.title}</h1>

  <div>
    <a href="#/page/${store.currentPage}">목록으로</a>
  </div>
  `;
}

function router() {
  const routerPath = location.hash;
  if (routerPath === "") {
    newsFeed();
  } else if (routerPath.indexOf("#/page/") >= 0) {
    store.currentPage = Number(routerPath.substr(7)); // http://localhost:1234/#/page/3 페이지 뒤의 숫자만 출력하려면 7번째!
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener("hashchange", router);

router();
