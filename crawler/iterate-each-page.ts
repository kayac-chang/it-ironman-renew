import DOM from "../lib/dom.ts";
import IO from "../lib/io.ts";
import Option from "../lib/option.ts";
import Task from "../lib/task.ts";
import MATH from "../lib/math.ts";

const TAG = "Iterate Each Page";

const next = (page: number): Promise<number> =>
  Task.wait(MATH.random(500, 700))

    .then(IO.tag(`${TAG}: fetch on ${page}`))
    .then(
      IO.fetch({
        pathname: "https://ithelp.ithome.com.tw/2021ironman",
        query: { page },
      })
    )

    .then(IO.tag(`${TAG}: try to find next link on ${page}`))
    .then(IO.text)
    .then((text) =>
      Option.of(text)
        //
        .map(DOM.parse)
        .map(DOM.select('a[rel="next"]'))
    )

    .then(
      Option.match({
        some: () => next(page + 1),
        none: () => page,
      })
    );

next(1).then(IO.log(`${TAG}: finished process at page `));
