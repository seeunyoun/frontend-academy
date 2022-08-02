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
  let templete = `
  <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div>
            <a href="#/page/{{__prev_page__}}" class="text-gray-500">Previous</a>
            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">Next</a>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
      {{__news_feed__}}
    </div>
  </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
    <div class="p-6 bg-white mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
      <div class="flex">
        <div class="flex-auto">
          <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>
        </div>
        <div class="text-center text-sm">
          <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
        </div>
      </div>
      <div class="flex mt-3">
        <div class="grid grid-cols-3 text-sm text-gray-500">
          <div><i class="fas fa-user mr-1">${newsFeed[i].user}</i></div>
          <div><i class="fas fa-heart mr-1">${newsFeed[i].points}</i></div>
          <div><i class="fas fa-clock mr-1">${newsFeed[i].time_ago}</i></div>
        </div>
      </div>
    </div>
    `);
  }

  templete = templete.replace("{{__news_feed__}}", newsList.join(""));
  templete = templete.replace(
    "{{__prev_page__}}",
    store.currentPage > 1 ? store.currentPage - 1 : 1
  );
  templete = templete.replace(
    "{{__next_page__}}",
    store.currentPage < 3 ? store.currentPage + 1 : 3
  );

  container.innerHTML = templete;
}

function newsDetail() {
  // 해쉬가 바뀌면! 함수가 실행되는 이벤트 추가
  const id = location.hash.substr(7); // 해시+id값에서 해시를 제외하는 문법!
  const newsContent = getData(CONTENT_URL.replace("@id", id));
  let templete = `
  <div class="bg-gray-600 min-h-screen pb-8">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="itmes-center justify-end">
            <a href="#/page/${store.currentPage}" class="text-gray-500">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="h-full border rounded-xl bg-white m-6 p-4">
      <h2>${newsContent.title}</h2>
      <div>
        ${newsContent.content}
      </div>
      {{__comments__}}
    </div>
  </div>
  `;

  function makeComment(comments, called = 0) {
    const commentString = [];

    for (let i = 0; i < comments.length; i++) {
      commentString.push(`
      <div style="padding-left: ${called * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comments[i].user}</strong> ${comments[i].time_ago}
        </div>
          <p class="text-gray-700">${comments[i].content}</p>
      </div>
      `);

      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join("");
  }
  container.innerHTML = templete.replace(
    "{{__comments__}}",
    makeComment(newsContent.comments)
  );
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
