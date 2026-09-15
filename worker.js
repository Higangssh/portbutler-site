// **업데이트 주소를 우리 것으로 만든다.**
//
// # 왜 이 파일이 있나
//
// Sparkle 이 보는 `appcast.xml` 주소는 **앱에 박혀서 나간다**(`branding.env`
// 의 `APPCAST_URL`). 1.0 을 GitHub 주소로 내보내면 그 판을 산 사람은 **영원히**
// 거기를 보러 간다. 저장소 이름을 바꾸거나 GitHub 을 떠나는 날 **그 사람들
// 업데이트가 그대로 끊긴다** — 그리고 되돌릴 방법이 없다. 업데이트를 못 받으니
// 새 주소를 알려줄 길도 없기 때문이다.
//
// 그래서 앱은 우리 도메인을 보게 하고, 실제 파일이 어디 있는지는 **여기서만**
// 안다. GitHub 을 떠나는 날 고칠 곳이 이 한 줄이 된다.
//
// # 왜 리다이렉트가 아니라 중계인가
//
// 302 도 Sparkle 이 따라가기는 한다. 다만 그러면 **최종 주소가 그쪽 것**이라
// 캐시·내용 유형·오류 처리가 전부 GitHub 손에 있다. 중계하면 그 셋이 우리
// 손에 남고, 브라우저 주소창에도 우리 주소만 보인다.
//
// # 왜 판 내는 절차를 안 바꾸나
//
// 판은 `portbutler-releases` 저장소에 난다(앱 zip·DMG·appcast 가 한곳에).
// 사이트는 다른 저장소다. 여기서 중계하면 **판 내는 쪽은 아무것도 안 바꿔도
// 된다** — 두 저장소에 같은 파일을 밀어 넣다가 한쪽만 밀리는 사고가
// 구조적으로 안 생긴다.

const UPSTREAM =
  'https://raw.githubusercontent.com/Higangssh/portbutler-releases/main/appcast.xml';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/appcast.xml') {
      return env.ASSETS.fetch(request);
    }

    const upstream = await fetch(UPSTREAM, {
      // 5분. 판을 낸 뒤 금방 보이면서도 GitHub 을 두드리지 않는다. Sparkle 은
      // 기본이 하루에 한 번이라 이보다 촘촘할 이유가 없다.
      cf: { cacheTtl: 300, cacheEverything: true },
      headers: { 'user-agent': 'portbutler-site-appcast' },
    });

    // **실패를 200 으로 덮지 않는다.** 빈 XML 을 돌려주면 Sparkle 은 「새 판이
    // 없다」로 읽고 조용히 넘어간다 — 업데이트가 멈춘 것을 아무도 모르게 된다.
    // 오류는 오류로 넘겨야 그쪽에서 다시 물어본다.
    if (!upstream.ok) {
      return new Response(`appcast upstream ${upstream.status}\n`, {
        status: 502,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=300',
        'x-appcast-origin': 'portbutler-releases',
      },
    });
  },
};
